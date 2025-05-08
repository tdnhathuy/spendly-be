// profile/service.ts
import { FastifyInstance } from "fastify";
import {
  findAllDocuments,
  findDocumentById,
  insertDocument,
  updateDocument,
  deleteDocumentById,
} from "../../helper/db.helper";

const COLLECTION_NAME = "profile";

export const ServiceProfile = {
  getAll: async (server: FastifyInstance) => {
    return await findAllDocuments(server, COLLECTION_NAME);
  },

  getById: async (server: FastifyInstance, id: string) => {
    return await findDocumentById(server, COLLECTION_NAME, id);
  },

  create: async (server: FastifyInstance, body: any) => {
    // Thêm các trường mặc định nếu cần
    const data = { ...body };
    return await insertDocument(server, COLLECTION_NAME, data);
  },

  update: async (server: FastifyInstance, id: string, body: any) => {
    return await updateDocument(server, COLLECTION_NAME, id, body);
  },

  delete: async (server: FastifyInstance, id: string) => {
    return await deleteDocumentById(server, COLLECTION_NAME, id);
  },
};
