import fastifyAuth from 'fastify-auth';
import autoload from 'fastify-autoload';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { type FastifyInstance } from 'fastify';

export async function register(fastify: FastifyInstance) {
  fastify.register(fastifyAuth);

  const directoryName = dirname(fileURLToPath(import.meta.url));
  fastify.register(autoload, {
    dir: join(directoryName, 'routes')
  });
}
