# Sentry -> Linear bridge (Cloudflare Worker)

Files a Linear issue, **with full error context**, whenever Sentry raises a new
issue alert.

Sentry's built-in Linear integration can only set a title and a backlink — the
Linear description comes out empty, so you can't triage without opening Sentry.
This Worker builds the issue itself: message, level, environment, culprit, top
stack frames, browser/OS/URL, the Sentry permalink, and a dedupe marker.

Created issues land as: **Backlog**, priority **High**, label **Bug**, project
**Learntopia**, assigned to the owner.

## Setup

### 1. Deploy the Worker

```bash
cd worker-sentry-linear
npx wrangler deploy
```

Note the deployed URL, e.g. `https://learntopia-sentry-linear.<subdomain>.workers.dev`.

### 2. Create the Sentry custom integration

Sentry: **Settings -> Developer Settings -> Custom Integrations -> New**
(Sentry's docs call these "internal integrations"; the UI says "Custom".)

- **Webhook URL**: the Worker URL from step 1
- Enable **Alert Rule Action** (so it can be picked as an alert action)
- Under **Webhooks**, enable the **issue alert** events
- Save, then copy the **Client Secret**

### 3. Add the secrets

```bash
npx wrangler secret put LINEAR_API_KEY        # a Linear API key
npx wrangler secret put SENTRY_CLIENT_SECRET  # from step 2
```

The Worker rejects any request whose `Sentry-Hook-Signature` doesn't verify
against `SENTRY_CLIENT_SECRET`, so the endpoint can't be driven by anyone else.

### 4. Point the alert at it

In the Sentry issue alert ("Notify via Linear"):

- Trigger: **A new issue is created** (first-seen only, so one task per distinct error)
- Action: **remove** "Create a Linear issue with these…" and add
  **"Send a notification via \<your custom integration\>"**

Removing the old action matters — leaving both files **two** Linear issues per error.

## Configuration

**No Linear workspace ids are stored in this repo.** The Worker resolves them at
runtime by *name*, using the account that owns `LINEAR_API_KEY`:

| What | Default | Override via `[vars]` in wrangler.toml |
|---|---|---|
| Team | `Learntopia` | `LINEAR_TEAM_NAME` |
| Project | `Learntopia` | `LINEAR_PROJECT_NAME` |
| Status | `Backlog` | `LINEAR_STATE_NAME` |
| Label | `Bug` | `LINEAR_LABEL_NAME` |
| Priority | `2` (High) | `LINEAR_PRIORITY` |

The assignee is whoever owns the API key. Project, label and assignee are all
optional — if one can't be found the issue is still filed without it. Only the
team and the status are required. Resolved ids are cached per isolate, so the
lookup runs once rather than on every error.

If you rename the team or the `Backlog` status in Linear, set the matching var
(or rename back) — otherwise the Worker logs `Linear team not found: …` and no
issue is created.

## How it behaves

- Verifies the HMAC signature, then **acks immediately** (Sentry treats a
  response slower than ~1s as a timeout) and writes to Linear in the background
  via `ctx.waitUntil`.
- Ignores non-`event_alert` webhooks (installation pings etc.) with a 200.
- **Dedupe**: each description ends with `sentry-issue: <id>`. Before creating,
  the Worker searches Linear for that marker and skips if it already exists. If
  the lookup itself fails it still files the issue — a missed error is worse
  than a duplicate.

## Troubleshooting

```bash
npx wrangler tail        # live logs for the deployed Worker
```

- **401 Invalid signature** — `SENTRY_CLIENT_SECRET` doesn't match the
  integration's Client Secret.
- **Nothing appears in Linear** — check `wrangler tail` for a Linear API error;
  usually an invalid `LINEAR_API_KEY` or a changed team/project/state id (those
  ids are constants at the top of `worker.js`).
- **Duplicates** — the old "Create a Linear issue" action is still on the alert.
