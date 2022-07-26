import { Pool } from 'pg';

export const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

export const query = async (text: string, params?: string[]) => {
  const res = await pool.query(text, params);
  return res.rows;
};

export const beginTransaction = async () => {
  await pool.query('BEGIN');
};

export const commitTransaction = async () => {
  await pool.query('COMMIT');
};

export const rollbackTransaction = async () => {
  await pool.query('ROLLBACK');
};
