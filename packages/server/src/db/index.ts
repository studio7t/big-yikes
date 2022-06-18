import { Pool } from 'pg';

const pool = new Pool();

async function query(text: string, params: string[]) {
  const res = await pool.query(text, params);
  return res;
}

export default { query };
