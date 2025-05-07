/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */
const { Parcel } = require("@parcel/core");
const { chromium } = require("playwright");

(async () => {
  const port = 1234;
  const bundler = new Parcel({
    entries: "./index.html",
    defaultConfig: "@parcel/config-default",
    serveOptions: { port },
  });
  await bundler.watch();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`);
  await page.pdf({ path: "screen.pdf" });
  await browser.close();
  process.exit(0);
})();
