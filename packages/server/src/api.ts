import fastify from 'fastify';
import yikesRepo from './yikes.repo';

const app = fastify({ logger: true });

app.get('/yikes', async (request, reply) => {
  const res = await yikesRepo.getAll();
  reply.send(res.rows);
});

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send();
});

// Run the server!
export const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
