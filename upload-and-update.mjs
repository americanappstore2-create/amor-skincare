import { storagePut } from './server/storage.ts';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

async function uploadAndUpdate() {
  let connection;
  try {
    console.log('🚀 Uploading images and updating database...\n');
    
    const imageDir = '/tmp/product-images';
    const files = fs.readdirSync(imageDir).sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

    console.log(`📦 Found ${files.length} images to upload\n`);

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

    let uploaded = 0;
    let updated = 0;

    for (let i = 0; i < files.length; i++) {
      const filename = files[i];
      const filepath = path.join(imageDir, filename);
      
      if (i % 100 === 0) {
        console.log(`⏳ Progress: ${i}/${files.length} (${uploaded} uploaded, ${updated} updated)`);
      }

      try {
        // Read file
        const fileBuffer = fs.readFileSync(filepath);
        
        // Upload to storage
        const storageKey = `product-images/${filename}`;
        const { url } = await storagePut(storageKey, fileBuffer, 'image/png');
        
        // Extract product ID
        const productId = parseInt(filename.match(/\d+/)[0]);
        
        // Update database
        await connection.query(
          'UPDATE products SET imageUrl = ? WHERE id = ?',
          [url, productId]
        );
        
        uploaded++;
        updated++;
        process.stdout.write('.');
      } catch (error) {
        process.stdout.write('E');
      }
    }

    console.log(`\n\n✅ Summary:`);
    console.log(`  ✅ Uploaded: ${uploaded}`);
    console.log(`  ✅ Updated: ${updated}`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

uploadAndUpdate();
