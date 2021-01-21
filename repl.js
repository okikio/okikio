// const promise1 = Promise.resolve({ default: 6 });
// const promise2 = Promise.resolve({ default: 5 });
// const promise3 = Promise.resolve({ default: 15 });
// (async () => {
//     const [{ default: pug }] = await Promise.all([
//         Promise.resolve({ default: 6 }),
//         Promise.resolve({ default: 5 }),
//         Promise.resolve({ default: 15 }),
//     ]);
//     console.log(pug);
// })();

const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();
    await page.goto("http://whatsmyuseragent.org/");
    await page.screenshot({ path: `example.png` });
    await browser.close();
})();

/**
 * const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });
  const context = await browser.newContext();

  // Open new page
  const page = await context.newPage();

  // Go to https://www.wikipedia.org/
  await page.goto('https://www.wikipedia.org/');

  // ---------------------
  await context.close();
  await browser.close();
})();

*/
