// transaction/schema.ts
import { Type } from '@sinclair/typebox';
import { Static } from '@sinclair/typebox';

const TransactionType = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
});

export const ParamsWithId = Type.Object({
  id: Type.String()
});

export const GetAllResponse = Type.Array(TransactionType);

export const GetByIdResponse = TransactionType;

export const CreateRequest = Type.Object({
  name: Type.String()
});

export const CreateResponse = TransactionType;

export const UpdateRequest = Type.Object({
  name: Type.String()
});

export const UpdateResponse = TransactionType;

export const DeleteResponse = Type.Object({
  success: Type.Boolean()
});

export type ParamsWithIdType = Static<typeof ParamsWithId>;
export type GetAllResponseType = Static<typeof GetAllResponse>;
export type GetByIdResponseType = Static<typeof GetByIdResponse>;
export type CreateRequestType = Static<typeof CreateRequest>;
export type CreateResponseType = Static<typeof CreateResponse>;
export type UpdateRequestType = Static<typeof UpdateRequest>;
export type UpdateResponseType = Static<typeof UpdateResponse>;
export type DeleteResponseType = Static<typeof DeleteResponse>;

export default {
  getAll: {
    response: {
      200: GetAllResponse
    }
  },
  
  getById: {
    params: ParamsWithId,
    response: {
      200: GetByIdResponse,
      404: Type.Object({
        message: Type.String()
      })
    }
  },
  
  create: {
    body: CreateRequest,
    response: {
      201: CreateResponse
    }
  },
  
  update: {
    params: ParamsWithId,
    body: UpdateRequest,
    response: {
      200: UpdateResponse,
      404: Type.Object({
        message: Type.String()
      })
    }
  },
  
  delete: {
    params: ParamsWithId,
    response: {
      200: DeleteResponse,
      404: Type.Object({
        message: Type.String()
      })
    }
  }
};
