import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

/**
 * Página para gestionar el carrito, agregar productos por índice,
 * validar items y validar precios totales.
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

    // Cards en Products
    this.productCards = page.locator(".product-image-wrapper");
    this.addToCartSelector = ".product-overlay a.add-to-cart";
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");

    // Popup "Added!"
    this.addedPopup = page.getByText("Added!");
    this.viewCartLink = page.getByRole("link", { name: "View Cart" });
    this.continueShoppingButton = page.locator(".btn-success");
    this.womenMenu = page.getByRole("link", { name: "Women" });
    this.topsMenu = page.getByRole("link", { name: "Tops" });

    // Cart table
    this.cartRows = page.locator("#cart_info_table tbody tr");
    this.unitPrices = page.locator("td.cart_price p");
    this.quantities = page.locator("td.cart_quantity");
    this.totalPrices = page.locator("td.cart_total p");
    this.deleteItem = page.locator("a.cart_quantity_delete");

    // Menús
    this.productsMenu = page.getByRole("link", { name: "Products" });
    this.cartMenu = page.getByRole("link", { name: "Cart" });
  }

  async addProductByIndex(...indexes: number[]): Promise<void> {
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

      // Popup “Added!”
      await waitVisible(this.page, this.addedPopup);
      await expect(this.addedPopup).toBeVisible();

      if (isLast) {
        await this.viewCartLink.click();
      } else {
        await this.continueShoppingButton.click();
      }

      await waitPageStable(this.page);
    }
  }

  async validateCartItems(count: number): Promise<void> {
    await this.cartMenu.click();
    await expect(this.cartRows).toHaveCount(count);
  }

  async validateTotal(index = 0): Promise<void> {
    await this.cartMenu.click();

    // Obtiene los 3 valores desde los 3 locators
    const rawUnit = await this.unitPrices.nth(index).innerText();
    const rawQty = await this.quantities.nth(index).innerText();
    const rawTotal = await this.totalPrices.nth(index).innerText();

    // Parseo universal
    const unit = Number(rawUnit.match(/\d+/)?.[0] ?? 0);
    const qty = Number(rawQty.match(/\d+/)?.[0] ?? 0);
    const total = Number(rawTotal.match(/\d+/)?.[0] ?? 0);

    // Validación
    expect(total, `ERROR: total (${total}) ≠ unit (${unit}) * qty (${qty})`).toBe(unit * qty);
  }

  /**
   * Busca "Jean", valida que los resultados contengan "Jean"
   * y devuelve cuántos resultados aparecieron.
   */
  async searchJeans(): Promise<number> {
    await this.searchInput.fill("Jean");
    await this.searchButton.click();

    // Esperar que carguen cards
    await waitVisible(this.page, this.productCards.first());

    const count = await this.productCards.count();

    // Validar que hay resultados
    expect(count, "No se encontraron productos para 'Jean'").toBeGreaterThan(0);

    // Validar que cada card tiene texto 'Jean'
    for (let i = 0; i < count; i++) {
      const card = this.productCards.nth(i);
      const text = await card.innerText();

      expect(text.toLowerCase(), `El producto #${i} NO contiene la palabra "Jean"`).toContain(
        "jean",
      );
    }

    return count;
  }

  /**
   * Entra a Women → Tops, valida que los resultados contengan "Top"
   * y devuelve cuántos resultados aparecieron.
   */
  async searchTops(): Promise<number> {
    await this.womenMenu.click();
    await this.topsMenu.click();

    // Esperar cards cargadas
    await waitVisible(this.page, this.productCards.first());

    const count = await this.productCards.count();

    expect(count, "No se encontraron productos en Women → Tops").toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const card = this.productCards.nth(i);
      const text = await card.innerText();

      expect(text.toLowerCase(), `El producto #${i} NO contiene la palabra 'Top'`).toContain("top");
    }

    return count;
  }

  async deleteProductInCart(...indices: number[]): Promise<void> {
    // Ordenar los índices de mayor a menor para eliminar del último al primero
    const sortedIndices = [...indices].sort((a, b) => b - a);

    for (const index of sortedIndices) {
      // Usamos cartRows para identificar la fila
      const row = this.cartRows.nth(index);
      // Usamos deleteItem para el botón dentro de esa fila
      const btn = row.locator(this.deleteItem);
      await btn.click();

      // Espera corta para estabilidad
      await this.page.waitForTimeout(300);
    }
  }
}
