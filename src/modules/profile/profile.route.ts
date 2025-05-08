// profile/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import controller from "./profile.controller";

export default async function profileRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();

  server.get("/", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.getAll);
  server.get("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.getById);
  server.post("/", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.create);
  server.put("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.update);
  server.delete("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.delete);
}
