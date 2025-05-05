import fastifyMongo from "@fastify/mongodb";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { FastifyMongoObject, FastifyMongoNestedObject } from "@fastify/mongodb";
import { config } from "../config/config";

// Thêm định nghĩa để TypeScript nhận biết thuộc tính mongo
declare module "fastify" {
  interface FastifyInstance {
    mongo: FastifyMongoObject & FastifyMongoNestedObject;
  }
}

const mongodbPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyMongo, {
    url: config.mongodb.url,
    database: config.mongodb.dbName,
    forceClose: true,
  });
};

export default mongodbPlugin; 