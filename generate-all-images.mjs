import { generateImage } from "./server/_core/imageGeneration.ts";
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.ts';
import { eq, sql } from 'drizzle-orm';

const categoryPrompts = {
  serum: "premium skincare serum bottle with minimalist design, elegant glass bottle, luxury cosmetics, professional product photography, white background",
  cream: "luxury skincare cream jar, premium cosmetics packaging, elegant white jar with gold accents, professional product shot",
  toner: "premium skincare toner bottle, elegant glass bottle with dropper, luxury Korean beauty product, professional photography",
  mask: "premium face mask sheet or jar, luxury skincare packaging, elegant design, professional product photography",
  cleanser: "premium facial cleanser bottle, luxury skincare product, elegant packaging, professional product shot",
  eye_care: "premium eye cream jar, luxury skincare product, elegant packaging, professional photography",
  sunscreen: "premium sunscreen bottle, luxury skincare SPF product, elegant packaging, professional product shot",
  oil: "premium skincare oil bottle, luxury cosmetics, elegant glass bottle, professional product photography",
  powder: "premium skincare powder, luxury cosmetics, elegant packaging, professional product shot",
  other: "premium skincare product, luxury cosmetics, elegant packaging, professional product photography"
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
    const db = drizzle(connection);

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

    // Process in batches of 5 to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < productList.length; i += batchSize) {
      const batch = productList.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(productList.length / batchSize);
      
      console.log(`⏳ Batch ${batchNum}/${totalBatches} (${batch.length} products)...`);
      
      for (const product of batch) {
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
      }
      console.log(`\n  ✅ Batch ${batchNum} complete (${generated} generated, ${failed} failed)\n`);
    }

    // Now update database with all generated image URLs
    console.log('\n📝 Updating database with generated image URLs...\n');
    
    let updated = 0;
    let updateFailed = 0;
    
    for (const [productId, imageUrl] of Object.entries(imageUrls)) {
      try {
        await db
          .update(products)
          .set({ imageUrl })
          .where(eq(products.id, parseInt(productId)));
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
    
    if (failedProducts.length > 0 && failedProducts.length <= 20) {
      console.log(`\n📋 Failed products:`);
      failedProducts.forEach(p => {
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
