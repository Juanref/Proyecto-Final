import { Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

/**
 * Página principal del sitio.
 */
export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly ContactUsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.productsLink = page.getByRole("link", { name: "Products" });
    this.cartLink = page.getByRole("link", { name: "Cart" });
    this.ContactUsLink = page.getByRole("link", { name: "Contact us" });
  }

  /**
   * Abre la página principal.
   */
  async open() {
    await this.page.goto("https://automationexercise.com/");
    await waitPageStable(this.page);
  }

  /**
   * Navega hacia Signup / Login.
   */
  async gotoSingupLogin() {
    await waitVisible(this.page, this.signupLoginLink);
    await this.signupLoginLink.click();
  }

  /**
   * Navega hacia Products.
   */
  async gotoproducts() {
    await waitVisible(this.page, this.productsLink);
    await this.productsLink.click();
  }

  /**
   * Navega hacia Cart.
   */
  async gotoCart() {
    await waitVisible(this.page, this.cartLink);
    await this.cartLink.click();
  }

  /**
   * Navega hacia Contact Us.
   */
  async gotoContactUs() {
    await waitVisible(this.page, this.ContactUsLink);
    await this.ContactUsLink.click();
  }
}
