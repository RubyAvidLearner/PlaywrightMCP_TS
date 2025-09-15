import { BasePage } from './BasePage';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page, process.env.BASE_URL);
  }
}
