import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

/**
 * Página para gestionar el carrito: agregar productos,
 * validar ítems y validar totales.
 */
export class CartPage {
  readonly page: Page;

  // ====== LOCATORS ======
  readonly productCards: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly addToCartSelector: string;
  readonly addedPopup: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;
  readonly womenMenu: Locator;
  readonly topsMenu: Locator;

  readonly cartRows: Locator;
  readonly unitPrices: Locator;
  readonly quantities: Locator;
  readonly totalPrices: Locator;
  readonly deleteItem: Locator;

  readonly productsMenu: Locator;
  readonly cartMenu: Locator;

  constructor(page: Page) {
    this.page = page;

    this.productCards = page.locator(".product-image-wrapper");
    this.addToCartSelector = ".product-overlay a.add-to-cart";
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");

    this.addedPopup = page.getByText("Added!");
    this.viewCartLink = page.getByRole("link", { name: "View Cart" });
    this.continueShoppingButton = page.locator(".btn-success");
    this.womenMenu = page.getByRole("link", { name: "Women" });
    this.topsMenu = page.getByRole("link", { name: "Tops" });

    this.cartRows = page.locator("#cart_info_table tbody tr");
    this.unitPrices = page.locator("td.cart_price p");
    this.quantities = page.locator("td.cart_quantity");
    this.totalPrices = page.locator("td.cart_total p");
    this.deleteItem = page.locator("a.cart_quantity_delete");

    this.productsMenu = page.getByRole("link", { name: "Products" });
    this.cartMenu = page.getByRole("link", { name: "Cart" });
  }

  /**
   * Agrega uno o varios productos al carrito según sus índices.
   */
  async addProductByIndex(...indexes: number[]): Promise<number> {
    await this.productsMenu.click();

    for (let pos = 0; pos < indexes.length; pos++) {
      const i = indexes[pos]!;
      const isLast = pos === indexes.length - 1;

      const card = this.productCards.nth(i);

      await waitVisible(this.page, card);
      await card.hover();

      const addBtn = card.locator(this.addToCartSelector).first();
      await waitVisible(this.page, addBtn);
      await addBtn.click();

      await waitVisible(this.page, this.addedPopup);
      await expect(this.addedPopup).toBeVisible();

      if (isLast) {
        await this.viewCartLink.click();
      } else {
        await this.continueShoppingButton.click();
      }

      await waitPageStable(this.page);
    }

    return indexes.length;
  }

  /**
   * Valida que el carrito tenga la cantidad de filas esperada.
   */
  async validateCartItems(count: number): Promise<number> {
    await this.cartMenu.click();
    await expect(this.cartRows).toHaveCount(count);

    return count;
  }

  /**
   * Valida que el total de un ítem sea unitPrice * quantity.
   */
  async validateTotal(index = 0): Promise<{ unit: number; qty: number; total: number }> {
    await this.cartMenu.click();

    const rawUnit = await this.unitPrices.nth(index).innerText();
    const rawQty = await this.quantities.nth(index).innerText();
    const rawTotal = await this.totalPrices.nth(index).innerText();

    const unit = Number(rawUnit.match(/\d+/)?.[0] ?? 0);
    const qty = Number(rawQty.match(/\d+/)?.[0] ?? 0);
    const total = Number(rawTotal.match(/\d+/)?.[0] ?? 0);

    expect(total, `ERROR: total (${total}) ≠ unit (${unit}) * qty (${qty})`).toBe(unit * qty);

    return { unit, qty, total };
  }

  /**
   * Busca “Jean” y valida que los productos contengan ese texto.
   */
  async searchJeans(): Promise<number> {
    await this.searchInput.fill("Jean");
    await this.searchButton.click();
    await waitVisible(this.page, this.productCards.first());

    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await this.productCards.nth(i).innerText();
      expect(text.toLowerCase()).toContain("jean");
    }

    return count;
  }

  /**
   * Entra a Women → Tops y valida que los productos contengan “Top”.
   */
  async searchTops(): Promise<number> {
    await this.womenMenu.click();
    await this.topsMenu.click();
    await waitVisible(this.page, this.productCards.first());

    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const text = await this.productCards.nth(i).innerText();
      expect(text.toLowerCase()).toContain("top");
    }

    return count;
  }

  /**
   * Elimina uno o varios ítems del carrito por índice.
   * Retornamos un objeto con eliminados y cantidad restante
   */
  async deleteProductInCart(...indices: number[]): Promise<{ deleted: number; remaining: number }> {
    const sortedIndices = [...indices].sort((a, b) => b - a);

    for (const index of sortedIndices) {
      const row = this.cartRows.nth(index);
      const btn = row.locator(this.deleteItem);
      await btn.click();
      await this.page.waitForTimeout(300);
    }

    const remaining = await this.cartRows.count();

    return { deleted: indices.length, remaining };
  }
}
