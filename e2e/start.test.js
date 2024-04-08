import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);

describe('Page start', () => {
  let browser;
  let page;
  let server;

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);

    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
//      headless: true,
//      slowMo: 100,
//      devtools: true,
    });

    page = await browser.newPage();

  });

  test('is body exists', async () => {
    await page.goto('http://localhost:8888');

    await page.waitForSelector('body');
  });
  
  test('Form should render on page start', async () => {
    await page.goto('http://localhost:8888');

    await page.waitForSelector('.popover');
  });


  test('Show popover', async () => {
    await page.goto('http://localhost:8888');

    await page.waitForSelector('.popover');

    const btn = await page.$('.btn');
    await btn.click();

    await page.waitForSelector('.visible');
  }); //, 55000

  test('Hide popover', async () => {
    //jest.setTimeout(20000);
    await page.goto('http://localhost:8888');

    await page.waitForSelector('.popover');

    const btn = await page.$('.btn');
    await btn.click();
	await btn.click();
	const popover = await page.$('.visible');
	expect(popover).toBeNull();

  }); //, 55000
  
  afterAll(async () => {
    await browser.close();
    server.kill();
  });  
  
});