import { Pool } from 'pg';

const pool = new Pool();

async function query(text: string, params: string[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('executed query', { text, duration, rows: res.rowCount });
  return res;
}

export default { query };
