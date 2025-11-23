import { Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

/**
 * Página que gestiona las tarjetas de productos.
 */
export class ProductCard {
  readonly page: Page;
  readonly productCards: Locator;
  readonly productInCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.productInCart = page.locator('a[href*="product_details/"]');
  }

  /**
   * Devuelve la tarjeta de producto según índice.
   */
  productCard(index: number): Locator {
    return this.productCards.nth(index);
  }

  /**
   * Abre el detalle del producto mostrado en el carrito.
   */
  async openProductInCart() {
    await waitVisible(this.page, this.productInCart);
    await this.productInCart.click();
    await waitPageStable(this.page);
  }
}
