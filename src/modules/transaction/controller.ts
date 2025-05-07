// transaction/controller.ts
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
    const data = await service.getById(req.server, +req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: 'Transaction not found' });
  },

  create: async (
    req: FastifyRequest<{ Body: CreateType }>,
    reply: FastifyReply
  ) => {
    reply.code(201).send(await service.create(req.server, req.body));
  },

  update: async (
    req: FastifyRequest<{ Params: ParamsIdType; Body: UpdateType }>,
    reply: FastifyReply
  ) => {
    const data = await service.update(req.server, +req.params.id, req.body);
    data ? reply.send(data) : reply.code(404).send({ message: 'Transaction not found' });
  },

  del: async (
    req: FastifyRequest<{ Params: ParamsIdType }>,
    reply: FastifyReply
  ) => {
    const ok = await service.del(req.server, +req.params.id);
    ok ? reply.send({ success: true }) : reply.code(404).send({ message: 'Transaction not found' });
  }
};
