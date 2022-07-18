import fastify from 'fastify';

const app = fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send();
});

export const start = async () => {
  try {
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
