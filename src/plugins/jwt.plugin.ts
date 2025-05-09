import { FastifyInstance } from "fastify";

export const pluginJwt = async (fastify: FastifyInstance) => {
  fastify.decorate("authenticate", async (request, reply) => {
    console.log("request", request);
  });
};
