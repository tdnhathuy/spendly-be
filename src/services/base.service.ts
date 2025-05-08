import { FastifyInstance } from "fastify";
import { Collection } from "mongodb";

export class BaseService {
  protected fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  protected getCollection(collectionName: string): Collection {
    if (!this.fastify.mongo || !this.fastify.mongo.db) {
      throw new Error("Database connection error");
    }
    return this.fastify.mongo.db.collection(collectionName);
  }
} 