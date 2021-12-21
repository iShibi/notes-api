import { randomUUID } from 'node:crypto';
import { type FastifyPluginAsync } from 'fastify';
import { NewNote, type NewNoteType, Note, type NoteType, GetNoteByIdParams, type GetNoteByIdParamsType } from '../schemas/note.js';

const noteRoutes: FastifyPluginAsync = async fastify => {
  fastify.route<{ Body: NewNoteType, Reply: NoteType }>({
    method: 'POST',
    url: '/notes',
    schema: {
      body: NewNote,
      response: {
        201: Note,
      }
    },
    preHandler: fastify.auth([ fastify.verifyToken ]),
    handler: async function (request, reply) {
      const { body, jwtPayload } = request;
      const createdNote = await fastify.prisma.note.create({
        data: {
          ...body,
          id: randomUUID(),
          createdAt: new Date(),
          authorId: jwtPayload.userId,
        },
      });
      return reply.status(201).send({ ...createdNote, createdAt: createdNote.createdAt.toISOString() });
    }
  });

  fastify.route<{ Params: GetNoteByIdParamsType, Reply: NoteType }>({
    method: 'GET',
    url: '/notes/:id',
    schema: {
      params: GetNoteByIdParams,
      response: {
        200: Note,
      }
    },
    handler: async function (request, reply) {
      const { id } = request.params;
      const note = await fastify.prisma.note.findUnique({
        where: {
          id,
        }
      });
      if (note) return reply.status(200).send({ ...note, createdAt: note.createdAt.toISOString() });
      return reply.callNotFound();
    }
  });
}

export default noteRoutes;
