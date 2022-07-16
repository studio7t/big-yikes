import { pool, query } from '../db';
import { performMigrations } from '../db/migrate';

beforeAll(async () => {
  await query(`DROP TABLE IF EXISTS big_yikes, migrations`);
  await performMigrations();
});

afterAll(async () => {
  await pool.end();
});
