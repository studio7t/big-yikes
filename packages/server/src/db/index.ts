import path from 'path';
import { Pool } from 'pg';
import { migrate } from 'postgres-migrations';

export const db = new Pool();

export const performMigrations = async () => {
  await migrate({ client: db }, path.join(__dirname, 'migrations'));
};
