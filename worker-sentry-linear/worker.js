/**
 * Learntopia Sentry -> Linear bridge (Cloudflare Worker).
 *
 * Sentry's native Linear integration can only set a title plus a backlink; it
 * never fills the issue body. This Worker receives Sentry's issue-alert webhook
 * and creates the Linear issue itself, so the task actually carries the error
 * message, culprit, stack frames and context needed to triage it from Linear.
 *
 * Flow: Sentry alert fires -> webhook here -> verify HMAC -> ack immediately
 * (Sentry treats >1s as a timeout) -> create the Linear issue in the background.
 *
 * Secrets (never committed) — set with wrangler:
 *   npx wrangler secret put LINEAR_API_KEY
 *   npx wrangler secret put SENTRY_CLIENT_SECRET
 *
 * Deploy: see README.md.
 */

const LINEAR_API = "https://api.linear.app/graphql";

// Where auto-filed errors land. These are NAMES, not ids: the Worker looks the
// ids up against Linear at runtime, so no workspace identifiers are stored in
// this repo. Override any of them with a [vars] entry in wrangler.toml if the
// names ever change. The assignee is whoever owns LINEAR_API_KEY.
const DEFAULTS = {
  teamName: "Learntopia",
  projectName: "Learntopia",
  stateName: "Backlog",
  labelName: "Bug",
  priority: 2, // 0 none, 1 urgent, 2 high, 3 medium, 4 low
};

// Resolved ids are cached per isolate, so repeat errors skip the lookup.
let cachedTargets = null;

// Cap the stack we copy into Linear so the description stays readable.
const MAX_FRAMES = 8;

/** Constant-time string compare (avoids leaking the signature via timing). */
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Verify Sentry's HMAC-SHA256 signature over the raw request body. */
async function verifySignature(secret, rawBody, signature) {
  if (!secret || !signature) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
  const hex = [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return safeEqual(hex, signature.toLowerCase());
}

/** Sentry sends tags as [[key, value], ...]; normalise to a plain object. */
function tagsToObject(tags) {
  const out = {};
  if (Array.isArray(tags)) {
    for (const t of tags) {
      if (Array.isArray(t) && t.length >= 2) out[String(t[0])] = String(t[1]);
      else if (t && typeof t === "object" && "key" in t) out[String(t.key)] = String(t.value);
    }
  } else if (tags && typeof tags === "object") {
    for (const [k, v] of Object.entries(tags)) out[k] = String(v);
  }
  return out;
}

/** Pull the top stack frames (Sentry lists them oldest-first, so reverse). */
function topFrames(event) {
  const values = event?.exception?.values;
  const frames = Array.isArray(values) && values.length
    ? values[values.length - 1]?.stacktrace?.frames
    : null;
  if (!Array.isArray(frames)) return [];
  return frames
    .slice()
    .reverse()
    .slice(0, MAX_FRAMES)
    .map((f) => {
      const file = f?.filename || f?.abs_path || "unknown";
      const line = f?.lineno != null ? `:${f.lineno}` : "";
      const fn = f?.function ? `  ${f.function}` : "";
      return `  ${file}${line}${fn}`;
    });
}

/**
 * Sentry sends event.timestamp as a Unix epoch in seconds (often fractional),
 * though some payloads carry an ISO string. Render either as readable UTC.
 */
function formatWhen(ts) {
  if (ts == null) return null;
  const d = typeof ts === "number" ? new Date(ts * 1000) : new Date(ts);
  if (Number.isNaN(d.getTime())) return String(ts);
  return `${d.toISOString().slice(0, 19).replace("T", " ")} UTC`;
}

/** Build the Linear issue body from a Sentry event. */
function buildDescription(event) {
  const tags = tagsToObject(event?.tags);
  const lines = [];

  lines.push(`**${event?.title || "Unknown error"}**`);
  lines.push("");

  const meta = [
    `Level: ${event?.level || tags.level || "unknown"}`,
    `Environment: ${event?.environment || tags.environment || "unknown"}`,
    `Platform: ${event?.platform || "unknown"}`,
  ];
  if (event?.release || tags.release) meta.push(`Release: ${event.release || tags.release}`);
  lines.push(meta.join(" · "));

  if (event?.culprit) lines.push(`Culprit: \`${event.culprit}\``);
  const when = formatWhen(event?.timestamp);
  if (when) lines.push(`When: ${when}`);

  const frames = topFrames(event);
  if (frames.length) {
    lines.push("", "**Stack (top frames)**", "```", ...frames, "```");
  }

  const ctx = [];
  if (tags.browser) ctx.push(`browser: ${tags.browser}`);
  if (tags.os) ctx.push(`os: ${tags.os}`);
  const url = event?.request?.url || tags.url;
  if (url) ctx.push(`url: ${url}`);
  if (ctx.length) lines.push("", "**Context**", ...ctx.map((c) => `- ${c}`));

  if (event?.web_url) lines.push("", `[View in Sentry](${event.web_url})`);

  // Dedupe marker — looked up before creating so a recurring error can't
  // produce duplicate Linear issues. Keep this line last and unchanged.
  lines.push("", `sentry-issue: ${event?.issue_id || event?.event_id || "unknown"}`);

  return lines.join("\n");
}

async function linearRequest(apiKey, query, variables) {
  const res = await fetch(LINEAR_API, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.errors) {
    throw new Error(`Linear API error: ${res.status} ${JSON.stringify(json?.errors || json)}`);
  }
  return json?.data;
}

/** True when a Linear issue already carries this Sentry issue's marker. */
async function alreadyFiled(apiKey, marker) {
  const query = `query($q:String!){ issues(filter:{ description:{ contains:$q } }, first:1){ nodes { id identifier } } }`;
  try {
    const data = await linearRequest(apiKey, query, { q: marker });
    return Boolean(data?.issues?.nodes?.length);
  } catch (err) {
    // If the lookup fails, prefer filing a possible duplicate over losing the
    // report entirely — a missed error is worse than a repeated one.
    console.error("Dedupe lookup failed, creating anyway:", err.message);
    return false;
  }
}

/**
 * Look up the team/state/label/project/assignee ids by name. Keeps workspace
 * identifiers out of the repo and makes the Worker self-configuring.
 */
async function resolveTargets(apiKey, env) {
  if (cachedTargets) return cachedTargets;

  const teamName = env.LINEAR_TEAM_NAME || DEFAULTS.teamName;
  const projectName = env.LINEAR_PROJECT_NAME || DEFAULTS.projectName;
  const stateName = env.LINEAR_STATE_NAME || DEFAULTS.stateName;
  const labelName = env.LINEAR_LABEL_NAME || DEFAULTS.labelName;

  const query = `
    query($teamName:String!, $projectName:String!) {
      viewer { id }
      teams(filter:{ name:{ eq:$teamName } }, first:1) {
        nodes {
          id
          states(first:50) { nodes { id name } }
          labels(first:50) { nodes { id name } }
        }
      }
      projects(filter:{ name:{ eq:$projectName } }, first:1) { nodes { id } }
    }`;
  const data = await linearRequest(apiKey, query, { teamName, projectName });

  const team = data?.teams?.nodes?.[0];
  if (!team) throw new Error(`Linear team not found: ${teamName}`);
  const state = team.states?.nodes?.find((s) => s.name === stateName);
  if (!state) throw new Error(`Linear state "${stateName}" not found on team ${teamName}`);

  cachedTargets = {
    teamId: team.id,
    stateId: state.id,
    labelId: team.labels?.nodes?.find((l) => l.name === labelName)?.id || null,
    projectId: data?.projects?.nodes?.[0]?.id || null,
    assigneeId: data?.viewer?.id || null,
    priority: Number(env.LINEAR_PRIORITY ?? DEFAULTS.priority),
  };
  return cachedTargets;
}

async function createLinearIssue(env, event) {
  const marker = `sentry-issue: ${event?.issue_id || event?.event_id || "unknown"}`;
  if (await alreadyFiled(env.LINEAR_API_KEY, marker)) {
    console.log("Skipping, already filed:", marker);
    return;
  }

  const t = await resolveTargets(env.LINEAR_API_KEY, env);
  const mutation = `
    mutation($input: IssueCreateInput!) {
      issueCreate(input: $input) { success issue { identifier } }
    }`;
  const input = {
    teamId: t.teamId,
    stateId: t.stateId,
    priority: t.priority,
    title: event?.title ? String(event.title).slice(0, 250) : "Sentry error",
    description: buildDescription(event),
  };
  // Optional targets — skip rather than fail if a project/label/user is missing.
  if (t.projectId) input.projectId = t.projectId;
  if (t.assigneeId) input.assigneeId = t.assigneeId;
  if (t.labelId) input.labelIds = [t.labelId];

  const data = await linearRequest(env.LINEAR_API_KEY, mutation, { input });
  console.log("Created Linear issue:", data?.issueCreate?.issue?.identifier);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }
    if (!env.LINEAR_API_KEY || !env.SENTRY_CLIENT_SECRET) {
      return new Response("Misconfigured: missing secrets", { status: 500 });
    }

    const raw = await request.text();
    const signature = request.headers.get("sentry-hook-signature") || "";
    if (!(await verifySignature(env.SENTRY_CLIENT_SECRET, raw, signature))) {
      return new Response("Invalid signature", { status: 401 });
    }

    // Sentry also pings this URL for installation and other resources. Ack them
    // so the integration installs cleanly, but only act on issue alerts.
    const resource = request.headers.get("sentry-hook-resource") || "";
    if (resource !== "event_alert") {
      return new Response("ignored", { status: 200 });
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    const event = payload?.data?.event;
    if (!event) return new Response("No event in payload", { status: 200 });

    // Ack now; Sentry counts anything over ~1s as a timeout. The Linear write
    // continues in the background.
    ctx.waitUntil(
      createLinearIssue(env, event).catch((err) =>
        console.error("Failed to create Linear issue:", err.message)
      )
    );
    return new Response("ok", { status: 200 });
  },
};
