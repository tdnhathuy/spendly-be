import { FastifyInstance } from "fastify";
import {
  findAllDocuments,
  findDocumentById,
  insertDocument,
  updateDocument,
  deleteDocumentById,
  getMongoDB,
  transformDocument,
} from "../../helper/db.helper";
import { Profile } from "./profile.schema";
import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";
const COLLECTION_NAME = "profile";

export const ServiceProfile = {
  getAll: async (server: FastifyInstance) => {
    return await findAllDocuments(server, COLLECTION_NAME);
  },

  getById: async (server: FastifyInstance, id: string) => {
    return await findDocumentById(server, COLLECTION_NAME, id);
  },

  create: async (server: FastifyInstance, body: any) => {
    const data: Profile = { ...body, wallets: [] };
    if (data.name === "dummy") {
      data.name = faker.person.fullName();
    }
    return await insertDocument(server, COLLECTION_NAME, data);
  },

  update: async (server: FastifyInstance, id: string, body: any) => {
    return await updateDocument(server, COLLECTION_NAME, id, body);
  },

  delete: async (server: FastifyInstance, id: string) => {
    return await deleteDocumentById(server, COLLECTION_NAME, id);
  },

  getInfo: async (server: FastifyInstance, id: string) => {
    console.log('id', id)
    const db = getMongoDB(server);
    const collection = db.collection(COLLECTION_NAME);
    const result = await collection.findOne({ _id: new ObjectId(id) });
    return transformDocument(result);
  },
};
