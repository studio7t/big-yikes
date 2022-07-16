import { Pool } from 'pg';

export const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export const query = async (text: string, params?: string[]) => {
  const res = await pool.query(text, params);
  return res.rows;
};
