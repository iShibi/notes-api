import { FromSchema } from 'json-schema-to-ts';

export const NewUser = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    username: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['username', 'email', 'password'],
  additionalProperties: false,
} as const;
export type NewUserType = FromSchema<typeof NewUser>;

export const User = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    username: { type: 'string' },
    createdAt: { type: 'string' },
  },
  required: ['id', 'email', 'username', 'createdAt'],
  additionalProperties: false,
} as const;
export type UserType = FromSchema<typeof User>;

export const GetUserByIdParams = {
  type: 'object',
  properties: {
    id: { type: 'string' }
  },
  required: ['id'],
  additionalProperties: false,
} as const;
export type GetUserByIdParamsType = FromSchema<typeof GetUserByIdParams>;
