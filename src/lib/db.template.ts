import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
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