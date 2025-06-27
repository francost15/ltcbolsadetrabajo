const puppeteer = require('puppeteer');
const path = require('path');

async function generateImages() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Load the template
    await page.goto(`file:${path.join(__dirname, '../public/og-template.html')}`);
    
    // Wait for the logo to load
    await page.waitForSelector('img');
    
    // Generate wide image (1200x630)
    await page.setViewport({ width: 1200, height: 630 });
    const wideContainer = await page.$('.container:not(.square)');
    await wideContainer.screenshot({
        path: path.join(__dirname, '../public/og-image.png'),
        omitBackground: false
    });
    
    // Generate square image (600x600)
    await page.setViewport({ width: 600, height: 600 });
    const squareContainer = await page.$('.container.square');
    await squareContainer.screenshot({
        path: path.join(__dirname, '../public/og-image-square.png'),
        omitBackground: false
    });
    
    await browser.close();
    console.log('✅ OG images generated successfully!');
}

generateImages().catch(console.error); 