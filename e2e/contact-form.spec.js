import { test, expect, listDocs } from "./support/emulator.js";

/**
 * LT-82. The contact form is the one place a stranger with no account can
 * write to Firestore, because a guardian who cannot sign in still has to be
 * able to reach us. These cover the cheap abuse, which is all the client can
 * reasonably stop: a bot driving the real form, and a person sending the same
 * message again and again.
 *
 * What is deliberately NOT covered here, because no browser test can reach
 * it: a script holding the public Firebase config writes to Firestore without
 * ever loading this page. The rules bound what such a write may contain
 * (test/firestore.rules.test.js) and App Check enforcement is what stops it
 * arriving at all (LT-92).
 */

const fill = async (page, marker) => {
  await page.getByLabel(/name/i).first().fill("Concerned Guardian");
  await page.getByLabel(/email/i).first().fill("guardian@example.test");
  await page.getByLabel(/subject/i).first().fill("About my child's account");
  await page
    .getByLabel(/message/i)
    .first()
    .fill(`Please could you help me with my child's progress. ${marker}`);
};

const messagesMatching = async (marker) =>
  (await listDocs("ContactMessages")).filter((m) => (m.message || "").includes(marker));

test.describe("contact form (LT-82)", () => {
  test("a real message is stored, with the server's own timestamp", async ({ page }, testInfo) => {
    const marker = `real-${Date.now()}-${testInfo.workerIndex}`;
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await fill(page, marker);
    await page.getByRole("button", { name: /send/i }).click();

    // The form holds a submission back until the minimum fill time has passed,
    // so this is slower than a click normally is.
    await expect(page).toHaveURL(/\/thank-you/, { timeout: 30000 });

    const [stored] = await messagesMatching(marker);
    expect(stored, "the message never reached Firestore").toBeTruthy();
    expect(stored.name).toBe("Concerned Guardian");
    expect(stored.email).toBe("guardian@example.test");
    // Written by serverTimestamp(), which the rules now require.
    expect(stored.submittedAt).toBeTruthy();
  });

  test("filling the hidden field thanks the sender and writes nothing", async ({ page }, testInfo) => {
    const marker = `trap-${Date.now()}-${testInfo.workerIndex}`;
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await fill(page, marker);

    // Drive the honeypot the way something reading the markup would: set the
    // value on the element and let React see the event. fill() would refuse,
    // since the field is not visible to a user.
    await page.getByTestId("contact-trap").evaluate((el) => {
      const setValue = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      ).set;
      setValue.call(el, "http://spam.example");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    await page.getByRole("button", { name: /send/i }).click();

    // Indistinguishable from success, so nothing is learned by probing.
    await expect(page).toHaveURL(/\/thank-you/, { timeout: 30000 });
    expect(await messagesMatching(marker), "the trap submission was stored").toEqual([]);
  });

  test("a second message straight after the first is refused, and says why", async ({ page }, testInfo) => {
    const first = `throttle-a-${Date.now()}-${testInfo.workerIndex}`;
    const second = `throttle-b-${Date.now()}-${testInfo.workerIndex}`;

    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await fill(page, first);
    await page.getByRole("button", { name: /send/i }).click();
    await expect(page).toHaveURL(/\/thank-you/, { timeout: 30000 });
    expect(await messagesMatching(first)).toHaveLength(1);

    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await fill(page, second);
    await page.getByRole("button", { name: /send/i }).click();

    // Refused in words rather than silently, because the sender is a person.
    await expect(page.getByText(/couple of minutes/i)).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/contact/);
    expect(await messagesMatching(second), "the throttle let a second message through").toEqual([]);
  });

  test("the hidden field adds no sideways scroll on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/contact", { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("contact-trap")).toBeAttached();
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflows, "the contact page scrolls sideways at 390px").toBe(false);
  });
});
