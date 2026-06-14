const { chromium } = require('playwright');
(async()=>{
  console.log('start');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  console.log('launched');
  const page = await browser.newPage();
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded', timeout: 30000 });
  console.log('title', await page.title());
  await browser.close();
  console.log('done');
})().catch(err=>{ console.error('ERR', err); process.exit(1); });
