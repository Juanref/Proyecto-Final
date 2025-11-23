import { type Locator, type Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

/**
 * Página que gestiona el flujo completo de checkout.
 */
export class CheckoutPage {
  readonly page: Page;

  readonly cartItems: Locator;
  readonly proceedToCheckoutButton: Locator;
  readonly placeOrderButton: Locator;
  readonly nameInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly checkoutTitle: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartItems = page.locator("#cart_info_table tbody tr");
    this.proceedToCheckoutButton = page.locator("a.btn.btn-default.check_out");
    this.placeOrderButton = page.getByRole("link", { name: "Place Order" });
    this.nameInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.getByRole("button", { name: "Pay and Confirm" });
    this.checkoutTitle = page.getByText("Order Placed!");
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  /**
   * Valida que el carrito tenga la cantidad exacta de productos esperada.
   */
  async validateCartItemCount(expectedCount: number): Promise<void> {
    const count = await this.cartItems.count();
    if (count !== expectedCount) {
      throw new Error(`Se esperaban ${expectedCount} items, pero hay ${count}.`);
    }
  }

  /**
   * Avanza desde el carrito hacia el formulario de checkout.
   */
  async proceedToCheckout(): Promise<void> {
    await waitVisible(this.page, this.proceedToCheckoutButton);
    await this.page.waitForTimeout(120);
    await this.proceedToCheckoutButton.click();
    await waitPageStable(this.page);
  }

  /**
   * Completa el formulario de pago y finaliza la compra.
   */
  async fillPaymentAndFinish(): Promise<void> {
    await this.placeOrderButton.click();

    await this.nameInput.fill("Juan Escobedo");
    await this.cardNumberInput.fill("4111111111111111");
    await this.cvcInput.fill("123");
    await this.expiryMonthInput.fill("12");
    await this.expiryYearInput.fill("2030");

    await this.payAndConfirmButton.click();
    await waitVisible(this.page, this.checkoutTitle);

    await this.continueButton.click();
    await waitPageStable(this.page);
  }
}
