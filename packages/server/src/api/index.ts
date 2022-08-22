import fastify from 'fastify';
import cors from '@fastify/cors';
import { discoveryRoutes } from './routes/discovery';

const app = fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send();
});

app.register(cors);

app.register(discoveryRoutes);

export const start = async () => {
  try {
    await app.listen({ port: 3001 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
