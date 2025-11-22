import { Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

export class ProductCard {
  readonly page: Page;
  readonly productCards: Locator;
  readonly productInCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.productInCart = page.locator('a[href*="product_details/"]');
  }

  productCard(index: number): Locator {
    return this.productCards.nth(index);
  }

  async openProductInCart() {
    await waitVisible(this.page, this.productInCart);
    await this.productInCart.click();
    await waitPageStable(this.page);
  }
}
