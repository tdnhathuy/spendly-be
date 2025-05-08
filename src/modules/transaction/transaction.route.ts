// transaction/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import controller from "./transaction.controller";

export default async function transactionRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();

  server.get("/", {
      preHandler: app.authenticate,
      schema: {tags: ["Transaction"]},
    }, controller.getAll);
  server.get("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Transaction"]},
    }, controller.getById);
  server.post("/", {
      preHandler: app.authenticate,
      schema: {tags: ["Transaction"]},
    }, controller.create);
  server.put("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Transaction"]},
    }, controller.update);
  server.delete("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Transaction"]},
    }, controller.delete);
}
