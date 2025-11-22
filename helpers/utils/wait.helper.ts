import { Locator, Page } from "@playwright/test";

/**
 * Espera a que un elemento exista, scrollea de forma cross-browser y garantiza visibilidad real.
 */
export async function waitVisible(page: Page, target: string | Locator) {
  const locator = typeof target === "string" ? page.locator(target) : target;

  try {
    await page.addStyleTag({
      content: `
        iframe, ins.adsbygoogle {
          pointer-events: none !important;
        }
      `,
    });
  } catch (e) {
    // ignore
  }

  await locator.waitFor({ state: "attached", timeout: 7000 });

  try {
    const handle = await locator.elementHandle();
    if (handle) {
      await page.evaluate((el) => {
        el.scrollIntoView({ block: "center", inline: "center", behavior: "instant" });
      }, handle);
    }
  } catch (e) {
    // ignore
  }

  await locator.waitFor({ state: "visible", timeout: 7000 });

  await page.waitForTimeout(150);
}

/**
 * Espera explícita para estabilidad general del DOM.
 */
export async function waitPageStable(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(250);
}
