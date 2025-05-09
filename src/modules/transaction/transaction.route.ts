// transaction/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import { ControllerTransaction } from "./transaction.controller";

export default async function transactionRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();
  const tags = ["Transaction"];
  server.post("/", { schema: { tags } }, ControllerTransaction.create);
  server.get("/", { schema: { tags } }, ControllerTransaction.getAll);
}
