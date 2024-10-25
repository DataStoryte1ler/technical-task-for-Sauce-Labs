const {Builder, By, Key, until} = require('selenium-webdriver')
const utils = require('./utils')

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
//const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.us-west-1.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;


/**
* Run this test before working on the problem.
* When you view the results on your dashboard, you'll see that the test "Failed".
* Your job is to figure out why the test failed and make the changes necessary to make the test pass.
* Once you get the test working, update the code so that when the test runs, it can reach the Sauce Labs homepage,
* hover over 'Resources' and then clicks the 'Documentation' link
*/

describe('Broken Sauce', function () {
    it('should go to Google and click Sauce', async function () {

        try {
            let driver = await new Builder().withCapabilities(utils.brokenCapabilities)
                    .usingServer(ONDEMAND_URL).build();

                    
        await driver.get("https://www.google.com");
        // If you see a German or English GDPR modal on google.com you 
        // will have to code around that or use the us-west-1 datacenter.
        // You can investigate the modal elements using a Live Test(https://app.saucelabs.com/live/web-testing)
        
        // I wasn't able to bypass GDPR, despite trying a bunch of different methods
        let AcceptButton = await driver.wait(until.elementLocated(By.xpath("//button[text()='Alle akzeptieren']")), 10000);
        await driver.wait(until.elementIsVisible(AcceptButton), 10000);
        await AcceptButton.click();


        let search = await driver.findElement(By.name("q")); // replaced Search with q which is the proper name attribute
        await search.sendKeys("Sauce Labs");
        
        let button = await driver.findElement(By.name("btnK"))
        await button.click()

        let page = await driver.wait(until.elementLocated(By.partialLinkText("sauce")), 20000);
        await page.click() // added click action
        

        // Navigate to the Sauce Labs website and find the 'Resources' menu
        await driver.get("https://saucelabs.com");
        let resources = await driver.wait(until.elementLocated(By.xpath("//*[text()='Resources']")), 10000);
        await driver.wait(until.elementIsVisible(resources), 10000);
        
        // Perform hover action over Resources menu
        let actionRes = driver.actions({ async: true });
        await actionRes.move({ origin: resources }).perform();

        // There's no 'Documentation' link in the 'Resources' dropdown menu
        let developers = await driver.wait(until.elementLocated(By.xpath("//*[text()='Developers']")), 10000);
        await driver.wait(until.elementIsVisible(developers), 10000);
        
        // Therefore, navigating to the 'Developers' dropdown menu
        let actionDev = driver.actions({ async: true });
        await actionDev.move({ origin: developers }).perform();
        
        // Locate and click the 'Documentation' link in the dropdown menu
        let documentationLink = await driver.wait(until.elementLocated(By.xpath("//a[@href='https://docs.saucelabs.com/']")), 10000);
        await driver.wait(until.elementIsVisible(documentationLink), 10000);
        await documentationLink.click();

        await driver.wait(until.urlIs("https://docs.saucelabs.com/"), 10000);

        

        await driver.quit();
        } catch (err) {
            // hack to make this pass for Gitlab CI
            // candidates can ignore this
            if (process.env.GITLAB_CI === 'true') {
                console.warn("Gitlab run detected.");
                console.warn("Skipping error in brokenSauce.js");
            } else {
                throw err;
            }
        }

    });
});
