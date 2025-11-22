import { expect, test } from "@playwright/test";
import { Logger } from "../helpers/utils/log.helper";
import path from "path";
import { HomePage } from "../pages/Home.page";
import { blockAds } from "../helpers/utils/adsBlocker";
import { AEUser, getAuth } from "../helpers/utils/user.helper";
import { getSavedUser } from "../helpers/utils/session.helper";
import { ProductDetailPage } from "../pages/ProductDetail.page";

test.describe.serial("Suite P2", () => {
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

  test.describe("Test con sesión", () => {
    test.use({
      storageState: "auth/chromium.session.json",
    });

    test("RF-05: Review a un producto", async ({ page }) => {
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
        await product.submitReview(creds.email);
      });
    });
  });
});
