import { type FastifyPluginAsync } from 'fastify';
import { GetUserByIdParams, User, type GetUserByIdParamsType, type UserType } from '../schemas/user.js';

const userRoutes: FastifyPluginAsync = async fastify => {
  fastify.route<{ Params: GetUserByIdParamsType, Reply: UserType }>({
    method: 'GET',
    url: '/users/:id',
    schema: {
      params: GetUserByIdParams,
      response: {
        200: User
      }
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const user = await fastify.prisma.user.findUnique({
        where: {
          id,
        }
      });
      if (user) return reply.status(200).send({ ...user, createdAt: user.createdAt.toISOString() });
      return reply.callNotFound();
    }
  });
}

export default userRoutes;
