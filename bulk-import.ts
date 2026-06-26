import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/mysql2';
import { products } from './drizzle/schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Category mapping based on product keywords
const categorizeProduct = (productName: string): string => {
  const name = productName.toLowerCase();
  
  if (name.includes('mask') || name.includes('маска')) return 'mask';
  if (name.includes('cream') || name.includes('крем')) return 'cream';
  if (name.includes('serum') || name.includes('сыворотка')) return 'serum';
  if (name.includes('toner') || name.includes('тонер') || name.includes('essence')) return 'toner';
  if (name.includes('shampoo') || name.includes('шампунь')) return 'shampoo';
  if (name.includes('conditioner') || name.includes('кондиционер')) return 'conditioner';
  if (name.includes('cleanser') || name.includes('washing') || name.includes('очищение') || 
      name.includes('foam') || name.includes('пенка') || name.includes('powder')) return 'cleanser';
  if (name.includes('oil') || name.includes('масло')) return 'oil';
  if (name.includes('blush') || name.includes('румяна')) return 'blush';
  if (name.includes('lip gloss') || name.includes('gloss') || name.includes('блеск')) return 'lip_products';
  if (name.includes('lip') || name.includes('губ')) return 'lip_products';
  if (name.includes('pencil') || name.includes('карандаш')) return 'pencil';
  if (name.includes('sunscreen') || name.includes('spf') || name.includes('солнцезащит')) return 'sunscreen';
  if (name.includes('deo') || name.includes('дезодорант')) return 'deodorant';
  if (name.includes('sponge') || name.includes('спонж') || name.includes('brush')) return 'tools';
  if (name.includes('set') || name.includes('набор') || name.includes('travel')) return 'sets';
  if (name.includes('fluid') || name.includes('флюид')) return 'fluid';
  if (name.includes('powder') || name.includes('пудра')) return 'powder';
  if (name.includes('eye') || name.includes('глаза')) return 'eye_care';
  
  return 'other';
};

// Extract brand from product name
const extractBrand = (productName: string): string => {
  const parts = productName.split(' ');
  if (parts.length > 0) {
    const brand = parts[0].replace(/[^a-zA-Zа-яА-Я0-9]/g, '');
    return brand.length > 0 ? brand : 'Unknown';
  }
  return 'Unknown';
};

// Generate simple description based on category
const generateDescription = (productName: string, category: string): string => {
  const categoryDescriptions: Record<string, string> = {
    mask: 'Питательная маска для интенсивного ухода и восстановления кожи. Обогащена активными компонентами для видимого результата.',
    cream: 'Премиум крем для комплексного ухода. Обеспечивает глубокое увлажнение и питание кожи.',
    serum: 'Концентрированная сыворотка с активными компонентами. Быстро впитывается и дарит коже сияние.',
    toner: 'Балансирующий тонер для подготовки кожи. Восстанавливает pH и улучшает впитываемость уходовых средств.',
    shampoo: 'Мягкий шампунь для ежедневного ухода за волосами. Очищает и питает волосы, не пересушивая.',
    conditioner: 'Кондиционер для мягкости и блеска волос. Облегчает расчесывание и восстанавливает структуру.',
    cleanser: 'Нежный очищающий продукт для эффективного удаления загрязнений. Подходит для чувствительной кожи.',
    oil: 'Натуральное масло для питания и восстановления кожи. Обогащено полезными компонентами.',
    blush: 'Стойкие румяна с естественным оттенком. Создают свежий и здоровый вид лица.',
    lip_products: 'Помада или блеск для губ с ухаживающей формулой. Дарит насыщенный цвет и блеск.',
    pencil: 'Карандаш для макияжа с точной линией. Стойкая формула держится весь день.',
    sunscreen: 'Солнцезащитное средство для защиты кожи. Предотвращает преждевременное старение.',
    deodorant: 'Дезодорант с длительной защитой. Обеспечивает свежесть на весь день.',
    tools: 'Профессиональный инструмент для нанесения косметики. Обеспечивает идеальное распределение продукта.',
    sets: 'Набор премиум продуктов для полноценного ухода. Идеален для путешествий и подарков.',
    fluid: 'Легкий флюид с увлажняющей формулой. Идеален для комбинированной кожи.',
    powder: 'Пудра для фиксации макияжа. Матирует кожу и обеспечивает долгоносящий результат.',
    eye_care: 'Специальное средство для нежной кожи вокруг глаз. Уменьшает морщины и отечность.',
    other: 'Премиум косметический продукт для ухода за кожей и красоты.'
  };
  
  return categoryDescriptions[category] || categoryDescriptions.other;
};

// Main import function
const importProducts = async () => {
  try {
    console.log('🚀 Starting bulk product import...\n');
    
    // Get database URL from environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.error('❌ DATABASE_URL environment variable not set!');
      process.exit(1);
    }
    
    // Connect to database
    const db = drizzle(dbUrl);
    
    // Read products from JSON
    const productsPath = path.join(__dirname, 'products_to_import.json');
    if (!fs.existsSync(productsPath)) {
      console.error('❌ products_to_import.json not found!');
      process.exit(1);
    }
    
    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    console.log(`📦 Found ${productsData.length} products to import\n`);
    
    let imported = 0;
    let failed = 0;
    const failedProducts: Array<{name: string; error: string}> = [];
    
    // Process products
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];
      
      try {
        const category = categorizeProduct(productData.name);
        const brand = extractBrand(productData.name);
        const description = generateDescription(productData.name, category);
        
        // Insert into database
        await db.insert(products).values({
          name: productData.name,
          price: productData.price.toString(),
          category: category as any,
          brand: brand,
          description: description,
          imageUrl: null,
          inStock: 1,
        });
        
        imported++;
        
        // Progress update every 50 products
        if ((i + 1) % 50 === 0) {
          const progress = ((i + 1) / productsData.length * 100).toFixed(1);
          console.log(`✅ Progress: ${i + 1}/${productsData.length} (${progress}%) - ${imported} imported`);
        }
      } catch (error: any) {
        failed++;
        failedProducts.push({
          name: productData.name,
          error: error.message
        });
        
        if (failed <= 10) {
          console.error(`❌ Failed to import "${productData.name}":`, error.message);
        }
      }
    }
    
    console.log(`\n✨ Import complete!`);
    console.log(`✅ Successfully imported: ${imported} products`);
    console.log(`❌ Failed: ${failed} products`);
    console.log(`📊 Total: ${imported + failed} products processed`);
    
    if (failedProducts.length > 0 && failedProducts.length <= 20) {
      console.log(`\n📋 Failed products:`);
      failedProducts.forEach(p => {
        console.log(`  - ${p.name}: ${p.error}`);
      });
    }
    
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
