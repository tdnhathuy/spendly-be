// transaction/controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { ServiceTransaction } from "./transaction.service";
import { TransactionCreate, TransactionUpdate } from "./transaction.schema";

export default {
  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    return ServiceTransaction.getAll(req.server);
  },

  getById: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const data = await ServiceTransaction.getById(req.server, req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: "Transaction not found" });
  },

  create: async (req: FastifyRequest<{ Body: TransactionCreate }>, reply: FastifyReply) => {
    reply.code(201).send(await ServiceTransaction.create(req.server, req.body));
  },

  update: async (req: FastifyRequest<{ Params: { id: string }; Body: TransactionUpdate }>, reply: FastifyReply) => {
    const data = await ServiceTransaction.update(req.server, req.params.id, req.body);
    data ? reply.send(data) : reply.code(404).send({ message: "Transaction not found" });
  },

  delete: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const data = await ServiceTransaction.delete(req.server, req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: "Transaction not found" });
  },
};
