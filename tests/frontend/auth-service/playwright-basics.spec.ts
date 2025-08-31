/* eslint-disable */
import { test, expect, Page, Locator } from '@playwright/test';

test.describe('Playwright Basics - Essential Commands for Beginners', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Navigation Commands', async () => {
    // Navigate to URL
    await page.goto('https://example.com');

    // Navigate back/forward
    await page.goBack();
    await page.goForward();

    // Reload page
    await page.reload();

    // Wait for page load
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Element Selection Methods', async () => {
    await page.goto('https://example.com');

    // Different ways to select elements
    const byId: Locator = page.locator('#element-id');
    const byClass: Locator = page.locator('.class-name');
    const byTagName: Locator = page.locator('button');
    const byAttribute: Locator = page.locator('[data-testid="submit"]');
    const byText: Locator = page.locator('text=Login');
    const byPartialText: Locator = page.locator('text=/Log/');
    const byCss: Locator = page.locator('input[type="email"]');
    const byXPath: Locator = page.locator('//button[@class="submit"]');

    // Built-in role selectors (recommended)
    const byRole: Locator = page.getByRole('button', { name: 'Submit' });
    const byLabel: Locator = page.getByLabel('Email address');
    const byPlaceholder: Locator = page.getByPlaceholder('Enter your email');
    const byTestId: Locator = page.getByTestId('login-form');
    const byTitle: Locator = page.getByTitle('Close dialog');
    const byAltText: Locator = page.getByAltText('User avatar');
  });

  test('Click Actions', async () => {
    await page.goto('https://example.com');

    // Basic click
    await page.click('button');

    // Click with options
    await page.click('button', {
      button: 'right', // Right click
      clickCount: 2, // Double click
      delay: 100, // Delay between mousedown and mouseup
      force: true, // Skip actionability checks
      modifiers: ['Shift'], // Hold Shift while clicking
    });

    // Using locator
    const button = page.locator('button');
    await button.click();

    // Click at specific position
    await page.click('button', { position: { x: 10, y: 20 } });
  });

  test('Form Interactions', async () => {
    await page.goto('https://example.com');

    // Text input
    await page.fill('input[name="email"]', 'test@example.com');
    await page.type('input[name="password"]', 'password123');

    // Clear input
    await page.fill('input[name="email"]', '');

    // Checkbox/Radio
    await page.check('input[type="checkbox"]');
    await page.uncheck('input[type="checkbox"]');

    // Dropdown selection
    await page.selectOption('select[name="country"]', 'US');
    await page.selectOption('select', { label: 'United States' });
    await page.selectOption('select', { value: 'us' });
    await page.selectOption('select', { index: 0 });

    // File upload
    await page.setInputFiles('input[type="file"]', 'path/to/file.jpg');
    await page.setInputFiles('input[type="file"]', ['file1.jpg', 'file2.jpg']);
  });

  test('Keyboard Actions', async () => {
    await page.goto('https://example.com');

    // Single key press
    await page.press('input', 'Enter');
    await page.press('input', 'Tab');
    await page.press('input', 'Escape');

    // Key combinations
    await page.press('input', 'Control+A');
    await page.press('input', 'Control+C');
    await page.press('input', 'Control+V');

    // Multiple keys
    await page.keyboard.down('Shift');
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.up('Shift');

    // Type text
    await page.keyboard.type('Hello World');
  });

  test('Wait Commands', async () => {
    await page.goto('https://example.com');

    // Wait for element
    await page.waitForSelector('#dynamic-content');
    await page.waitForSelector('button', { state: 'visible' });
    await page.waitForSelector('button', { state: 'hidden' });
    await page.waitForSelector('button', { state: 'attached' });

    // Wait for URL
    await page.waitForURL('**/dashboard');
    await page.waitForURL(/.*dashboard.*/);

    // Wait for network
    await page.waitForResponse('**/api/users');
    await page.waitForRequest('**/api/login');

    // Wait for function
    await page.waitForFunction(() => window.innerWidth < 800);

    // Wait with timeout
    await page.waitForSelector('#element', { timeout: 5000 });

    // Wait for specific time (avoid in production)
    await page.waitForTimeout(2000);
  });

  test('Basic Assertions', async () => {
    await page.goto('https://example.com');

    // Page assertions
    await expect(page).toHaveURL('https://example.com');
    await expect(page).toHaveTitle('Example Domain');
    await expect(page).toHaveTitle(/Example/);

    // Element visibility
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#hidden')).toBeHidden();
    await expect(page.locator('button')).toBeEnabled();
    await expect(page.locator('button')).toBeDisabled();

    // Text assertions
    await expect(page.locator('h1')).toHaveText('Welcome');
    await expect(page.locator('h1')).toContainText('Wel');
    await expect(page.locator('p')).toHaveText(/Hello.*/);

    // Attribute assertions
    await expect(page.locator('input')).toHaveAttribute('type', 'email');
    await expect(page.locator('input')).toHaveClass('form-control');
    await expect(page.locator('input')).toHaveId('email-input');

    // Value assertions
    await expect(page.locator('input')).toHaveValue('test@example.com');
    await expect(page.locator('input')).toBeEmpty();

    // Count assertions
    await expect(page.locator('li')).toHaveCount(5);
    await expect(page.locator('li')).toHaveCount(0); // No elements
  });

  test('Advanced Assertions', async () => {
    await page.goto('https://example.com');

    // Custom assertions with poll
    await expect(async () => {
      const response = await page.request.get('/api/status');
      expect(response.status()).toBe(200);
    }).toPass({ timeout: 10000 });

    // Screenshot assertions
    await expect(page).toHaveScreenshot('homepage.png');
    await expect(page.locator('#header')).toHaveScreenshot('header.png');

    // Multiple elements
    const items = page.locator('.item');
    await expect(items).toHaveText(['Item 1', 'Item 2', 'Item 3']);

    // Soft assertions (continues on failure)
    await expect.soft(page.locator('h1')).toHaveText('Wrong text');
    await expect.soft(page.locator('h2')).toBeVisible();
  });

  test('Element State Checks', async () => {
    await page.goto('https://example.com');

    const element = page.locator('button');

    // Check states without assertion
    const isVisible = await element.isVisible();
    const isEnabled = await element.isEnabled();
    const isChecked = await element.isChecked();
    const isHidden = await element.isHidden();
    const isDisabled = await element.isDisabled();

    // Get element properties
    const textContent = await element.textContent();
    const innerHTML = await element.innerHTML();
    const value = await element.inputValue();
    const attribute = await element.getAttribute('class');

    console.log({ isVisible, textContent, attribute });
  });

  test('Page Information', async () => {
    await page.goto('https://example.com');

    // Get page info
    const url = page.url();
    const title = await page.title();
    const content = await page.content(); // Full HTML

    // Viewport
    const viewportSize = page.viewportSize();
    await page.setViewportSize({ width: 1200, height: 800 });

    // Screenshots
    await page.screenshot({ path: 'page.png' });
    await page.screenshot({
      path: 'page.png',
      fullPage: true,
      clip: { x: 0, y: 0, width: 800, height: 600 },
    });

    // Element screenshot
    await page.locator('#header').screenshot({ path: 'header.png' });
  });

  test('Multiple Elements Handling', async () => {
    await page.goto('https://example.com');

    // Get all matching elements
    const items = page.locator('.item');

    // Count elements
    const count = await items.count();

    // Iterate through elements
    for (let i = 0; i < count; i++) {
      const item = items.nth(i);
      const text = await item.textContent();
      console.log(`Item ${i}: ${text}`);
    }

    // Get specific element
    const firstItem = items.first();
    const lastItem = items.last();
    const thirdItem = items.nth(2);

    // Filter elements
    const visibleItems = items.locator(':visible');
    const checkedItems = items.locator(':checked');
  });

  test('Browser Context and Cookies', async ({ context }) => {
    // Set cookies
    await context.addCookies([
      {
        name: 'session',
        value: 'abc123',
        domain: 'example.com',
        path: '/',
      },
    ]);

    await page.goto('https://example.com');

    // Get cookies
    const cookies = await context.cookies();
    console.log('All cookies:', cookies);

    // Clear cookies
    await context.clearCookies();

    // Local storage
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      sessionStorage.setItem('temp', 'value');
    });

    const theme = await page.evaluate(() => localStorage.getItem('theme'));
    console.log('Theme:', theme);
  });
});
