import { Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

/**
 * Página de detalle de producto: información, cantidad,
 * agregar al carrito y envío de reviews.
 */
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

  /**
   * Espera a que la información del producto esté visible.
   */
  async productInformation() {
    await waitVisible(this.page, this.productInfo);
    await waitPageStable(this.page);
  }

  /**
   * Define la cantidad en el campo de cantidad del producto.
   */
  async setQuantity(qty: number) {
    await waitVisible(this.page, this.quantityInput);
    await this.quantityInput.fill(qty.toString());
  }

  /**
   * Agrega el producto al carrito.
   */
  async addToCart() {
    await this.addToCartBtn.click();
    await waitPageStable(this.page);
  }

  /**
   * Abre el carrito desde el detalle del producto.
   */
  async viewCart() {
    await this.viewCartBtn.click();
    await waitPageStable(this.page);
  }

  /**
   * Abre el detalle de un producto según su índice.
   */
  async openProductByIndex(index: number) {
    const product = this.productCards.nth(index);
    const detailLink = product.locator(this.productDetailLinkSelector);
    await detailLink.click();
    await waitPageStable(this.page);
  }

  /**
   * Envía un review del producto y valida que el mensaje de éxito aparezca.
   */
  async submitReview(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.reviewTextarea.fill("Muy buen producto");
    await this.submitReviewButton.click();

    const messageElement = this.reviewSuccessMessage;
    await messageElement.waitFor({ state: 'visible' });
    const reviewMessage = await messageElement.textContent();

    return reviewMessage?.trim() || '';
  }
}
