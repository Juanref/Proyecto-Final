import { expect, test } from "@playwright/test";
import { Logger } from "../helpers/utils/log.helper";
import path from "path";
import { HomePage } from "../pages/Home.page";
import { blockAds } from "../helpers/utils/adsBlocker";
import { AEUser, getAuth } from "../helpers/utils/user.helper";
import { getSavedUser } from "../helpers/utils/session.helper";
import { ProductDetailPage } from "../pages/ProductDetail.page";
import { ContactUsPage } from "../pages/ContactUs.page";

/**
 * Suite P2 — Pruebas de prioridad baja:
 * Reviews, contacto y flujos secundarios que requieren sesión activa.
 */
test.describe.serial("Suite P2", () => {
  test.use({
    storageState: "auth/chromium.session.json",
  });

  let user: AEUser;

  test.beforeAll(async () => {
    const userPath = "data/chromium.user.json";
    user = getSavedUser<AEUser>(userPath);
  });

  test.beforeEach(async ({ page, browserName }, info) => {
    Logger.start("TEST");
    Logger.info(` -> ${info.project.name} | ${browserName}`);
    await blockAds(page);
  });

  test.afterEach(async ({ browserName, page }, info) => {
    Logger.end();
    const filePath = path.join(
      process.cwd(),
      "artifacts",
      `xpl_${info.project.name}_${browserName}.png`,
    );
    await page.screenshot({ path: filePath });
  });

  test("RF-09: Review a un producto", async ({ page }) => {
    const home = new HomePage(page);
    const product = new ProductDetailPage(page);

    const creds = getAuth(user);

    await test.step("Abrir home con sesión activa", async () => {
      await home.open();
      await expect(page.getByText(/Logged in as/i)).toBeVisible();
    });

    await test.step("Ir a la página de productos", async () => {
      await home.gotoproducts();
    });

    await test.step("Seleccionar un producto e ingresar al detalle", async () => {
      await product.openProductByIndex(1);
    });

    await test.step("Llenar formulario de review", async () => {
      await product.submitReview(creds.name, creds.email);
    });
  });

  test("RF-10: Envío de formulario contáctanos", async ({ page }) => {
    const home = new HomePage(page);
    const contact = new ContactUsPage(page);

    const creds = getAuth(user);

    await test.step("Abrir home con sesión activa", async () => {
      await home.open();
      await expect(page.getByText(/Logged in as/i)).toBeVisible();
    });

    await test.step("Ir a la página de Contact us", async () => {
      await home.gotoContactUs();
    });

    await test.step("Llenar formulario y enviarlo", async () => {
      await contact.submitContact(creds.name, creds.email);
    });
  });
});
