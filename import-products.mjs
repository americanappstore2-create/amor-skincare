import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { invokeLLM } from './server/_core/llm.ts';
import { db } from './server/db.ts';
import { products } from './drizzle/schema.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Category mapping based on product keywords
const categorizeProduct = (productName) => {
  const name = productName.toLowerCase();
  
  // Маски
  if (name.includes('mask') || name.includes('маска')) return 'Маски';
  
  // Кремы
  if (name.includes('cream') || name.includes('крем')) return 'Кремы';
  
  // Сыворотки
  if (name.includes('serum') || name.includes('сыворотка')) return 'Сыворотки';
  
  // Тонеры
  if (name.includes('toner') || name.includes('тонер') || name.includes('essence')) return 'Тонеры';
  
  // Шампуни
  if (name.includes('shampoo') || name.includes('шампунь')) return 'Шампуни';
  
  // Кондиционеры
  if (name.includes('conditioner') || name.includes('кондиционер')) return 'Кондиционеры';
  
  // Очищение
  if (name.includes('cleanser') || name.includes('washing') || name.includes('очищение') || 
      name.includes('foam') || name.includes('пенка') || name.includes('powder')) return 'Очищение';
  
  // Масла
  if (name.includes('oil') || name.includes('масло')) return 'Масла';
  
  // Макияж - Румяна
  if (name.includes('blush') || name.includes('румяна')) return 'Румяна';
  
  // Макияж - Помады и блески
  if (name.includes('lip gloss') || name.includes('gloss') || name.includes('блеск')) return 'Помады & Блески';
  if (name.includes('lip') || name.includes('губ')) return 'Помады & Блески';
  
  // Макияж - Карандаши
  if (name.includes('pencil') || name.includes('карандаш')) return 'Карандаши';
  
  // Санскрин
  if (name.includes('sunscreen') || name.includes('spf') || name.includes('солнцезащит')) return 'Санскрин';
  
  // Дезодоранты
  if (name.includes('deo') || name.includes('дезодорант')) return 'Дезодоранты';
  
  // Инструменты
  if (name.includes('sponge') || name.includes('спонж') || name.includes('brush')) return 'Инструменты';
  
  // Наборы
  if (name.includes('set') || name.includes('набор') || name.includes('travel')) return 'Наборы';
  
  // Флюиды
  if (name.includes('fluid') || name.includes('флюид')) return 'Флюиды';
  
  // Пудры
  if (name.includes('powder') || name.includes('пудра')) return 'Пудры';
  
  // Default
  return 'Уход за кожей';
};

// Generate description using LLM
const generateDescription = async (productName, category) => {
  try {
    const prompt = `Generate a short, professional description (1-2 sentences) for a skincare product: "${productName}" in category "${category}". 
    The description should be in Russian, premium tone, suitable for a luxury skincare e-commerce site.
    Focus on benefits and key features. Do not mention price or availability.
    Return only the description text, nothing else.`;
    
    const response = await invokeLLM({
      messages: [
        { role: 'system', content: 'You are a luxury skincare product copywriter. Write concise, premium descriptions.' },
        { role: 'user', content: prompt }
      ]
    });
    
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Error generating description for ${productName}:`, error.message);
    return `Premium ${category.toLowerCase()} product for professional skincare care.`;
  }
};

// Main import function
const importProducts = async () => {
  try {
    console.log('🚀 Starting product import...\n');
    
    // Read products from JSON
    const productsPath = path.join(__dirname, 'products_to_import.json');
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    
    console.log(`📦 Found ${productsData.length} products to import\n`);
    
    let imported = 0;
    let failed = 0;
    
    // Process products in batches
    const batchSize = 50;
    for (let i = 0; i < productsData.length; i += batchSize) {
      const batch = productsData.slice(i, i + batchSize);
      
      for (const productData of batch) {
        try {
          const category = categorizeProduct(productData.name);
          const description = await generateDescription(productData.name, category);
          
          // Insert into database
          await db.insert(products).values({
            name: productData.name,
            price: productData.price,
            category: category,
            description: description,
            image: null, // Will be added later with actual images
            brand: productData.name.split(' ')[0], // Extract first word as brand
          });
          
          imported++;
          if (imported % 10 === 0) {
            console.log(`✅ Imported ${imported} products...`);
          }
        } catch (error) {
          failed++;
          console.error(`❌ Failed to import "${productData.name}":`, error.message);
        }
      }
      
      // Small delay between batches to avoid overwhelming the LLM
      if (i + batchSize < productsData.length) {
        console.log(`⏸️  Batch complete. Waiting before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\n✨ Import complete!`);
    console.log(`✅ Successfully imported: ${imported} products`);
    console.log(`❌ Failed: ${failed} products`);
    console.log(`📊 Total: ${imported + failed} products processed`);
    
  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  }
};

// Run import
importProducts().then(() => {
  console.log('\n🎉 Done!');
  process.exit(0);
}).catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
