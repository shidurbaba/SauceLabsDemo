const { Given, When, Then } = require('@cucumber/cucumber');
const fs = require('fs');
const csv = require('csv-parse/sync');

Given('I am on the Saucedemo login page', async function () {
  await this.page.goto('https://www.saucedemo.com');
});

When('I login with valid credentials', async function () {
  await this.page.fill('[data-test="username"]', 'standard_user');
  await this.page.fill('[data-test="password"]', 'secret_sauce');
  await this.page.click('[data-test="login-button"]');
});

When('I add specified items to the cart', { timeout: 30000 }, async function () {
  const itemsToAdd = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt'
  ];
  for (const itemName of itemsToAdd) {
    const formattedItemName = itemName.toLowerCase().replace(/ /g, '-');
    const selector = `[data-test="add-to-cart-${formattedItemName}"]`;
    await this.page.waitForSelector(selector, { state: 'visible', timeout: 30000 });
    await this.page.click(selector);
  }
});

When('I add {string} to the cart', async function (item) {
  const selector = `[data-test="add-to-cart-${item.replace(/ /g, '-')}"]`;
  await this.page.click(selector);
});

When('I verify items against testData.csv', async function () {
  const csvContent = fs.readFileSync('TestData\\testData.csv', 'utf8');
  const records = csv.parse(csvContent, {
    columns: true,
    skip_empty_lines: true
});
  for (const record of records) {
    const item = record.item; 

    const formattedSelector = `.inventory_item_name:has-text("${item}")`;
    const isVisible = await this.page.isVisible(formattedSelector);
    if (!isVisible) {
      console.error(`Visibility check failed for: ${formattedSelector}`);
      throw new Error(`Item not found on the page: ${item}`);
    }
  }
});


When('I remove an item from the cart', async function () {
  await this.page.click('.shopping_cart_link');
  await this.page.click('[data-test="remove-sauce-labs-bike-light"]');
});

When('I proceed to checkout', async function () {
  await this.page.click('.checkout_button');
  await this.page.fill('[data-test="firstName"]', 'John');
  await this.page.fill('[data-test="lastName"]', 'Doe');
  await this.page.fill('[data-test="postalCode"]', '90210');
  await this.page.click('[data-test="continue"]');
});

Then('I should see the correct total price', async function () {
  const totalText = await this.page.innerText('.summary_total_label');
  const totalPrice = parseFloat(totalText.replace('Total: $', ''));
  if (totalPrice < 40.00) {
    await this.page.click('[data-test="finish"]');
    const orderConfirmation = await this.page.innerText('.complete-header');
    if (orderConfirmation !== 'THANK YOU FOR YOUR ORDER') {
      throw new Error('Order completion message is incorrect');
    }
  } else {
    await this.page.click('[data-test="cancel"]');
  }
});

Then('I logout', async function () {
  await this.page.click('.bm-burger-button');
  await this.page.click('#logout_sidebar_link');
});


