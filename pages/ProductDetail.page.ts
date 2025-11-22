import { Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

export class ProductDetailPage {
  readonly page: Page;

  readonly productInfo: Locator;
  readonly quantityInput: Locator;
  readonly addToCartBtn: Locator;
  readonly viewCartBtn: Locator;

  readonly productCards: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly reviewTextarea: Locator;
  readonly submitReviewButton: Locator;
  readonly reviewSuccessMessage: Locator;
  readonly productDetailLinkSelector: string;

  constructor(page: Page) {
    this.page = page;
    this.productInfo = page.locator(".product-information");
    this.quantityInput = page.locator("#quantity");
    this.addToCartBtn = page.locator("button:has-text('Add to cart')");
    this.viewCartBtn = page.getByRole("link", { name: "View Cart" });

    this.productCards = page.locator(".product-image-wrapper");
    this.nameInput = page.locator("#name");
    this.emailInput = page.locator("#email");
    this.reviewTextarea = page.locator("#review");
    this.submitReviewButton = page.getByRole("button", { name: "Submit" });
    this.reviewSuccessMessage = page.getByText("Thank you for your review.");
    this.productDetailLinkSelector = "a[href*='product_details']";
  }

  async productInformation() {
    await waitVisible(this.page, this.productInfo);
    await waitPageStable(this.page);
  }

  async setQuantity(qty: number) {
    await waitVisible(this.page, this.quantityInput);
    await this.quantityInput.fill(qty.toString());
  }

  async addToCart() {
    await this.addToCartBtn.click();
    await waitPageStable(this.page);
  }

  async viewCart() {
    await this.viewCartBtn.click();
    await waitPageStable(this.page);
  }

  /**
   * Abre el detalle de un producto usando su índice en la lista.
   */
  async openProductByIndex(index: number) {
    const product = this.productCards.nth(index);
    const detailLink = product.locator(this.productDetailLinkSelector);
    await detailLink.click();
    await waitPageStable(this.page);
  }

  /**
   * Llena el formulario de review, lo envía y valida el mensaje de éxito.
   */
  async submitReview(email: string) {
    await this.nameInput.fill("Juan Escobedo");
    await this.emailInput.fill(email);
    await this.reviewTextarea.fill("Muy buen producto");
    await this.submitReviewButton.click();

    await this.reviewSuccessMessage.waitFor({ state: "visible" });
  }
}
