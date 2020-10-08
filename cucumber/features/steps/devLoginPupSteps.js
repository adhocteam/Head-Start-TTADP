const {
  Given, When, Then,
} = require('@cucumber/cucumber');
const assertTrue = require('assert');
const scope = require('../support/scope');

Given('https://tta-smarthub-dev.app.cloud.gov', { timeout: 4 * 5000 }, async () => {
  if (!scope.browser) {
    scope.browser = await scope.driver.launch();
  }
  scope.context.currentPage = await scope.browser.newPage();
  await scope.context.currentPage.goto('https://tta-smarthub-dev.app.cloud.gov/');
  await scope.context.currentPage.waitForSelector('a[href$="api/login"]');
});

When('pressing login', { timeout: 4 * 5000 }, async () => {
  // Write code here that turns the phrase above into concrete actions
  await scope.context.currentPage.click('a[href$="api/login"]');
  await scope.context.currentPage.waitForSelector('.hses');
});

Then('we should see "Head Start Enterprise System" page', async () => {
  const result = await scope.context.currentPage.$('.hses');
  const value = await scope.context.currentPage.evaluate((el) => el.textContent, result);

  assertTrue(value.includes('Head Start Enterprise System'));
});
