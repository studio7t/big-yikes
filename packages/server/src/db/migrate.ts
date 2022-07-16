import path from 'path';
import { migrate } from 'postgres-migrations';
import { pool } from '.';

export const performMigrations = async () => {
  await migrate({ client: pool }, path.join(__dirname, 'migrations/'));
};
