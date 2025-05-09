// transaction/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import controller from "./transaction.controller";

export default async function transactionRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();
  const tags = ["Transaction"];

  server.get("/", { schema: { tags } }, controller.getAll);
  server.get("/:id", { schema: { tags } }, controller.getById);
  server.post("/", { schema: { tags } }, controller.create);
  server.put("/:id", { schema: { tags } }, controller.update);
  server.delete("/:id", { schema: { tags } }, controller.delete);
}
