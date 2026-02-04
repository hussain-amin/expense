// Script to generate PNG icons from SVG
// Run this in a browser console or Node.js with canvas

const fs = require('fs');
const { createCanvas } = require('canvas');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background with rounded corners
  const radius = size * 0.17; // iOS icon corner radius ratio
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();
  
  // Dollar sign
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.55}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('$', size / 2, size / 2 + size * 0.05);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filename, buffer);
  console.log(`Generated ${filename}`);
}

generateIcon(192, 'public/icon-192.png');
generateIcon(512, 'public/icon-512.png');
generateIcon(180, 'public/apple-touch-icon.png');
