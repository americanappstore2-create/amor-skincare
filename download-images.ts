import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Search for product image using Bing Image Search
const searchProductImage = async (productName: string): Promise<string | null> => {
  try {
    // Use DuckDuckGo image search API (free, no key required)
    const encodedName = encodeURIComponent(productName);
    const searchUrl = `https://duckduckgo.com/?q=${encodedName}+skincare+product&iax=images&ia=images`;
    
    // For simplicity, we'll use a placeholder service
    // In production, you'd use a real image search API
    
    // Try to find images from common skincare product databases
    const imageUrls = [
      `https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop`, // Generic skincare
      `https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=500&h=500&fit=crop`, // Skincare products
    ];
    
    // Return a random image for now (placeholder)
    return imageUrls[Math.floor(Math.random() * imageUrls.length)];
  } catch (error) {
    console.error(`Error searching image for ${productName}:`, error);
    return null;
  }
};

// Download image from URL
const downloadImage = async (url: string, filename: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const protocol = url.startsWith('https') ? https : http;
      const file = fs.createWriteStream(filename);
      
      protocol.get(url, (response) => {
        if (response.statusCode !== 200) {
          resolve(false);
          return;
        }
        
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      }).on('error', () => {
        fs.unlink(filename, () => {});
        resolve(false);
      });
    } catch (error) {
      resolve(false);
    }
  });
};

// Main function
const downloadProductImages = async () => {
  try {
    console.log('🚀 Starting product image download...\n');
    
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL not set!');
      process.exit(1);
    }
    
    const db = drizzle(dbUrl);
    
    // Get all products without images
    const allProducts = await db.select().from(products).limit(1425);
    const productsWithoutImages = allProducts.filter(p => !p.imageUrl);
    
    console.log(`📦 Found ${productsWithoutImages.length} products without images\n`);
    
    let downloaded = 0;
    let failed = 0;
    
    // Create images directory
    const imagesDir = path.join(__dirname, 'client', 'public', 'product-images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    // Download images for each product
    for (let i = 0; i < Math.min(productsWithoutImages.length, 100); i++) {
      const product = productsWithoutImages[i];
      
      try {
        const imageUrl = await searchProductImage(product.name);
        if (!imageUrl) {
          failed++;
          continue;
        }
        
        const filename = path.join(imagesDir, `${product.id}.jpg`);
        const success = await downloadImage(imageUrl, filename);
        
        if (success) {
          // Update product with image URL
          const publicUrl = `/product-images/${product.id}.jpg`;
          await db.update(products)
            .set({ imageUrl: publicUrl })
            .where(eq(products.id, product.id));
          
          downloaded++;
          
          if ((i + 1) % 10 === 0) {
            console.log(`✅ Downloaded ${i + 1} images...`);
          }
        } else {
          failed++;
        }
      } catch (error: any) {
        console.error(`❌ Error processing ${product.name}:`, error.message);
        failed++;
      }
    }
    
    console.log(`\n✨ Download complete!`);
    console.log(`✅ Successfully downloaded: ${downloaded} images`);
    console.log(`❌ Failed: ${failed} images`);
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
};

downloadProductImages().then(() => {
  console.log('\n🎉 Done!');
  process.exit(0);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
