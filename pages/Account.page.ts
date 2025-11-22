import { expect, Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

/**
 * Página de cuenta del usuario: Usuario logedo y Logout.
 */
export class AccountPage {
  readonly page: Page;
  readonly loggedAs: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.loggedAs = page.locator("li").filter({ hasText: "Logged in as" });
    this.logoutLink = page.getByRole("link", { name: "Logout" });
  }

  /**
   * Verifica que el usuario esté autenticado mediante
   * la visibilidad del texto "Logged in as".
   */
  async assertLoggedIn(): Promise<void> {
    await waitVisible(this.page, this.loggedAs);
  }

  /**
   * Cierra sesión del usuario haciendo click en "Logout".
   * Luego espera estabilidad del DOM y valida que la URL
   * redirija hacia la página de login.
   */
  async logout(): Promise<void> {
    await this.logoutLink.click();
    await waitPageStable(this.page);
    await expect(this.page).toHaveURL(/login/);
  }
}
