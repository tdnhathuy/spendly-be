// profile/controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import service from './service';
import { ParamsIdType, CreateType, UpdateType } from './schema';

export default {
  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    reply.send(await service.getAll(req.server));
  },

  getById: async (
    req: FastifyRequest<{ Params: ParamsIdType }>,
    reply: FastifyReply
  ) => {
    const data = await service.getById(req.server, req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: 'Profile not found' });
  },

  create: async (
    req: FastifyRequest<{ Body: CreateType }>,
    reply: FastifyReply
  ) => {
    // Ép kiểu để TypeScript không báo lỗi về unknown type
    const body = req.body as CreateType;
    reply.code(201).send(await service.create(req.server, body));
  },

  update: async (
    req: FastifyRequest<{ Params: ParamsIdType; Body: UpdateType }>,
    reply: FastifyReply
  ) => {
    // Ép kiểu để TypeScript không báo lỗi về unknown type
    const body = req.body as UpdateType;
    const data = await service.update(req.server, req.params.id, body);
    data ? reply.send(data) : reply.code(404).send({ message: 'Profile not found' });
  },

  del: async (
    req: FastifyRequest<{ Params: ParamsIdType }>,
    reply: FastifyReply
  ) => {
    const ok = await service.del(req.server, req.params.id);
    ok ? reply.send({ success: true }) : reply.code(404).send({ message: 'Profile not found' });
  }
};
