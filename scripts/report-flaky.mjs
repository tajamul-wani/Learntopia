/**
 * Make a flaky Playwright run visible.
 *
 * A test that fails and then passes on retry is reported as "flaky", and
 * Playwright exits 0. On 2026-10-14 all three CI workflows reported success on
 * a merge commit while a test had genuinely failed inside the run, and three
 * different specs did that across six runs the same day. Every one was
 * invisible behind a green tick.
 *
 * The owner's call was to keep the retries, so a genuine blip does not block a
 * merge, and to make the flake impossible to miss instead. This reads the JSON
 * reporter output and writes a GitHub warning annotation plus a line in the job
 * summary for each one.
 *
 * It never fails the build. That is the point: the run stays green and the
 * flake stops being silent.
 */
import { readFileSync, appendFileSync } from "node:fs";

const REPORT = "playwright-report/results.json";

let report;
try {
  report = JSON.parse(readFileSync(REPORT, "utf8"));
} catch {
  // No report means the run died before writing one, which the job's own exit
  // code already says. Nothing useful to add.
  console.log(`No ${REPORT}; nothing to report.`);
  process.exit(0);
}

/** Playwright nests suites arbitrarily deep, so walk rather than assume. */
const flaky = [];
const walk = (suite, trail = []) => {
  const here = suite.title ? [...trail, suite.title] : trail;
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      if (test.status === "flaky") {
        flaky.push({
          where: [...here, spec.title].filter(Boolean).join(" › "),
          line: spec.line,
          file: suite.file || here[0] || "",
          attempts: (test.results || []).length,
        });
      }
    }
  }
  for (const child of suite.suites || []) walk(child, here);
};
for (const suite of report.suites || []) walk(suite);

if (flaky.length === 0) {
  console.log("No flaky tests in this run.");
  process.exit(0);
}

// ::warning is what puts it on the pull request without failing the job.
for (const f of flaky) {
  const at = f.file ? `file=${f.file},line=${f.line},` : "";
  console.log(
    `::warning ${at}title=Flaky test::${f.where} failed and then passed on retry ` +
      `(${f.attempts} attempts). It is green only because it was retried.`
  );
}

const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
  const rows = flaky
    .map((f) => `| \`${f.file}:${f.line}\` | ${f.where} | ${f.attempts} |`)
    .join("\n");
  appendFileSync(
    summary,
    `\n## ${flaky.length} flaky test${flaky.length === 1 ? "" : "s"}\n\n` +
      `These passed, but only after a retry. The run is green; the failure was real.\n\n` +
      `| Spec | Test | Attempts |\n|---|---|---|\n${rows}\n`
  );
}

console.log(`${flaky.length} flaky test(s) reported.`);
