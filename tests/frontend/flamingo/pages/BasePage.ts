import { Page } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }
}
