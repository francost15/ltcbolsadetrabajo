const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [
  { width: 16, height: 16, name: 'favicon-16x16.png' },
  { width: 32, height: 32, name: 'favicon-32x32.png' },
  { width: 192, height: 192, name: 'android-chrome-192x192.png' },
  { width: 512, height: 512, name: 'android-chrome-512x512.png' },
  { width: 180, height: 180, name: 'apple-touch-icon.png' },
];

async function generateIcons() {
  try {
    const inputFile = path.join(process.cwd(), 'public', 'logo.svg');
    
    for (const size of sizes) {
      const outputFile = path.join(process.cwd(), 'public', size.name);
      
      await sharp(inputFile)
        .resize(size.width, size.height)
        .png()
        .toFile(outputFile);
      
      console.log(`Generated ${size.name}`);
    }

    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 