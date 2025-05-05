import fastifyMongo from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { FastifyMongoObject, FastifyMongoNestedObject } from "@fastify/mongodb";
import { config } from "../config/config";

// Thêm định nghĩa để TypeScript nhận biết thuộc tính mongo
declare module "fastify" {
  interface FastifyInstance {
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
  }
}

export async function registerMongoDB(fastify: FastifyInstance) {
  await fastify.register(fastifyMongo, {
    url: config.mongodb.url,
    database: config.mongodb.dbName,
    forceClose: true,
  });
} 