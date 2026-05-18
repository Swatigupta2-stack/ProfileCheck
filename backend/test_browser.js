import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    console.log('Page loaded successfully');
  } catch (err) {
    console.error('Failed to load page:', err);
  }
  
  await browser.close();
})();
