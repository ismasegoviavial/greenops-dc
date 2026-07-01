import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://www.curriculumnacional.cl/curriculum', { waitUntil: 'networkidle2' });
  
  await page.evaluate(() => {
    const s = document.querySelectorAll('select')[0];
    s.value = '9';
    s.dispatchEvent(new Event('change'));
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await page.evaluate(() => {
    const s = document.querySelectorAll('select')[1];
    s.value = '103';
    s.dispatchEvent(new Event('change'));
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.evaluate(() => {
      document.querySelector('input[value="Buscar"]').click();
    })
  ]);
  
  const html = await page.evaluate(() => document.body.innerHTML);
  fs.writeFileSync('debug_mineduc_result.html', html);
  console.log('Result saved');
  await browser.close();
})();
