const {
  When, Then, After, Before,
} = require('@cucumber/cucumber');
const assert = require('assert');
const { Builder, By, until } = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');

require('chromedriver');

Before(async () => {
  // Do something before each scenario
});

When('visiting https://tta-smarthub-dev.app.cloud.gov/', { timeout: 2 * 5000 }, async function visit() {
  // Write code here that turns the phrase above into concrete actions
  this.driver = new Builder()
    .forBrowser('chrome')
    // .forBrowser('chrome')
    .build();

  //     let options = new chrome.Options()
  // let nextPort = 9222 //for example
  // options.addArguments(["--remote-debugging-port=" + nextPort])
  // let driver = new webdriver.Builder()
  //  .withCapabilities(webdriver.Capabilities.chrome())
  //  .setChromeOptions(options)
  //  .build()

  await this.driver.get('https://tta-smarthub-dev.app.cloud.gov/');
  await this.driver.wait(until.elementLocated(By.tagName('h1')));
});

Then('we should see "Welcome to the TTA Smart Hub!"', async function () {
  // Write code here that turns the phrase above into concrete actions
  // const title = await this.driver.getTitle();result = driver.getPageSource().contains("String to find");
  const welcomeMsg = await this.driver.findElement(By.tagName('h1')).getText();
  // const test = await this.driver.getPageSource();
  //   this.driver.getTitle().then(function (title) {
  assert.equal(welcomeMsg, 'Welcome to the TTA Smart Hub!');
//     return title;
});

// After(async function closeBrowser() {
//   await this.driver.close();
// });
