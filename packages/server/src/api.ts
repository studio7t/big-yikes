import fastify from 'fastify';
import yikesRepo, { WriteYikes } from './repositories/yikes.repo';

const app = fastify({ logger: true });

app.get('/yikes', async (request, reply) => {
  const res = await yikesRepo.getAll();
  reply.send(res);
});

app.post<{ Body: WriteYikes }>(
  '/yikes',
  {
    schema: {
      body: {
        content: { type: 'string' },
      },
    },
  },
  async (request, reply) => {
    const res = await yikesRepo.createOne({ content: request.body.content });
    reply.status(200).send(res);
  }
);

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
