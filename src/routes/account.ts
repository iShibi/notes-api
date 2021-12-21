import jwt from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { randomUUID } from 'node:crypto';
import { type FastifyPluginAsync } from 'fastify';
import { NewUser, User, type UserType, type NewUserType } from '../schemas/user.js';
import { AccessToken, type AccessTokenType, EmailPassword, type EmailPasswordType, type JwtCustomPayload } from '../schemas/account.js';

const accountRoutes: FastifyPluginAsync = async fastify => {
  fastify.route<{ Body: NewUserType, Reply: UserType }>({
    method: 'POST',
    url: '/signup',
    schema: {
      body: NewUser,
      response: {
        201: User,
      }
    },
    handler: async (request, reply) => {
      const { body } = request;
      const createdUser = await fastify.prisma.user.create({
        data: {
          ...body,
          id: randomUUID(),
          createdAt: new Date(),
          password: await hash(body.password, 10),
        }
      });
      return reply.status(201).send({ ...createdUser, createdAt: createdUser.createdAt.toISOString() });
    }
  });

  fastify.route<{ Body: EmailPasswordType, Reply: AccessTokenType }>({
    method: 'POST',
    url: '/login',
    schema: {
      body: EmailPassword,
      response: {
        200: AccessToken,
      }
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;
      const user = await fastify.prisma.user.findUnique({
        where: {
          email,
        }
      });
      if (!user) return reply.callNotFound();
      const passwordIsValid = await compare(password, user.password);
      if (!passwordIsValid) throw new Error('Provided password is not valid');
      const payload: JwtCustomPayload = {
        userId: user.id,
      }
      const token = jwt.sign(payload, user.password);
      await fastify.prisma.user.update({
        where: {
          email,
        },
        data: {
          token,
        }
      });
      return reply.status(200).send({ token_type: 'Bearer', access_token: token });
    }
  });
}

export default accountRoutes;