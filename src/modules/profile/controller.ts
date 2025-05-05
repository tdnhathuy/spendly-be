// profile/controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import service from './service';
import { GetResponseType } from './schema';

export default {
  get: async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const data: GetResponseType = await service.getAll();
    reply.send(data);
  },
};
