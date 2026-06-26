import { generateImage } from "./server/_core/imageGeneration.ts";
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.ts';

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

async function generateAllProductImages() {
  let connection;
  try {
    console.log('🚀 Starting bulk AI image generation for all products...\n');
    
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
    console.log(`📦 Found ${productList.length} products to generate images for\n`);

    let generated = 0;
    let failed = 0;
    const failedProducts = [];
    const imageUrls = {};

    // Process with delay to avoid rate limiting
    for (let i = 0; i < productList.length; i++) {
      const product = productList[i];
      
      // Show progress every 10 products
      if (i % 10 === 0) {
        console.log(`⏳ Progress: ${i}/${productList.length} (${generated} generated, ${failed} failed)`);
      }
      
      try {
        const category = product.category || 'other';
        const prompt = `${categoryPrompts[category] || categoryPrompts.other}. Product: ${product.name}`;
        
        const result = await generateImage({
          prompt: prompt,
        });

        if (result && result.url) {
          imageUrls[product.id] = result.url;
          generated++;
          process.stdout.write('.');
        } else {
          failed++;
          failedProducts.push({ id: product.id, name: product.name, error: 'No URL in response' });
          process.stdout.write('F');
        }
      } catch (error) {
        failed++;
        failedProducts.push({ id: product.id, name: product.name, error: error.message });
        process.stdout.write('E');
      }
      
      // Add small delay between requests
      if ((i + 1) % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log(`\n\n📝 Updating database with generated image URLs...\n`);
    
    let updated = 0;
    let updateFailed = 0;
    
    for (const [productId, imageUrl] of Object.entries(imageUrls)) {
      try {
        await connection.query(
          'UPDATE products SET imageUrl = ? WHERE id = ?',
          [imageUrl, parseInt(productId)]
        );
        updated++;
      } catch (error) {
        updateFailed++;
        console.error(`  ❌ Failed to update product ${productId}: ${error.message}`);
      }
    }

    console.log('\n📊 Final Summary:');
    console.log(`  ✅ Images generated: ${generated}`);
    console.log(`  ❌ Generation failed: ${failed}`);
    console.log(`  ✅ Database updated: ${updated}`);
    console.log(`  ❌ Update failed: ${updateFailed}`);
    
    if (failedProducts.length > 0 && failedProducts.length <= 50) {
      console.log(`\n📋 Failed products (first 50):`);
      failedProducts.slice(0, 50).forEach(p => {
        console.log(`  - Product ${p.id} (${p.name}): ${p.error}`);
      });
    }

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

generateAllProductImages();
