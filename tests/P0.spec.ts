import test, { expect } from "@playwright/test";
import { Logger } from "../helpers/utils/log.helper";
import path from "path";
import { HomePage } from "../pages/Home.page";
import { AuthPage } from "../pages/Auth.page";
import { AccountPage } from "../pages/Account.page";
import { saveSessionWithUser } from "../helpers/utils/session.helper";
import { blockAds } from "../helpers/utils/adsBlocker";
import { getAuth, makeUser, AEUser } from "../helpers/utils/user.helper";
import { CartPage } from "../pages/Cart.page";
import { CheckoutPage } from "../pages/Checkout.page";

test.describe.serial("Suite P0", () => {
  let user: AEUser;

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

  test("RF-01: Registro de usuario válido", async ({ page }) => {
    const projectName = test.info().project.name;
    Logger.debug("Dispositivo Actual: ", projectName);

    const BASE_USERNAME = "jescobedof";
    user = makeUser(BASE_USERNAME);

    const home = new HomePage(page);
    const auth = new AuthPage(page);
    const account = new AccountPage(page);

    await test.step("Abrir home y navegar a Signup/Login", async () => {
      await home.open();
      await home.gotoSingupLogin();
    });

    await test.step("Registrar email y nombre", async () => {
      await auth.startSignup(user.name, user.email);
    });

    await test.step("Completar formulario de registro y validar cuenta creada", async () => {
      await auth.completeAccountForm(user);
    });

    await test.step("Cerrar sesión", async () => {
      await account.logout();
    });
  });

  test("RF-02: Login válido y persistencia", async ({ page }) => {
    const projectName = test.info().project.name;
    Logger.debug("Dispositivo Actual: ", projectName);

    const creds = getAuth(user);

    const home = new HomePage(page);
    const auth = new AuthPage(page);
    const account = new AccountPage(page);

    await test.step("Abrir home y navegar a login", async () => {
      await home.open();
      await home.gotoSingupLogin();
    });

    await test.step("Login con credenciales creadas", async () => {
      await auth.login(creds.email, creds.password);
    });

    await test.step("Verificar usuario logueado como Logged in as", async () => {
      await account.assertLoggedIn();
    });

    await test.step("Guardar sesión persistente", async () => {
      const sessionPath = path.join(process.cwd(), "auth", `${projectName}.session.json`);
      const userPath = path.join(process.cwd(), "data", `${projectName}.user.json`);
      await saveSessionWithUser(page, user, sessionPath, userPath);
    });
  });

  test.describe("Tests con sesión", () => {
    test.use({
      storageState: "auth/chromium.session.json",
    });

    test("RF-03: Añadir producto al carrito desde el listado", async ({ page }) => {
      const home = new HomePage(page);
      const cart = new CartPage(page);

      await test.step("Abrir home con sesión activa", async () => {
        await home.open();
        await expect(page.getByText(/Logged in as/i)).toBeVisible();
      });

      await test.step("Ir a la página de productos", async () => {
        await home.gotoproducts();
      });

      await test.step("Añadir producto por índice al carrito", async () => {
        await cart.addProductByIndex(0);
      });

      await test.step("Validar que el carrito tiene 1 producto", async () => {
        await cart.validateCartItems(1);
      });
    });

    test("RF-04: Checkout exitoso", async ({ page }) => {
      const home = new HomePage(page);
      const checkout = new CheckoutPage(page);

      await test.step("Abrir home con sesión activa", async () => {
        await home.open();
        await expect(page.getByText(/Logged in as/i)).toBeVisible();
      });

      await test.step("Ir al carrito", async () => {
        await home.gotoCart();
      });

      await test.step("Validar los item en carrito", async () => {
        await checkout.validateCartItemCount(1);
      });

      await test.step("Realizar el checkout", async () => {
        await checkout.proceedToCheckout();
        await checkout.fillPaymentAndFinish();
      });
    });
  });
});
