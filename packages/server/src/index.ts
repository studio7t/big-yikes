import 'dotenv/config';
import { app } from './api';
import { performMigrations } from './db';

(async () => {
  await performMigrations();

  try {
    await app.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
})();
