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

const { webkit } = require('playwright');

(async () => {
    const browser = await webkit.launch({ headless: false, slowMo: 50 });
    const page = await browser.newPage();
    await page.goto('http://whatsmyuseragent.org/');
    await page.screenshot({ path: `example.png` });
    await browser.close();
})();