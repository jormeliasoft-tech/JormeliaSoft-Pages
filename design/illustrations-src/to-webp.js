const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const src = process.argv[2];
  const out = process.argv[3];
  const targetW = parseInt(process.argv[4], 10);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const buf = fs.readFileSync(src);
  const b64 = buf.toString('base64');

  const dataUrl = await page.evaluate(async ({ b64, targetW }) => {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject; img.src = 'data:image/png;base64,' + b64; });
    const scale = targetW / img.width;
    const targetH = Math.round(img.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = targetW; canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetW, targetH);
    return canvas.toDataURL('image/webp', 0.9);
  }, { b64, targetW });

  fs.writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
  await browser.close();
  console.log('wrote', out);
})();
