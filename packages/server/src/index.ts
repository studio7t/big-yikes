import 'dotenv/config';
import { start } from './api';
import { performMigrations } from './db/migrate';

(async () => {
  await performMigrations();
  start();
})();
