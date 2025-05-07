// transaction/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import controller from "./transaction.controller";

export default async function transactionRoutes(app: FastifyInstance) {
	const server = app.withTypeProvider<TypeBoxTypeProvider>();

	server.get("/", {}, controller.getAll);
	server.get("/:id", {}, controller.getById);
	server.post("/", {}, controller.create);
	server.put("/:id", {}, controller.update);
	server.delete("/:id", {}, controller.delete);
}
