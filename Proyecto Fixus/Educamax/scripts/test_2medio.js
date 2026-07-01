import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  try {
    await page.goto('https://www.curriculumnacional.cl/curriculum', { waitUntil: 'networkidle2' });
    await page.evaluate(() => {
        const s = document.querySelectorAll('select')[0];
        const opt = Array.from(s.options).find(o => o.text === '2° Medio');
        s.value = opt.value;
        s.dispatchEvent(new Event('change'));
    });
    await new Promise(r => setTimeout(r, 2000));
    await page.evaluate(() => {
        const s = document.querySelectorAll('select')[1];
        const opt = Array.from(s.options).find(o => o.text === 'Lengua y Literatura');
        s.value = opt.value;
        s.dispatchEvent(new Event('change'));
    });
    await new Promise(r => setTimeout(r, 1000));
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        page.evaluate(() => document.querySelector('input[value="Buscar"]').click())
    ]);
    const html = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('debug_2medio.html', html);
    console.log('Saved 2 Medio HTML');
  } catch(e) { console.log(e); }
  await browser.close();
})();
