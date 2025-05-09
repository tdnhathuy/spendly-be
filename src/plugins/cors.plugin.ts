import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export const pluginCors = async (fastify: FastifyInstance) => {
  fastify.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  });
};
