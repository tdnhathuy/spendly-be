// profile/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import controller from "./profile.controller";
export default async function profileRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();

  server.get("/", {}, controller.getAll);
  server.post("/", {}, controller.create);
  server.put("/:id", {}, controller.update);
  server.delete("/:id", {}, controller.delete);
}
