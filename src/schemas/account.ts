import { FromSchema } from 'json-schema-to-ts';

export const EmailPassword = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
} as const;
export type EmailPasswordType = FromSchema<typeof EmailPassword>;

export const AccessToken = {
  type: 'object',
  properties: {
    token_type: { type: 'string' },
    access_token: { type: 'string' },
  },
  required: ['token_type', 'access_token'],
  additionalProperties: false,
} as const;
export type AccessTokenType = FromSchema<typeof AccessToken>;

export interface JwtCustomPayload {
  userId: string;
}
