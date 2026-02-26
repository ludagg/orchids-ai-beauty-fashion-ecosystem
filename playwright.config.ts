import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: 'https://133priitest.vercel.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Mobile Safari (iPhone 14)',
      use: {
        ...devices['iPhone 14'],
      },
    },
    {
        name: 'Mobile Chrome (Pixel 5)',
        use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Desktop Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
        name: 'Desktop Safari',
        use: { ...devices['Desktop Safari'] },
    }
  ],
});
