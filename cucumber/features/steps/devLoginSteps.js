const {
  When, Then, After, Before,
} = require('@cucumber/cucumber');
const assertTrue = require('assert');
const { Builder, By, until } = require('selenium-webdriver');

require('chromedriver');

Before(async () => {
  // Do something before each scenario
});

When('visiting https://tta-smarthub-dev.app.cloud.gov and pressing login', { timeout: 4 * 5000 }, async function visit() {
  // Write code here that turns the phrase above into concrete actions
  this.driver = new Builder()
    .forBrowser('chrome')
    .build();

  await this.driver.get('https://tta-smarthub-dev.app.cloud.gov/');
  await this.driver.wait(until.elementLocated(By.linkText('HSES Login')));
  await this.driver.findElement(By.linkText('HSES Login')).click();
});

Then('we should see "Head Start Enterprise System"', async function verifyHSESLogin() {
  const result = await this.driver.findElement(By.className('hses')).getText();
  assertTrue(result.includes('Head Start Enterprise System'));
});

After(async function closeBrowser() {
  await this.driver.close();
});
