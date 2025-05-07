// transaction/model.ts
import { FastifyInstance } from 'fastify';
import { Collection, Document, WithId } from 'mongodb';

export interface Transaction {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
export type TransactionCreate = Omit<Transaction, 'id'|'createdAt'|'updatedAt'>;
export type TransactionUpdate = Partial<TransactionCreate>;

export default {
  async findAll(f: FastifyInstance): Promise<Transaction[]> {
    return (await col(f).find().toArray()).map(map);
  },

  async findById(f: FastifyInstance, id: number): Promise<Transaction|null> {
    const doc = await col(f).findOne({ id });
    return doc ? map(doc) : null;
  },

  async create(f: FastifyInstance, data: TransactionCreate): Promise<Transaction> {
    const now = new Date().toISOString();
    const item: Transaction = { ...data, id: Date.now(), createdAt: now, updatedAt: now };
    await col(f).insertOne(item);
    return item;
  },

  async update(f: FastifyInstance, id: number, data: TransactionUpdate): Promise<Transaction|null> {
    const now = new Date().toISOString();
    const r = await col(f).findOneAndUpdate(
      { id },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return r ? map(r) : null;
  },

  async del(f: FastifyInstance, id: number): Promise<boolean> {
    const res = await col(f).deleteOne({ id });
    return res.deletedCount === 1;
  }
};

function col(f: FastifyInstance): Collection {
  if (!f.mongo?.db) throw new Error('MongoDB connection not ready');
  return f.mongo.db.collection('transaction');
}
function map(doc: WithId<Document>): Transaction {
  return {
    id: doc.id,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}
