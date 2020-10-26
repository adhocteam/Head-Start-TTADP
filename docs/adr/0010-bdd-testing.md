# 10. BDD testing

Date: 2020-10-25

## Status

Pending

## Context

Behavior-driven development (BDD) allows for a broader team to collaborate on software development. The business stakeholders have insight into how well the software meets the requirements. Through automated tests they have a way to validate the functionality in a user friendly way. Cucumber, and it particular cucumber-js was selected as the tool of choice to accomplish this. To go along with cucumber-js, puppeteer as well as selenium webdriver were looked at to provide a full solution for BDD testing.

## Decision

Puppeteer as well as selenium webdriver provide a way to run automated browser tests. Both of these are popular tools to enable browser automation. Puppeteer offers more control over Chromium based browsers, very fast, headless by default, run modej, and it can take screenshots of the pages, both in an image and PDF formats. Additionally, it measures rendering and load times by Chrome Performance Analysis tool and it is easier to set up than selenium webdriver. The drawback to using Puppeteer is it's lack of full cross-browser support, which is offered by the selenium webdriver, since Puppeteer is specialized for Chromium.

## Consequences

Investing time into enabling BDD with cucumber-js will have a positive impact on collaboration with the business stakeholders and provide a way to validate application's functionality. This was viewed as a worthwile investment considering that schedules might be affected. By using Puppeteer with cucumber-js we will have a solution that is fast and easier to set up with a limitation of not providing a full cross-browser support (Microsoft Edge, which is a default on Windows 10, is based on Chromium). Since the browsers to support include Chrome and IE this poses somewhat of a limitation, however the bulk of the benefits from using BDD comes from validating the application's behavior against the requirements.
