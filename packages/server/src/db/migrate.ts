import path from 'path';
import { migrate } from 'postgres-migrations';

export async function performMigrations() {
  const dbConfig = {
    database: process.env.PGDATABASE || 'big_yikes',
    user: process.env.PGUSER || 'user',
    password: process.env.PGPASSWORD || 'password',
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  };

  await migrate(dbConfig, path.join(process.cwd(), 'src/db/migrations/'));
}
