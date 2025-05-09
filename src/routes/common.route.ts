import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  const tags = ["Common"];

  server.get("/", { schema: { tags } }, () => {
    return { message: "Hello World" };
  });

  server.post("/hello", { schema: { tags } }, () => {
    return { status: "ok", timestamp: new Date() };
  });
}
