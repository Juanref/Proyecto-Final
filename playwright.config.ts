import { defineConfig, devices } from "@playwright/test";
import { DateFormatter } from "./helpers/utils/time.helper.ts";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,

  reporter: [
    ["list", { printSteps: true }],
    // [
    //   "html",
    //   { open: "never", outputFolder: `playwright-report/result-${DateFormatter(new Date())}` },
    // ],
    // ["json", { outputFile: `playwright-result/result-${DateFormatter(new Date())}.json` }],
    ["allure-playwright"],
  ],

  outputDir: "artifacts/run",

  use: {
    launchOptions: {
      slowMo: 700,
    },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "WEB-Automation",
      use: { ...devices["Desktop Chrome"] },
    },
    // Otros browsers comentados
  ],

  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
