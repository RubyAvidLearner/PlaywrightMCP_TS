import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],                                    // For local development - interactive UI
    ['junit', { outputFile: 'test-results.xml' }], // For CI/CD - machine readable
    ['allure-playwright', { 
      detail: true, 
      outputFolder: 'allure-results',
      suiteTitle: 'Playwright Test Suite'
    }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'frontend-auth-service',
      testDir: './tests/frontend/auth-service',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'frontend-user-service',
      testDir: './tests/frontend/user-service',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'backend-api-service',
      testDir: './tests/backend/api-service',
      use: { baseURL: 'http://localhost:8080' },
    },
    {
      name: 'backend-data-service',
      testDir: './tests/backend/data-service',
      use: { baseURL: 'http://localhost:8081' },
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      port: 3000,
    },
    {
      command: 'npm run api:dev',
      port: 8080,
    },
    {
      command: 'npm run data:dev',
      port: 8081,
    },
  ],
});
