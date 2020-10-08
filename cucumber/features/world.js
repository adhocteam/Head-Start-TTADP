// Dependencies
const { setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const scope = require('./support/scope');

const World = function () {
  scope.driver = puppeteer;
  scope.context = {};
};

setWorldConstructor(World);
