import { Pool } from 'pg';

const pool = new Pool({
  host: '43.216.182.1',
  port: 5432,
  database: 'mkhub_products',
  user: 'mkdevcy',
  password: 'Cyisgay123!'
});

export async function getProductByQR(sku: string) {
  try {
    const result = await pool.query(
      'SELECT name_shop, CAST(out_price AS FLOAT) as out_price, quantity FROM catalogue.products WHERE sku = $1',
      [sku]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
} 