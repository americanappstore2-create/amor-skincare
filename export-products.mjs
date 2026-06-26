import mysql from 'mysql2/promise';
import fs from 'fs';

async function exportProducts() {
  let connection;
  try {
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
    const [products] = await connection.query('SELECT id, name, category, brand FROM products ORDER BY id');
    
    // Create CSV
    let csv = 'ID,Name,Category,Brand\n';
    products.forEach(p => {
      csv += `${p.id},"${p.name.replace(/"/g, '""')}",${p.category},${p.brand}\n`;
    });
    
    fs.writeFileSync('/home/ubuntu/products-export.csv', csv);
    console.log(`✅ Exported ${products.length} products to /home/ubuntu/products-export.csv`);
    
    // Also create JSON for easier processing
    const json = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      brand: p.brand
    }));
    
    fs.writeFileSync('/home/ubuntu/products-export.json', JSON.stringify(json, null, 2));
    console.log(`✅ Exported ${products.length} products to /home/ubuntu/products-export.json`);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

exportProducts();
