const {Builder, By, Key, until} = require('selenium-webdriver')
const SauceLabs = require('saucelabs').default;
const assert = require('assert');
const utils = require('./utils')

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
//const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;

/**
* Task I: Update the test code so when it runs, the test clicks the "I am a link" link.
*
* Task II - Comment out the code from Task I. Update the test code so when it runs, 
* the test is able to write "Sauce" in the text box that currently says "I has no focus".
*
* Task III - Update the test code so when it runs, it adds an email to the email field, 
* adds text to the comments field, and clicks the "Send" button.
* Note that email will not actually be sent!
*
* Task IV - Add a capability that adds a tag to each test that is run.
* See this page for instructions: https://docs.saucelabs.com/dev/test-configuration-options/
* 
* Task V: Set the status of the test so it shows as "passed" instead of "complete".
* We've included the node-saucelabs package already. For more info see:
* https://github.com/saucelabs/node-saucelabs
*/

describe('Working Sauce', function () {
    it('should go to Google and click Sauce', async function () {
        let driver = await new Builder().withCapabilities(utils.workingCapabilities)
                    .usingServer(ONDEMAND_URL).build();


    /**
     * Goes to Sauce Lab's guinea-pig page and verifies the title
     */

    await driver.get("https://saucelabs.com/test/guinea-pig");
    await assert.strictEqual("I am a page title - Sauce Labs", await driver.getTitle());

    // Task I
    /*
    const linkId = 'i am a link';
    const linkElement = await driver.wait(until.elementLocated(By.id(linkId)), 20000);
    await linkElement.click();
    */

    // Task II
    const textBoxId = 'i_am_a_textbox';
    const textBoxElement = await driver.wait(until.elementLocated(By.id(textBoxId)), 20000);
    await textBoxElement.clear();
    await textBoxElement.sendKeys('Sauce');

    // Task III
    // Adds an email to the email field
    const emailTextBoxId = 'fbemail';
    const emailElement = await driver.wait(until.elementLocated(By.id(emailTextBoxId)), 20000);
    await emailElement.sendKeys('yar.mail134@gmail.com');
    
    // Adds text to the comments field
    const commentsTextBoxId = 'comments'
    const commentsElement = await driver.wait(until.elementLocated(By.id(commentsTextBoxId)), 20000);
    await commentsElement.sendKeys('I like this task!');
    
    // Clicks the 'Send' button
    const sendButtonClass = 'jumpButton';
    const sendButtonElement = await driver.wait(until.elementLocated(By.className(sendButtonClass)), 20000);
    await sendButtonElement.click();

    /* Task V: I made CLI Tool work for me only after setting up the same environment in Linux,
       I ran the command: sl updateJob $SAUCE_USERNAME 0d1539d6640d4fb9bc3757a4f8dab5e9 "{\"passed\":true}" -u $SAUCE_USERNAME -k $SAUCE_ACCESS_KEY -r 'eu-central-1'
       and updated the 0d1539d6640d4fb9bc3757a4f8dab5e9 job status successfully */

    await driver.quit();
    });
});
