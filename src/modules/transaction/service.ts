// transaction/service.ts
import { FastifyInstance } from 'fastify';
import model, { Transaction, TransactionCreate, TransactionUpdate } from './model';

export default {
  getAll : (f: FastifyInstance): Promise<Transaction[]> =>
    model.findAll(f),

  getById: (f: FastifyInstance, id: number): Promise<Transaction|null> =>
    model.findById(f, id),

  create : (f: FastifyInstance, d: TransactionCreate): Promise<Transaction> =>
    model.create(f, d),

  update : (f: FastifyInstance, id: number, d: TransactionUpdate): Promise<Transaction|null> =>
    model.update(f, id, d),

  del    : (f: FastifyInstance, id: number): Promise<boolean> =>
    model.del(f, id)
};
