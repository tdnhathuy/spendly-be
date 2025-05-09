import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();

  const tags = ["Auth"];

  server.get("/auth/me", { schema: { tags } }, () => {
    return {
      message: "Hello World",
    };
  });

  server.post("/auth/logout", { schema: { tags } }, () => {
    return {
      message: "Hello World",
    };
  });
}
