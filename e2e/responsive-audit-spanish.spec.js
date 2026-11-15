import { expect } from "@playwright/test";
import { test as signedIn, createLearner, enrollLearner, signIn } from "./support/emulator.js";

// LT-126: the suite never runs the app in Spanish.
//
// 174 tests in the suite ran only in English before this audit. Spanish copy is
// noticeably longer than English ("Start free" vs "Empezar gratis", "Try a quiz"
// vs "Probar un cuestionario", "Syllabus" vs "Plan de Cursos"). Layouts and
// controls that fit comfortably in English can wrap onto multiple lines, cut
// off silently, or cause horizontal scroll when rendered in Spanish.
//
// This audit exercises the core routes in Spanish across all standard breakpoints:
//   * asserts that real Spanish content is actively mounted and displayed
//   * verifies that no route causes horizontal overflow / scrolling
//   * verifies that no content is clipped silently without an ellipsis or clamp
//   * verifies that touch targets satisfy WCAG 2.5.8 AA minimum size (24x24 px)

const WIDTHS = [320, 390, 420, 525, 768, 1024, 1350];

const MIN_TARGET = 24;

const AUDIT = (minTarget) => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.opacity !== "0";
  };

  const decorative = (el) =>
    el.closest('[aria-hidden="true"]') !== null || getComputedStyle(el).pointerEvents === "none";

  const name = (el) =>
    `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ""}.${String(el.className || "")
      .split(" ")
      .slice(0, 2)
      .join(".")}`;

  const doc = document.documentElement;
  const overflows = [];
  if (doc.scrollWidth > doc.clientWidth + 1) {
    overflows.push(`page scrollWidth ${doc.scrollWidth}px exceeds clientWidth ${doc.clientWidth}px`);
  }

  const clipped = [];
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el) || decorative(el)) continue;
    const s = getComputedStyle(el);
    if (s.overflowX !== "hidden" && s.overflowX !== "clip") continue;
    if (s.textOverflow === "ellipsis") continue;
    if (s.webkitLineClamp && s.webkitLineClamp !== "none") continue;
    if (el.hasAttribute("data-clips-intentionally")) continue;
    if (el.scrollWidth <= el.clientWidth + 1) continue;

    const box = el.getBoundingClientRect();
    const spilling = [...el.querySelectorAll("*")].filter((child) => {
      const r = child.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && r.right > box.right + 1 && !decorative(child);
    });
    if (spilling.length) {
      clipped.push(
        `${name(el)} cuts off ${name(spilling[0])} (content ${el.scrollWidth}px in a ${el.clientWidth}px box)`
      );
    }
  }

  const small = [];
  for (const el of document.querySelectorAll('a[href], button, [role="button"], input, select')) {
    if (!visible(el) || decorative(el)) continue;
    if (el.closest("p, li")) continue;
    if (el.tagName === "A" && getComputedStyle(el).display === "inline") continue;
    const r = el.getBoundingClientRect();
    if (r.width < minTarget || r.height < minTarget) {
      small.push(`${name(el)} is ${Math.round(r.width)}x${Math.round(r.height)}`);
    }
  }

  return {
    overflows,
    clipped: [...new Set(clipped)],
    small: [...new Set(small)],
  };
};

const settled = (page) =>
  page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));

const routeRecaptcha = async (page) => {
  await page.route(/recaptcha/, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  );
};

const seeded = async (page, testInfo) => {
  await routeRecaptcha(page);
  await page.addInitScript(() => {
    localStorage.setItem("learntopia_lang", "es");
  });

  const learner = await createLearner(testInfo);
  await enrollLearner(learner.uid, 1, {
    title: "Python for Kids: Build Your First Game!",
    totalModules: 4,
    completedModules: [0, 1],
  });
  await signIn(page, learner);
  return learner;
};

const ROUTES = [
  ["/", "home", "Cursos"],
  ["/courses", "the catalog", "¡Comienza tu Aventura de Aprendizaje!"],
  ["/course/2", "a course preview", "Lo que podrás hacer"],
  ["/course/1?tab=syllabus", "a curriculum", "Plan de Cursos"],
  ["/quiz", "the quiz list", "Centro de Cuestionarios"],
  ["/quiz?quiz=python", "a quiz in progress", "Pregunta"],
  ["/leaderboard", "the leaderboard", "Tabla de Posiciones"],
  ["/dashboard", "my profile", "Mi Perfil"],
  ["/contact", "contact", "Nos encantaría escucharte"],
  ["/doc", "the docs", "Documentación de Learntopia"],
];

signedIn.describe("Spanish responsive audit: no clipping, overflow, or undersized touch targets", () => {
  for (const [path, label, spanishMarker] of ROUTES) {
    signedIn(`${label} in Spanish at every breakpoint`, async ({ page }, testInfo) => {
      await seeded(page, testInfo);

      await page.setViewportSize({ width: WIDTHS[0], height: 900 });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

      // Guarantee the page is actively rendered in Spanish
      if (spanishMarker) {
        await expect(page.getByText(spanishMarker, { exact: false }).first()).toBeVisible({ timeout: 15000 });
      }

      const overflows = [];
      const clipped = [];
      const small = [];
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await settled(page);
        const res = await page.evaluate(AUDIT, MIN_TARGET);
        for (const item of res.overflows) overflows.push(`${width}px: ${item}`);
        for (const item of res.clipped) clipped.push(`${width}px: ${item}`);
        for (const item of res.small) small.push(`${width}px: ${item}`);
      }

      expect(overflows, `${label} (Spanish) causes horizontal scroll:\n  ${overflows.join("\n  ")}\n`).toEqual([]);
      expect(clipped, `${label} (Spanish) cuts content off with nothing to show for it:\n  ${clipped.join("\n  ")}\n`).toEqual([]);
      expect(small, `${label} (Spanish) has controls under ${MIN_TARGET}px:\n  ${small.join("\n  ")}\n`).toEqual([]);
    });
  }
});
