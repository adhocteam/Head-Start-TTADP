const {
  Given, When, Then,
} = require('@cucumber/cucumber');
const assertTrue = require('assert');
const assert = require('assert');
const select = require('puppeteer-select');
const scope = require('../support/scope');

Given('the current page is the activity reports page', async () => {
  const page = scope.context.currentPage;
  const selector = 'a[href$="activity-reports"]';
  await Promise.all([
    page.waitForNavigation(),
    page.click(selector),
  ]);
});

Then('we see the Stepper', async () => {
  const page = scope.context.currentPage;
  const selector = '[aria-label="progress"]';

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assertTrue(value.startsWith('Activity Summary'));
});

Then('the first step is the Activity Summary', async () => {
  const page = scope.context.currentPage;
  const selector = '[aria-label="progress"] ol li span[aria-current="true"]';

  const value = await page.$eval(selector, (el) => el.textContent);

  assert.equal(value, 'Activity Summary');
});

Then('two navigation buttons are visible', async () => {
  const page = scope.context.currentPage;

  const buttonOne = await select(page).getElement('button:contains("Previous")');
  const buttonTwo = await select(page).getElement('button:contains("Next")');

  assertTrue(buttonOne);
  assertTrue(buttonTwo);

  let value = await page.evaluate((el) => el.textContent, buttonOne);
  assert.equal(value, 'Previous');

  value = await page.evaluate((el) => el.textContent, buttonTwo);
  assert.equal(value, 'Next');
});

Then('the {string} button is disabled', async (string) => {
  const page = scope.context.currentPage;
  const buttonOneSelector = 'button[disabled]';
  // const buttonOne = await select(page).getElement('button:contains("Previous")');
  // const buttonTwo = await select(page).getElement('button:contains("Next")');
  const buttonPrevious = await page.$(buttonOneSelector);

  assertTrue(buttonPrevious);
  // assertTrue(buttonTwo);

  const value = await page.evaluate((el) => el.textContent, buttonPrevious);
  assert.equal(value, string);

  // value = await page.evaluate((el) => el.disabled, buttonTwo);
  // assert.equal(value, 'Next');
});

When('the {string} button is clicked', async (string) => {
  const page = scope.context.currentPage;
  const buttonTwo = await select(page).getElement(`button:contains(${string})`);
  await buttonTwo.click();
});

Then('the {string} button is no longer disabled', async (string) => {
  const page = scope.context.currentPage;
  const buttonOneSelector = 'button[disabled]';

  const buttonPrevious = await page.$(buttonOneSelector);

  const value = await page.evaluate((el) => el, buttonPrevious);
  assert.equal(value, null);
});

Then('the {string} step is no longer current', async (string) => {
  const page = scope.context.currentPage;
  assert.equal(string, 'Activity Summary');
  const selector = `[data-testid="${string}"] > [aria-current="false"]`;

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assertTrue(value.startsWith(string));
});

Then('the {string} step is current', async (string) => {
  const page = scope.context.currentPage;
  assert.equal(string, 'Participants');
  const selector = `[data-testid="${string}"] > [aria-current="true"]`;

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assert.equal(value, string);
});

When('the {string} button is clicked again', async (string) => {
  const page = scope.context.currentPage;
  const buttonTwo = await select(page).getElement(`button:contains(${string})`);
  await buttonTwo.click();
});

Then('the {string} step is still current, but on page 2', async (string) => {
  const page = scope.context.currentPage;
  assert.equal(string, 'Participants');
  const selector = '[data-testid="form"] > h1';

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assert.equal(value, `${string} - Page 2`);
});

Then('the {string} step is not yet reached', async (string) => {
  const page = scope.context.currentPage;
  assert.equal(string, 'Goals & Objectives');
  const selector = `[data-testid="${string}"] > [aria-current="false"]`;

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assertTrue(value.startsWith(string));
});

Then('the {string} step is still current, but on page 1', async (string) => {
  const page = scope.context.currentPage;
  assert.equal(string, 'Participants');
  const selector = '[data-testid="form"] > h1';

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assert.equal(value, `${string} - Page 1`);
});

Then('the {string} step is not current', async (string) => {
  const page = scope.context.currentPage;
  assert.equal(string, 'Participants');
  const selector = `[data-testid="${string}"] > [aria-current="false"]`;

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assertTrue(value.startsWith(string));
});

Then('the {string} step is now current', async (string) => {
  const page = scope.context.currentPage;
  assert.equal(string, 'Activity Summary');
  const selector = `[data-testid="${string}"] > [aria-current="true"]`;

  const value = await page.$eval(selector, (el) => el.textContent);

  assertTrue(value);
  assertTrue(value.startsWith(string));
});
