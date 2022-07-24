import { pool, query } from '../db';
import { performMigrations } from '../db/migrate';

const tables = [
  'saves',
  'projects',
  'bin_entries',
  'bins',
  'blocks',
  'block_types',
  'discoveries',
  'structures',
  'users',
];

beforeAll(async () => {
  await query(`DROP TABLE IF EXISTS ${tables.join(', ')}, migrations`);
  await performMigrations();
});

afterAll(async () => {
  await pool.end();
});
