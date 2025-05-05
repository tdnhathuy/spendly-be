// transaction/controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import service from './service';
import { 
  ParamsWithIdType,
  CreateRequestType,
  UpdateRequestType
} from './schema';

export default {
  getAll: async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const data = await service.getAll(req.server);
    reply.send(data);
  },
  
  getById: async (
    req: FastifyRequest<{ Params: ParamsWithIdType }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const data = await service.getById(req.server, parseInt(id, 10));
    
    if (!data) {
      reply.code(404).send({ message: 'Transaction not found' });
      return;
    }
    
    reply.send(data);
  },
  
  create: async (
    req: FastifyRequest<{ Body: CreateRequestType }>,
    reply: FastifyReply
  ) => {
    const data = await service.create(req.server, req.body);
    reply.code(201).send(data);
  },
  
  update: async (
    req: FastifyRequest<{ Params: ParamsWithIdType, Body: UpdateRequestType }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const data = await service.update(req.server, parseInt(id, 10), req.body);
    
    if (!data) {
      reply.code(404).send({ message: 'Transaction not found' });
      return;
    }
    
    reply.send(data);
  },
  
  delete: async (
    req: FastifyRequest<{ Params: ParamsWithIdType }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const success = await service.delete(req.server, parseInt(id, 10));
    
    if (!success) {
      reply.code(404).send({ message: 'Transaction not found' });
      return;
    }
    
    reply.code(200).send({ success: true });
  }
};
