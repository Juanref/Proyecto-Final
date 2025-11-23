import test, { expect } from "@playwright/test";
import path from "path";
import { blockAds } from "../../helpers/utils/adsBlocker";
import { Logger } from "../../helpers/utils/log.helper";
import { saveSessionWithUser } from "../../helpers/utils/session.helper";
import { AEUser, getAuth, makeUser } from "../../helpers/utils/user.helper";
import { AccountPage } from "../../pages/Account.page";
import { AuthPage } from "../../pages/Auth.page";
import { CartPage } from "../../pages/Cart.page";
import { CheckoutPage } from "../../pages/Checkout.page";
import { HomePage } from "../../pages/Home.page";

/**
 * Suite P0 — Pruebas críticas del flujo principal:
 * Registro, login, cart y checkout.
 */
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

  test("RF-01: Registro de usuario válido", async ({ page, browserName }) => {
    Logger.debug("Dispositivo Actual: ", browserName);

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
      const messageSuccess = await auth.completeAccountForm(user);
      Logger.info(`${messageSuccess}`);
    });

    await test.step("Cerrar sesión", async () => {
      await account.logout();
    });
  });

  test("RF-02: Login válido y persistencia", async ({ page, browserName }) => {
    Logger.debug("Dispositivo Actual: ", browserName);

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
      const userLogIn = await account.assertLoggedIn();
      Logger.info(`${userLogIn}`);
    });

    await test.step("Guardar sesión persistente", async () => {
      const sessionPath = path.join(process.cwd(), "auth", `${browserName}.session.json`);
      const userPath = path.join(process.cwd(), "data", `${browserName}.user.json`);
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
        const count = await cart.validateCartItems(1);
        Logger.info(`Cantidad de productos encontrados: ${count}`);
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
        const count = await checkout.validateCartItemCount(1);
        Logger.info(`Cantidad de productos encontrados: ${count}`);
      });

      await test.step("Realizar el checkout", async () => {
        await checkout.proceedToCheckout();
        const checkoutSuccess = await checkout.fillPaymentAndFinish();
        Logger.info(`${checkoutSuccess}`);
      });
    });
  });
});
