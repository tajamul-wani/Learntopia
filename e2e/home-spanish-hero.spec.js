import { test, expect } from "./support/test.js";

// LT-124: Spanish learners read English in the hero question and level names.
//
// In the hero's "Try a question" card:
// 1. The question and options must be translated into Spanish via getLocalizedQuiz.
// 2. The level name under the progress bar must display the translated level name ("Novato Coder").
// 3. Picking the correct Spanish answer yields positive feedback and XP.

test.describe("hero try-a-question localization", () => {
  test("renders translated Spanish question, options, and level name", async ({ page }) => {
    // Set active language to Spanish before initial mount
    await page.addInitScript(() => {
      localStorage.setItem("learntopia_lang", "es");
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const tryCard = page.locator("main").filter({ hasText: /prueba una pregunta|probar/i }).first();
    await expect(tryCard).toBeVisible();

    // The hero question must be in Spanish
    await expect(tryCard.getByText("¿Qué es Python?")).toBeVisible();
    await expect(tryCard.getByText("What is Python?")).toBeHidden();

    // Spanish options must be visible
    await expect(tryCard.getByText("Un lenguaje de computadora")).toBeVisible();
    await expect(tryCard.getByText("Un tipo de serpiente")).toBeVisible();
    await expect(tryCard.getByText("A computer language")).toBeHidden();

    // The level name under the progress bar must be localized ("Novato Coder", not "Rookie Coder")
    await expect(tryCard.getByText("Novato Coder")).toBeVisible();
    await expect(tryCard.getByText("Rookie Coder")).toBeHidden();

    // Answering correctly works in Spanish
    await tryCard.getByRole("button", { name: /Un lenguaje de computadora/i }).click();

    // Verdict appears in Spanish
    const verdict = page.getByTestId("try-verdict");
    await expect(verdict).toBeVisible();
    await expect(verdict).toContainText("¡Correcto!");
  });

  test("English hero question and level name remain accurate in English", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("learntopia_lang", "en");
    });

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Loading page")).toBeHidden({ timeout: 20000 });

    const tryCard = page.locator("main").filter({ hasText: /try a question/i }).first();
    await expect(tryCard).toBeVisible();

    await expect(tryCard.getByText("What is Python?")).toBeVisible();
    await expect(tryCard.getByText("A computer language")).toBeVisible();
    await expect(tryCard.getByText("Rookie Coder")).toBeVisible();
  });
});
