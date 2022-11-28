import cors from '@fastify/cors';
import fastify from 'fastify';
import fastifyAuth0Verify from 'fastify-auth0-verify';
import { discoveryRoutes } from './routes/discovery';

export const app = fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send();
});

app.register(cors);

app.register(fastifyAuth0Verify, {
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
});

app.register(discoveryRoutes);
