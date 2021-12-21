import { FromSchema } from 'json-schema-to-ts';

export const NewNote = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    content: { type: 'string' },
  },
  required: ['title', 'content'],
  additionalProperties: false,
} as const;
export type NewNoteType = FromSchema<typeof NewNote>;

export const Note = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' },
    authorId: { type: 'string' },
    createdAt: { type: 'string' },
  },
  required: ['title', 'content', 'id', 'createdAt', 'authorId'],
  additionalProperties: false,
} as const;
export type NoteType = FromSchema<typeof Note>;

export const GetNoteByIdParams = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id'],
  additionalProperties: false,
} as const;
export type GetNoteByIdParamsType = FromSchema<typeof GetNoteByIdParams>;
