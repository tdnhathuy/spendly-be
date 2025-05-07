// transaction/schema.ts
import { Type, Static } from '@sinclair/typebox';

const Transaction = Type.Object({
  id:        Type.Number(),
  name:      Type.String(),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
});

export const ParamsId  = Type.Object({ id: Type.String() });
export const CreateReq = Type.Omit(Transaction, ['id', 'createdAt', 'updatedAt']);
export const UpdateReq = Type.Partial(CreateReq);

export type ParamsIdType = Static<typeof ParamsId>;
export type CreateType   = Static<typeof CreateReq>;
export type UpdateType   = Static<typeof UpdateReq>;

export default {
  getAll : { response: { 200: Type.Array(Transaction) }, tags: ["Transaction"] },

  getById: {
    tags: ["Transaction"],
    params: ParamsId,
    response: { 200: Transaction, 404: err() }
  },

  create : {
    tags: ["Transaction"],
    body: CreateReq,
    response: { 201: Transaction }
  },

  update : {
    tags: ["Transaction"],
    params: ParamsId,
    body: UpdateReq,
    response: { 200: Transaction, 404: err() }
  },

  del: {
    tags: ["Transaction"],
    params: ParamsId,
    response: { 200: Type.Object({ success: Type.Boolean() }), 404: err() }
  }
};

function err() { return Type.Object({ message: Type.String() }); }
