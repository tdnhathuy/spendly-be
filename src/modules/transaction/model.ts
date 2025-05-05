// transaction/model.ts
import { FastifyInstance } from 'fastify';
import { Collection, Document, WithId } from 'mongodb';

export interface Transaction {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TransactionCreate = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
export type TransactionUpdate = Partial<TransactionCreate>;

export default {
  findAll: async (fastify: FastifyInstance): Promise<Transaction[]> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('transaction');
    const result = await collection.find({}).toArray();
    
    // Transform MongoDB documents to our application type
    return result.map((doc: WithId<Document>) => ({
      id: doc.id || 0,
      name: doc.name || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    })) as Transaction[];
  },
  
  findById: async (fastify: FastifyInstance, id: number): Promise<Transaction | null> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('transaction');
    const doc = await collection.findOne({ id });
    
    if (!doc) return null;
    
    // Transform MongoDB document to our application type
    return {
      id: doc.id || 0,
      name: doc.name || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    } as Transaction;
  },
  
  create: async (fastify: FastifyInstance, data: TransactionCreate): Promise<Transaction> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('transaction');
    const now = new Date().toISOString();
    const newItem: Transaction = { 
      ...data, 
      id: Date.now(), 
      createdAt: now,
      updatedAt: now
    };
    
    await collection.insertOne(newItem);
    return newItem;
  },
  
  update: async (fastify: FastifyInstance, id: number, data: TransactionUpdate): Promise<Transaction | null> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('transaction');
    const now = new Date().toISOString();
    const updateData = {
      ...data,
      updatedAt: now
    };
    
    const result = await collection.findOneAndUpdate(
      { id }, 
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) return null;
    
    // Transform MongoDB document to our application type
    return {
      id: result.id || 0,
      name: result.name || '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    } as Transaction;
  },
  
  delete: async (fastify: FastifyInstance, id: number): Promise<boolean> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('transaction');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
};
