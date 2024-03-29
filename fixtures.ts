import { test as base, chromium, type BrowserContext } from '@playwright/test';
import metaMaskPage from '@pages/metamask.page';
const path = require('path');
const userDirData = path.join(__dirname, '/tests/QuickStart/User-Data-Dir/Chrome/User Data/Default/Extensions/nkbihfbeogaeaoehlefnkodbefgpgknn/10.35.1_0');

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, '/MyMetamaskExtension');
    const context = await chromium.launchPersistentContext(userDirData, {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });



    await use(context);
    await context.close();



  },
  extensionId: async ({ context }, use) => {
    /*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);


  },
});
export const expect = test.expect;

export { chromium };


