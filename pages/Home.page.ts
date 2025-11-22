import { Locator, Page } from "@playwright/test";
import { waitPageStable, waitVisible } from "../helpers/utils/wait.helper";

export class HomePage {
  readonly page: Page;
  readonly signupLoginLink: Locator;
  readonly products: Locator;
  readonly viewCartLink: Locator;


  constructor(page: Page){
    this.page = page;
    this.signupLoginLink = page.getByRole('link', {name: 'Signup / Login'})
    this.products = page.getByRole('link', {name: 'Products'})
    this.viewCartLink = page.getByRole("link", { name: "Cart" });
  }

  async open(){
    await this.page.goto('https://automationexercise.com/')
    await waitPageStable(this.page)
  }

  async gotoSingupLogin(){
    await waitVisible( this.page, this.signupLoginLink);
    await this.signupLoginLink.click()
  }

  async gotoproducts(){
    await waitVisible( this.page, this.products);
    await this.products.click()
  }

  async gotoCart() {
    await waitVisible(this.page, this.viewCartLink);
    await this.viewCartLink.click();
  }
  
}