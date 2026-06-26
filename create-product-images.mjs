import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

async function generatePlaceholderImage(productName, category, brand) {
  const width = 1024;
  const height = 1024;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const categoryColors = {
    serum: '#FFB6D9',
    cream: '#FFE4B5',
    toner: '#B0E0E6',
    mask: '#98D8C8',
    cleanser: '#F7DC6F',
    eye_care: '#BB8FCE',
    sunscreen: '#F8B88B',
    oil: '#D4A574',
    powder: '#E8DAEF',
    other: '#D3D3D3'
  };

  const bgColor = categoryColors[category] || categoryColors.other;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, 200);
  ctx.fillRect(0, height - 150, width, 150);

  ctx.fillStyle = '#666666';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(brand.substring(0, 20).toUpperCase(), width / 2, 120);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(category.toUpperCase(), width / 2, 160);

  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'center';
  
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
    console.log('🚀 Creating placeholder images for all products...\n');
    
    const dbUrl = process.env.DATABASE_URL;
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
    
    console.log(`📦 Found ${products.length} products\n`);

    const tempDir = '/tmp/product-images';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    let processed = 0;
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      if (i % 100 === 0) {
        console.log(`⏳ Progress: ${i}/${products.length}`);
      }

      try {
        const imageBuffer = await generatePlaceholderImage(
          product.name,
          product.category || 'other',
          product.brand || 'Brand'
        );

        const filename = `product-${product.id}.png`;
        const filepath = path.join(tempDir, filename);
        fs.writeFileSync(filepath, imageBuffer);
        processed++;
        process.stdout.write('.');
      } catch (error) {
        process.stdout.write('E');
      }
    }

    console.log(`\n\n✅ Created ${processed}/${products.length} images`);
    console.log(`📁 Saved to: ${tempDir}\n`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

processProducts();
