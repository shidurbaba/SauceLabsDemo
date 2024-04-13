const { Before, After, setWorldConstructor } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const playwrightConfig = require('../../playwright.config');

Before(async function () {
  this.browser = await chromium.launch({
    headless: playwrightConfig.headless,
    slowMo: 250, // Slows down Playwright operations by 250 milliseconds
  });

  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function () {
  await this.page.close();
  await this.browser.close();
});
