// profile/model.ts
import { FastifyInstance } from 'fastify';
import { Collection, Document, WithId } from 'mongodb';

export interface Profile {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProfileCreate = Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>;
export type ProfileUpdate = Partial<ProfileCreate>;

export default {
  findAll: async (fastify: FastifyInstance): Promise<Profile[]> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('profile');
    const result = await collection.find({}).toArray();
    
    // Transform MongoDB documents to our application type
    return result.map((doc: WithId<Document>) => ({
      id: doc.id || 0,
      name: doc.name || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    })) as Profile[];
  },
  
  findById: async (fastify: FastifyInstance, id: number): Promise<Profile | null> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('profile');
    const doc = await collection.findOne({ id });
    
    if (!doc) return null;
    
    // Transform MongoDB document to our application type
    return {
      id: doc.id || 0,
      name: doc.name || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    } as Profile;
  },
  
  create: async (fastify: FastifyInstance, data: ProfileCreate): Promise<Profile> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('profile');
    const now = new Date().toISOString();
    const newItem: Profile = { 
      ...data, 
      id: Date.now(), 
      createdAt: now,
      updatedAt: now
    };
    
    await collection.insertOne(newItem);
    return newItem;
  },
  
  update: async (fastify: FastifyInstance, id: number, data: ProfileUpdate): Promise<Profile | null> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('profile');
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
    } as Profile;
  },
  
  delete: async (fastify: FastifyInstance, id: number): Promise<boolean> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('profile');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
};
