import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { createCanvas, registerFont } from 'canvas';
import mysql from 'mysql2/promise';

// Simple function to generate placeholder images with product info
async function generatePlaceholderImage(productName, category, brand) {
  const width = 1024;
  const height = 1024;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Color palette by category
  const categoryColors = {
    serum: '#FFB6D9',      // Pink
    cream: '#FFE4B5',      // Peach
    toner: '#B0E0E6',      // Powder blue
    mask: '#98D8C8',       // Mint
    cleanser: '#F7DC6F',   // Yellow
    eye_care: '#BB8FCE',   // Purple
    sunscreen: '#F8B88B',  // Orange
    oil: '#D4A574',        // Tan
    powder: '#E8DAEF',     // Lavender
    other: '#D3D3D3'       // Light gray
  };

  const bgColor = categoryColors[category] || categoryColors.other;

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Colored accent bar
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, 200);
  ctx.fillRect(0, height - 150, width, 150);

  // Brand text (top)
  ctx.fillStyle = '#666666';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(brand.toUpperCase(), width / 2, 120);

  // Category icon/label
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(category.toUpperCase(), width / 2, 160);

  // Product name (center)
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  
  // Wrap text if too long
  const words = productName.split(' ');
  let line = '';
  let y = height / 2 - 40;
  
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > width - 100) {
      ctx.fillText(line, width / 2, y);
      line = words[i] + ' ';
      y += 50;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, width / 2, y);

  // Decorative elements
  ctx.strokeStyle = bgColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 + 150, 60, 0, Math.PI * 2);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

async function processProducts() {
  let connection;
  try {
    console.log('🚀 Starting product image processing...\n');
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not set');
      process.exit(1);
    }

    const urlObj = new URL(dbUrl);
    const config = {
      host: urlObj.hostname,
      port: parseInt(urlObj.port || '3306'),
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1),
      ssl: { rejectUnauthorized: false },
    };

    connection = await mysql.createConnection(config);
    const [products] = await connection.query('SELECT id, name, category, brand FROM products ORDER BY id');
    
    console.log(`📦 Processing ${products.length} products\n`);

    let processed = 0;
    let failed = 0;

    // Create temp directory
    const tempDir = '/tmp/product-images';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Generate placeholder images for all products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      if (i % 50 === 0) {
        console.log(`⏳ Progress: ${i}/${products.length} (${processed} processed)`);
      }

      try {
        // Generate placeholder image
        const imageBuffer = await generatePlaceholderImage(
          product.name,
          product.category || 'other',
          product.brand || 'Brand'
        );

        // Save locally
        const filename = `product-${product.id}.png`;
        const filepath = path.join(tempDir, filename);
        fs.writeFileSync(filepath, imageBuffer);

        processed++;
        process.stdout.write('.');

      } catch (error) {
        failed++;
        process.stdout.write('E');
      }
    }

    console.log(`\n\n✅ Generated ${processed} placeholder images\n`);
    console.log(`📁 Images saved to: ${tempDir}\n`);
    console.log(`Next step: Upload these images to Manus storage and update database`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

processProducts();
