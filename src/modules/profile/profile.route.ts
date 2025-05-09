// profile/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import { ControllerProfile } from "./profile.controller";

export default async function profileRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();
  const tags = ["Profile"];

  const { setupProfile } = ControllerProfile;

  server.get("/setup", { schema: { tags } }, setupProfile);
}
