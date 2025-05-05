import { FastifyInstance } from "fastify";
import { HomeController } from "./home.controller";

export function registerHomeRoutes(fastify: FastifyInstance) {
  const controller = new HomeController();
  
  fastify.get(
    "/",
    {
      schema: {
        description: "Home route",
        response: {
          200: {
            type: "string",
          },
        },
      },
    },
    controller.getHomePage
  );
} 