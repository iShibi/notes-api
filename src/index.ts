import Fastify from 'fastify';
import { decorate } from './decorators.js';
import { register } from './registers.js';

const fastify = Fastify();

fastify.setNotFoundHandler((request, reply) => {
  return reply.status(404).send({
    code: 'ResourceNotFound',
    status: 404,
    message: 'Unable to find the requested resource.'
  });
});

await decorate(fastify);
await register(fastify);

const startServer = async () => {
  try {
    const PORT = process.env['PORT'] ?? 3080;
    const address = await fastify.listen(PORT, '0.0.0.0');
    console.log(address);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
