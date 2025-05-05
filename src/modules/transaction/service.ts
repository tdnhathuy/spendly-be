// transaction/service.ts
import { FastifyInstance } from 'fastify';
import model from './model';
import { Transaction, TransactionCreate, TransactionUpdate } from './model';

export default {
  getAll: async (fastify: FastifyInstance): Promise<Transaction[]> => {
    return await model.findAll(fastify);
  },
  
  getById: async (fastify: FastifyInstance, id: number): Promise<Transaction | null> => {
    return await model.findById(fastify, id);
  },
  
  create: async (fastify: FastifyInstance, data: TransactionCreate): Promise<Transaction> => {
    return await model.create(fastify, data);
  },
  
  update: async (fastify: FastifyInstance, id: number, data: TransactionUpdate): Promise<Transaction | null> => {
    return await model.update(fastify, id, data);
  },
  
  delete: async (fastify: FastifyInstance, id: number): Promise<boolean> => {
    return await model.delete(fastify, id);
  }
};
