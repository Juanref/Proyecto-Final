import { expect, Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";
import { AEUser } from "../helpers/utils/user.helper";

/**
 * Página de autenticación: login y registro.
 */
export class AuthPage {
  readonly page: Page;

  // ======== SIGNUP FLOW ========
  readonly signupName: Locator;
  readonly signupEmail: Locator;
  readonly signupButton: Locator;

  // Register form fields
  readonly password: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly address: Locator;
  readonly state: Locator;
  readonly country: Locator;
  readonly city: Locator;
  readonly zipCode: Locator;
  readonly mobile: Locator;
  readonly createAccountBtn: Locator;
  readonly registerError: Locator;

  readonly accountCreatedTitle: Locator;
  readonly continueButton: Locator;

  // ======== LOGIN FLOW ========
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginError: Locator;

  /**
   * Inicializa la página de autenticación.
   * @param page Instancia de Playwright Page.
   */
  constructor(page: Page) {
    this.page = page;

    // Signup inputs
    this.signupName = page.locator('[data-qa="signup-name"]');
    this.signupEmail = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');

    // Signup register form
    this.password = page.locator('[data-qa="password"]');
    this.firstName = page.locator('[data-qa="first_name"]');
    this.lastName = page.locator('[data-qa="last_name"]');
    this.address = page.locator('[data-qa="address"]');
    this.country = page.locator('[data-qa="country"]');
    this.state = page.locator('[data-qa="state"]');
    this.city = page.locator('[data-qa="city"]');
    this.zipCode = page.locator('[data-qa="zipcode"]');
    this.mobile = page.locator('[data-qa="mobile_number"]');
    this.createAccountBtn = page.locator('[data-qa="create-account"]');
    this.registerError = page.locator(".signup-form p");

    this.accountCreatedTitle = page.getByText("ACCOUNT CREATED!");
    this.continueButton = page.locator('[data-qa="continue-button"]');

    // Login inputs
    this.loginEmail = page.locator('[data-qa="login-email"]');
    this.loginPassword = page.locator('[data-qa="login-password"]');
    this.loginButton = page.locator('[data-qa="login-button"]');
    this.loginError = page.locator(".login-form p");
  }

  /**
   * Inicia el flujo de registro completando nombre y correo inicial.
   *
   * @param name Nombre del usuario.
   * @param email Correo electrónico del usuario.
   * @returns Promesa que se resuelve cuando se avanza al formulario de registro.
   *
   * @example
   * const auth = new AuthPage(page);
   * await auth.startSignup("Juan", "juan@test.com");
   */
  async startSignup(name: string, email: string): Promise<void> {
    await waitVisible(this.page, this.signupName);
    await this.signupName.fill(name);
    await this.signupEmail.fill(email);
    await this.signupButton.click();
    await waitPageStable(this.page);
  }

  /**
   * Completa el formulario de creación de cuenta y confirma el registro.
   *
   * @param u Objeto {@link AEUser} con los datos completos del usuario.
   * @returns Promesa que se resuelve cuando la cuenta queda creada.
   *
   * @example
   * await authPage.completeAccountForm(user);
   */
  async completeAccountForm(u: AEUser): Promise<void> {
    await waitVisible(this.page, this.password);

    await this.password.fill(u.password);
    await this.firstName.fill(u.firstName);
    await this.lastName.fill(u.lastName);
    await this.address.fill(u.address);
    await this.country.selectOption({ label: u.country });
    await this.state.fill(u.state);
    await this.city.fill(u.city);
    await this.zipCode.fill(u.zipCode);
    await this.mobile.fill(u.mobileNumber);

    await this.createAccountBtn.click();

    await waitVisible(this.page, this.accountCreatedTitle);
    await this.continueButton.click();
    await waitPageStable(this.page);
  }

  /**
   * Realiza login en la plataforma.
   *
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Promesa que se resuelve cuando se procesa el login.
   *
   * @example
   * await authPage.login("correo@test.com", "1234");
   */
  async login(email: string, password: string): Promise<void> {
    await waitVisible(this.page, this.loginEmail);
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
    await waitPageStable(this.page);
  }

  /**
   * Verifica que el login falle mostrando el mensaje de error.
   *
   * @returns Promesa que se resuelve tras validar el fallo del login.
   *
   * @example
   * await authPage.assertFailLogin();
   */
  async assertFailLogin(): Promise<void> {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toContainText(/incorrect/i);
  }

  /**
   * Verifica que el login falle mostrando el mensaje de error.
   *
   * @returns Promesa que se resuelve tras validar el fallo del login.
   *
   * @example
   * await authPage.assertFailLogin();
   */
  async assertFailRegister(): Promise<void> {
    await expect(this.registerError).toBeVisible();
    await expect(this.registerError).toContainText(/already/i);
  }


}
