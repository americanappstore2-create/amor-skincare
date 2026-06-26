import { generateImage } from "./server/_core/imageGeneration.ts";
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

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

async function generateProductImages() {
  let connection;
  try {
    console.log('🚀 Starting AI image generation for products...\n');
    
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

    // Get first 10 products to test
    const testProducts = await connection.query(
      'SELECT id, name, category FROM products LIMIT 10'
    );
    
    const productList = testProducts[0];
    console.log(`📦 Found ${productList.length} products to generate images for\n`);

    let generated = 0;
    let failed = 0;

    for (const product of productList) {
      try {
        const category = product.category || 'other';
        const prompt = `${categoryPrompts[category] || categoryPrompts.other}. Product: ${product.name}`;
        
        console.log(`⏳ Generating image for: ${product.name}...`);
        
        const result = await generateImage({
          prompt: prompt,
        });

        if (result && result.url) {
          console.log(`  ✅ Generated: ${result.url}`);
          generated++;
        } else {
          console.error(`  ❌ No URL in response`);
          failed++;
        }
      } catch (error) {
        console.error(`  ❌ Error: ${error.message}`);
        failed++;
      }
    }

    console.log(`\n📊 Summary: ${generated} generated, ${failed} failed`);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

generateProductImages();
