// transaction/schema.ts
import { Type } from '@sinclair/typebox';
import { Static } from '@sinclair/typebox';

export const GetResponse = Type.Array(Type.Object({
  id: Type.Number(),
  name: Type.String(),
}));

export type GetResponseType = Static<typeof GetResponse>;

export default {
  get: {
    response: {
      200: GetResponse,
    },
  },
};
