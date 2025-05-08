// profile/controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceProfile } from "./profile.service";
import { ProfileCreate, ProfileUpdate } from "./profile.schema";
export default {
  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    return ServiceProfile.getAll(req.server);
  },

  getById: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const data = await ServiceProfile.getById(req.server, req.params.id);
    data
      ? reply.send(data)
      : reply.code(404).send({ message: "Profile not found" });
  },

  create: async (
    req: FastifyRequest<{ Body: ProfileCreate }>,
    reply: FastifyReply
  ) => {
    reply.code(201).send(await ServiceProfile.create(req.server, req.body));
  },

  update: async (
    req: FastifyRequest<{ Params: { id: string }; Body: ProfileUpdate }>,
    reply: FastifyReply
  ) => {
    const data = await ServiceProfile.update(
      req.server,
      req.params.id,
      req.body
    );
    data
      ? reply.send(data)
      : reply.code(404).send({ message: "Profile not found" });
  },

  delete: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const data = await ServiceProfile.delete(req.server, req.params.id);
    data
      ? reply.send(data)
      : reply.code(404).send({ message: "Profile not found" });
  },

  getInfo: async (
    req: FastifyRequest<{ Body: { id: string } }>,
    reply: FastifyReply
  ) => {
    return ServiceProfile.getInfo(req.server, req.body.id);
  },
};
