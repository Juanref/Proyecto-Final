import { type Locator, type Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";
import path from "path";

/**
 * Página que gestiona el formulario "Contact Us".
 */
export class ContactUsPage {
  readonly page: Page;

  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextarea: Locator;
  readonly uploadFileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.locator('[data-qa="name"]');
    this.emailInput = page.locator('[data-qa="email"]');
    this.subjectInput = page.locator('[data-qa="subject"]');
    this.messageTextarea = page.locator('[data-qa="message"]');
    this.uploadFileInput = page.locator('input[type="file"]');
    this.submitButton = page.locator('[data-qa="submit-button"]');
    this.successMessage = this.page.locator('#contact-page .alert-success');
    this.homeButton = this.page.locator('#contact-page .btn-success');
  }

  /**
   * Completa el formulario, sube archivo y envía el contacto.
   */
  async submitContact(name: string, email: string) {
    const dialogPromise = this.page.waitForEvent("dialog").then(async (dialog) => {
      console.log("⚠ ALERT DETECTED:", dialog.message());
      await dialog.accept();
    });

    await waitVisible(this.page, this.nameInput);
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectInput.fill("Aún no recibo mi producto");
    await this.messageTextarea.fill(
      "Ya han pasado dos semanas de la fecha indicada y mi producto no llega mi domicilio"
    );

    const filePath = path.resolve("data/doc_prueba.pdf");
    await waitVisible(this.page, this.uploadFileInput);
    await this.uploadFileInput.setInputFiles(filePath);

    await waitVisible(this.page, this.submitButton);

    await Promise.all([
      dialogPromise,
      this.submitButton.click()
    ]);

    await waitPageStable(this.page);

    await this.successMessage.waitFor({ state: "visible" });
    await waitVisible(this.page, this.homeButton);
    await this.homeButton.click();
    await waitPageStable(this.page);
  }
}
