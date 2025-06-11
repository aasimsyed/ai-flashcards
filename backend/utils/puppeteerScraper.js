import puppeteer from 'puppeteer';

const scrapeTextFromURL = async (url) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const text = await page.evaluate(() => {
    const main = document.querySelector('main') || document.body;
    return main.innerText;
  });

  await browser.close();
  return text;
};

export default scrapeTextFromURL;
