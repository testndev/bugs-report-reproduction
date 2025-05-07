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
  let [serverReady, error] = [];
  const [maxRetries, retryInterval] = [20, 500];
  for (let i = 0; i < maxRetries; i += 1) {
    try {
      console.log(`Attempting to connect to server (attempt ${i + 1})...`);
      await page.goto(`http://localhost:${port}`);
      serverReady = true;
      break;
    } catch (err) {
      error = err;
      await new Promise((resolve) => {
        setTimeout(resolve, retryInterval);
      });
    }
  }
  if (!serverReady) {
    throw new Error(
      `Server did not start after ${maxRetries * retryInterval}ms: ${
        error.message
      }`
    );
  }
  await page.pdf({ path: "screen.pdf" });
  await browser.close();
  process.exit(0);
})();
