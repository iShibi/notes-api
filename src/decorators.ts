import jwt from 'jsonwebtoken';
import Prisma from '@prisma/client';
import { type JwtCustomPayload } from './schemas/account.js';
import { type FastifyRequest, type FastifyInstance, type FastifyReply } from 'fastify';

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

export async function decorate(fastify: FastifyInstance) {
  fastify.decorate('prisma', prisma);

  fastify.decorateRequest('jwtPayload', null);

  fastify.decorate('verifyToken', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new Error('Provide a bearer token');
    const user = await prisma.user.findUnique({
      where: {
        token,
      }
    });
    if (!user) return reply.callNotFound();
    const tokenIsValid = jwt.verify(token, user.password);
    if (!tokenIsValid) throw new Error('Provided token is not valid');
    request.jwtPayload = jwt.decode(token) as JwtCustomPayload;
  });
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: Prisma.PrismaClient;
    verifyToken(request: FastifyRequest, reply: FastifyReply): Promise<void>;
  }

  interface FastifyRequest {
    jwtPayload: JwtCustomPayload;
  }
}
