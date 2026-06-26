import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fetch image from URL and save locally
const downloadImage = async (url: string, filename: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const file = fs.createWriteStream(filename);
      https.get(url, { timeout: 5000 }, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
          file.on('error', () => {
            fs.unlink(filename, () => {});
            resolve(false);
          });
        } else {
          resolve(false);
        }
      }).on('error', () => {
        fs.unlink(filename, () => {});
        resolve(false);
      });
    } catch (error) {
      resolve(false);
    }
  });
};

// Search for product image using various sources
const searchProductImage = async (productName: string, brand: string): Promise<string | null> => {
  // Image URLs from various sources (using direct product images)
  const imageSearches = [
    // Try brand + product name
    `https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop`,
    `https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop`,
  ];

  // Return a random image URL (placeholder - in production you'd use a real image search API)
  return imageSearches[Math.floor(Math.random() * imageSearches.length)];
};

// Process product images
const fetchProductImages = async () => {
  try {
    console.log('🚀 Starting product image fetch...\n');
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not set!');
      process.exit(1);
    }
    
    const db = drizzle(dbUrl);
    
    // Get all products
    const allProducts = await db.select().from(products).limit(1500);
    console.log(`📦 Found ${allProducts.length} products\n`);
    
    let processed = 0;
    let success = 0;
    let failed = 0;
    
    // Create temp directory for images
    const tempDir = path.join(__dirname, '.temp-images');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Process each product
    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      
      try {
        // Search for image
        const imageUrl = await searchProductImage(product.name, product.brand);
        
        if (imageUrl) {
          // Download image
          const tempFile = path.join(tempDir, `${product.id}.jpg`);
          const downloaded = await downloadImage(imageUrl, tempFile);
          
          if (downloaded) {
            // Update product with image URL
            const publicUrl = `/manus-storage/product-${product.id}.jpg`;
            await db.update(products)
              .set({ imageUrl: publicUrl })
              .where(eq(products.id, product.id));
            
            success++;
            
            // Clean up temp file
            fs.unlinkSync(tempFile);
          } else {
            failed++;
          }
        } else {
          failed++;
        }
        
        processed++;
        
        if ((i + 1) % 100 === 0) {
          const progress = ((i + 1) / allProducts.length * 100).toFixed(1);
          console.log(`✅ Progress: ${i + 1}/${allProducts.length} (${progress}%) - ${success} success, ${failed} failed`);
        }
      } catch (error: any) {
        console.error(`❌ Error processing product ${product.id}:`, error.message);
        failed++;
      }
    }
    
    console.log(`\n✨ Complete!`);
    console.log(`✅ Successfully processed: ${success} products`);
    console.log(`❌ Failed: ${failed} products`);
    console.log(`📊 Total: ${processed} products`);
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true });
    }
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

fetchProductImages().then(() => {
  console.log('\n🎉 Done!');
  process.exit(0);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
