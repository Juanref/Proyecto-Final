import { expect, Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";
import { AEUser } from "../helpers/utils/user.helper";

/**
 * Página de autenticación: Registro y login.
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
   * Inicia el flujo de registro completando nombre y correo.
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
   */
  async assertFailLogin(): Promise<void> {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toContainText(/incorrect/i);
  }

  /**
   * Verifica que el registro falle mostrando el mensaje de error.
   */
  async assertFailRegister(): Promise<void> {
    await expect(this.registerError).toBeVisible();
    await expect(this.registerError).toContainText(/already/i);
  }
}
