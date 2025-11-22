import { expect, test } from "@playwright/test";
import { Logger } from "../helpers/utils/log.helper";
import path from "path";
import { HomePage } from "../pages/Home.page";
import { blockAds } from "../helpers/utils/adsBlocker";
import { getAuth, AEUser } from "../helpers/utils/user.helper";
import { AuthPage } from "../pages/Auth.page";
import { getSavedUser } from "../helpers/utils/session.helper";
import { CartPage } from "../pages/Cart.page";
import { ProductCard } from "../pages/ProductCard.page";
import { ProductDetailPage } from "../pages/ProductDetail.page";

test.describe.serial("Suite P1", () => {
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

    test("RF-05: Modificar cantidad de producto y validar total", async ({ page }) => {
      const home = new HomePage(page);
      const product = new ProductCard(page);
      const productdetail = new ProductDetailPage(page);
      const cart = new CartPage(page);

      await test.step("Abrir home con sesión activa", async () => {
        await home.open();
        await expect(page.getByText(/Logged in as/i)).toBeVisible();
      });

      await test.step("Añadir producto por índice al carrito", async () => {
        await cart.addProductByIndex(0);
      });

      await test.step("Validar que el carrito tiene 1 producto", async () => {
        await cart.validateCartItems(1);
      });

      await test.step("Entrar al detalle del producto", async () => {
        await product.openProductInCart();
        await productdetail.productInformation();
      });

      await test.step("Indicar la cantidad del producto", async () => {
        await productdetail.setQuantity(3);
      });

      await test.step("Añadir producto al carrito", async () => {
        await productdetail.addToCart();
      });

      await test.step("Ir al carrito", async () => {
        await productdetail.viewCart();
      });

      await test.step("Validar que el total sea correcto", async () => {
        await cart.validateTotal();
      });
    });

    test("RF-06: Búsqueda de productos", async ({ page }) => {
      const home = new HomePage(page);
      const cart = new CartPage(page);

      await test.step("Abrir home con sesión activa", async () => {
        await home.open();
        await expect(page.getByText(/Logged in as/i)).toBeVisible();
      });

      await test.step("Ir al carrito", async () => {
        await home.gotoproducts();
      });

      await test.step("Buscar Jean y validar resultados", async () => {
        const count = await cart.searchJeans();
        Logger.info(`Cantidad de productos encontrados: ${count}`);
      });

      await test.step("Buscar Top y validar resultados", async () => {
        const count = await cart.searchTops();
        Logger.info(`Cantidad de productos encontrados: ${count}`);
      });
    });

    test("RF-07: Eliminar producto del carrito", async ({ page }) => {
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
        await cart.addProductByIndex(0, 1, 3, 4);
      });

      await test.step("Eliminar producto 1", async () => {
        await cart.deleteProductInCart(1, 3);
      });
    });
  });

  test("RF-08: Validaciones de formulario en login/registro", async ({ page }) => {
    const projectName = test.info().project.name;
    Logger.debug("Dispositivo Actual: ", projectName);

    const creds = getAuth(user);

    const home = new HomePage(page);
    const auth = new AuthPage(page);

    await test.step("Abrir home y navegar a Signup/Login", async () => {
      await home.open();
      await home.gotoSingupLogin();
    });

    await test.step("Login con credenciales inválidas", async () => {
      await auth.login(creds.email, "123456789");
    });

    await test.step("Validar mensaje de error", async () => {
      await auth.assertFailLogin();
    });

    await test.step("Registro con email existente", async () => {
      await auth.startSignup(user.name, user.email);
    });

    await test.step("Validar mensaje de error", async () => {
      await auth.assertFailRegister();
    });
  });
});
