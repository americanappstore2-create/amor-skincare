import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

// Image URL mapping - product ID to storage URL
const imageMapping = {
  1: '/manus-storage/product-images-stylized/product-1.png',
  2: '/manus-storage/product-images-stylized/product-2.png',
  3: '/manus-storage/product-images-stylized/product-3.png',
  4: '/manus-storage/product-images-stylized/product-4.png',
  5: '/manus-storage/product-images-stylized/product-5.png',
  6: '/manus-storage/product-images-stylized/product-6.png',
  7: '/manus-storage/product-images-stylized/product-7.png',
  8: '/manus-storage/product-images-stylized/product-8.png',
  9: '/manus-storage/product-images-stylized/product-9.png',
  10: '/manus-storage/product-images-stylized/product-10.png',
  11: '/manus-storage/product-images-stylized/product-11.png',
  12: '/manus-storage/product-images-stylized/product-12.png',
  13: '/manus-storage/product-images-stylized/product-13.png',
  14: '/manus-storage/product-images-stylized/product-14.png',
  15: '/manus-storage/product-images-stylized/product-15.png',
  16: '/manus-storage/product-images-stylized/product-16.png',
  17: '/manus-storage/product-images-stylized/product-17.png',
  18: '/manus-storage/product-images-stylized/product-18.png',
  19: '/manus-storage/product-images-stylized/product-19.png',
  20: '/manus-storage/product-images-stylized/product-20.png',
  21: '/manus-storage/product-images-stylized/product-21.png',
  22: '/manus-storage/product-images-stylized/product-22.png',
  23: '/manus-storage/product-images-stylized/product-23.png',
  24: '/manus-storage/product-images-stylized/product-24.png',
  25: '/manus-storage/product-images-stylized/product-25.png',
  26: '/manus-storage/product-images-stylized/product-26.png',
  27: '/manus-storage/product-images-stylized/product-27.png',
  28: '/manus-storage/product-images-stylized/product-28.png',
  29: '/manus-storage/product-images-stylized/product-29.png',
  30: '/manus-storage/product-images-stylized/product-30.png',
  31: '/manus-storage/product-images-stylized/product-31.png',
  32: '/manus-storage/product-images-stylized/product-32.png',
  33: '/manus-storage/product-images-stylized/product-33.png',
  34: '/manus-storage/product-images-stylized/product-34.png',
  35: '/manus-storage/product-images-stylized/product-35.png',
  36: '/manus-storage/product-images-stylized/product-36.png',
  37: '/manus-storage/product-images-stylized/product-37.png',
  38: '/manus-storage/product-images-stylized/product-38.png',
  39: '/manus-storage/product-images-stylized/product-39.png',
  40: '/manus-storage/product-images-stylized/product-40.png',
  41: '/manus-storage/product-images-stylized/product-41.png',
  42: '/manus-storage/product-images-stylized/product-42.png',
  43: '/manus-storage/product-images-stylized/product-43.png',
  44: '/manus-storage/product-images-stylized/product-44.png',
  45: '/manus-storage/product-images-stylized/product-45.png',
  46: '/manus-storage/product-images-stylized/product-46.png',
  47: '/manus-storage/product-images-stylized/product-47.png',
  48: '/manus-storage/product-images-stylized/product-48.png',
  49: '/manus-storage/product-images-stylized/product-49.png',
  50: '/manus-storage/product-images-stylized/product-50.png',
  51: '/manus-storage/product-images-stylized/product-51.png',
  52: '/manus-storage/product-images-stylized/product-52.png',
  53: '/manus-storage/product-images-stylized/product-53.png',
  54: '/manus-storage/product-images-stylized/product-54.png',
  55: '/manus-storage/product-images-stylized/product-55.png',
  56: '/manus-storage/product-images-stylized/product-56.png',
  57: '/manus-storage/product-images-stylized/product-57.png',
  58: '/manus-storage/product-images-stylized/product-58.png',
  59: '/manus-storage/product-images-stylized/product-59.png',
  60: '/manus-storage/product-images-stylized/product-60.png',
  61: '/manus-storage/product-images-stylized/product-61.png',
  62: '/manus-storage/product-images-stylized/product-62.png',
  63: '/manus-storage/product-images-stylized/product-63.png',
  64: '/manus-storage/product-images-stylized/product-64.png',
  65: '/manus-storage/product-images-stylized/product-65.png',
  66: '/manus-storage/product-images-stylized/product-66.png',
  67: '/manus-storage/product-images-stylized/product-67.png',
  68: '/manus-storage/product-images-stylized/product-68.png',
  69: '/manus-storage/product-images-stylized/product-69.png',
  70: '/manus-storage/product-images-stylized/product-70.png',
  71: '/manus-storage/product-images-stylized/product-71.png',
  72: '/manus-storage/product-images-stylized/product-72.png',
  73: '/manus-storage/product-images-stylized/product-73.png',
  74: '/manus-storage/product-images-stylized/product-74.png',
  75: '/manus-storage/product-images-stylized/product-75.png',
  76: '/manus-storage/product-images-stylized/product-76.png',
  77: '/manus-storage/product-images-stylized/product-77.png',
  78: '/manus-storage/product-images-stylized/product-78.png',
  79: '/manus-storage/product-images-stylized/product-79.png',
  80: '/manus-storage/product-images-stylized/product-80.png',
  81: '/manus-storage/product-images-stylized/product-81.png',
  82: '/manus-storage/product-images-stylized/product-82.png',
  83: '/manus-storage/product-images-stylized/product-83.png',
  84: '/manus-storage/product-images-stylized/product-84.png',
  85: '/manus-storage/product-images-stylized/product-85.png',
  86: '/manus-storage/product-images-stylized/product-86.png',
  87: '/manus-storage/product-images-stylized/product-87.png',
  88: '/manus-storage/product-images-stylized/product-88.png',
  89: '/manus-storage/product-images-stylized/product-89.png',
  90: '/manus-storage/product-images-stylized/product-90.png',
  91: '/manus-storage/product-images-stylized/product-91.png',
  92: '/manus-storage/product-images-stylized/product-92.png',
  93: '/manus-storage/product-images-stylized/product-93.png',
  94: '/manus-storage/product-images-stylized/product-94.png',
  95: '/manus-storage/product-images-stylized/product-95.png',
  96: '/manus-storage/product-images-stylized/product-96.png',
  97: '/manus-storage/product-images-stylized/product-97.png',
  98: '/manus-storage/product-images-stylized/product-98.png',
  99: '/manus-storage/product-images-stylized/product-99.png',
  100: '/manus-storage/product-images-stylized/product-100.png',
};

// Generate mapping for remaining products (101-1496)
for (let i = 101; i <= 1496; i++) {
  imageMapping[i] = `/manus-storage/product-images-stylized/product-${i}.png`;
}

const updateProductImages = async () => {
  let connection;
  try {
    console.log('🚀 Starting bulk product image update...\n');
    
    // Parse DATABASE_URL to extract connection parameters
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL environment variable not set!');
      process.exit(1);
    }

    // Parse connection string: mysql://user:password@host:port/database
    const urlObj = new URL(dbUrl);
    const config = {
      host: urlObj.hostname,
      port: parseInt(urlObj.port || '3306'),
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.slice(1),
      ssl: { rejectUnauthorized: false }, // Enable SSL for TiDB Cloud
    };

    console.log(`📡 Connecting to database: ${config.database} at ${config.host}:${config.port}`);
    
    // Create connection with explicit lifecycle management
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');
    
    const db = drizzle(connection);
    
    // Get all product IDs to update
    const productIds = Object.keys(imageMapping).map(Number);
    console.log(`📦 Found ${productIds.length} products to update with images\n`);
    
    let updated = 0;
    let failed = 0;
    const failedProducts = [];
    
    // Process products in batches
    const batchSize = 50;
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(productIds.length / batchSize);
      
      console.log(`⏳ Processing batch ${batchNum}/${totalBatches} (${batch.length} products)...`);
      
      for (const productId of batch) {
        try {
          const imageUrl = imageMapping[productId];
          await db
            .update(products)
            .set({ imageUrl })
            .where(eq(products.id, productId));
          updated++;
        } catch (error) {
          failed++;
          failedProducts.push({
            id: productId,
            error: error.message,
          });
          console.error(`  ❌ Failed to update product ${productId}: ${error.message}`);
        }
      }
      
      console.log(`  ✅ Batch ${batchNum} complete (${updated} updated, ${failed} failed)\n`);
    }
    
    console.log('\n📊 Update Summary:');
    console.log(`  ✅ Successfully updated: ${updated} products`);
    console.log(`  ❌ Failed: ${failed} products`);
    
    if (failedProducts.length > 0 && failedProducts.length <= 20) {
      console.log(`\n📋 Failed products:`);
      failedProducts.forEach(p => {
        console.log(`  - Product ${p.id}: ${p.error}`);
      });
    }
    
    if (updated === productIds.length) {
      console.log('\n🎉 All product images updated successfully!');
    }
    
  } catch (error) {
    console.error('Fatal error during image update:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
};

// Run update
updateProductImages().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
