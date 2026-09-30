const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const file = process.argv[2];
  const out = process.argv[3];
  const w = parseInt(process.argv[4] || '640', 10);
  const h = parseInt(process.argv[5] || '480', 10);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.resolve(__dirname, file));
  await page.waitForTimeout(200);
  await page.screenshot({ path: out, omitBackground: true });
  await browser.close();
  console.log('wrote', out);
})();
