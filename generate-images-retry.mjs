import { generateImage } from "./server/_core/imageGeneration.ts";
import mysql from 'mysql2/promise';

const categoryPrompts = {
  serum: "luxury skincare serum bottle, elegant glass bottle with dropper, premium cosmetics, professional product photography, minimalist white background",
  cream: "luxury skincare cream jar, premium cosmetics packaging, elegant white jar with gold accents, professional product shot, white background",
  toner: "premium skincare toner bottle, elegant glass bottle with dropper, luxury Korean beauty product, professional photography, white background",
  mask: "premium face mask sheet or jar, luxury skincare packaging, elegant design, professional product photography, white background",
  cleanser: "premium facial cleanser bottle, luxury skincare product, elegant packaging, professional product shot, white background",
  eye_care: "premium eye cream jar, luxury skincare product, elegant packaging, professional photography, white background",
  sunscreen: "premium sunscreen bottle, luxury skincare SPF product, elegant packaging, professional product shot, white background",
  oil: "premium skincare oil bottle, luxury cosmetics, elegant glass bottle, professional product photography, white background",
  powder: "premium skincare powder, luxury cosmetics, elegant packaging, professional product shot, white background",
  other: "premium skincare product, luxury cosmetics, elegant packaging, professional product photography, white background"
};

async function generateProductImages() {
  let connection;
  try {
    console.log('🚀 Retrying AI image generation...\n');
    
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

    // Get all products
    const allProducts = await connection.query(
      'SELECT id, name, category FROM products ORDER BY id'
    );
    
    const productList = allProducts[0];
    console.log(`📦 Found ${productList.length} products\n`);

    let generated = 0;
    let failed = 0;
    const imageUrls = {};

    for (let i = 0; i < productList.length; i++) {
      const product = productList[i];
      
      if (i % 20 === 0) {
        console.log(`⏳ Progress: ${i}/${productList.length} (${generated} generated, ${failed} failed)`);
      }
      
      try {
        const category = product.category || 'other';
        const prompt = `${categoryPrompts[category] || categoryPrompts.other}. Product: ${product.name}`;
        
        const result = await generateImage({ prompt });

        if (result && result.url) {
          imageUrls[product.id] = result.url;
          generated++;
          process.stdout.write('.');
        } else {
          failed++;
          process.stdout.write('F');
        }
      } catch (error) {
        failed++;
        process.stdout.write('E');
      }
    }

    console.log(`\n\n📝 Updating database...\n`);
    
    let updated = 0;
    for (const [productId, imageUrl] of Object.entries(imageUrls)) {
      try {
        await connection.query(
          'UPDATE products SET imageUrl = ? WHERE id = ?',
          [imageUrl, parseInt(productId)]
        );
        updated++;
      } catch (error) {
        console.error(`❌ Update failed for product ${productId}`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`  ✅ Generated: ${generated}`);
    console.log(`  ❌ Failed: ${failed}`);
    console.log(`  ✅ Updated: ${updated}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

generateProductImages();
