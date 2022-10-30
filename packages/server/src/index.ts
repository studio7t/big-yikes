import 'dotenv/config';
import { start } from './api';
import { performMigrations } from './db';

(async () => {
  await performMigrations();
  start();
})();
