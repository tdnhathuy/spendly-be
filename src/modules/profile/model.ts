// profile/model.ts
import { FastifyInstance } from 'fastify';
import { Collection, ObjectId, WithId, Document } from 'mongodb';
import { ProfileType, CreateType, UpdateType, createProfileMapper } from './schema';

export type Profile = ProfileType;
export type ProfileCreate = CreateType;
export type ProfileUpdate = UpdateType;

// Tạo mapper function từ schema
const mapProfile = createProfileMapper();

export default {
  async findAll(f: FastifyInstance): Promise<Profile[]> {
    const docs = await collection(f).find().toArray();
    return docs.map(mapProfile);
  },

  async findById(f: FastifyInstance, id: string): Promise<Profile|null> {
    const doc = await collection(f).findOne({ _id: new ObjectId(id) });
    return doc ? mapProfile(doc) : null;
  },

  async create(f: FastifyInstance, data: ProfileCreate): Promise<Profile> {
    const now = new Date().toISOString();
    const item = { ...data, createdAt: now, updatedAt: now };
    const res = await collection(f).insertOne(item);
    
    return mapProfile({
      _id: res.insertedId,
      ...item
    } as WithId<Document>);
  },

  async update(f: FastifyInstance, id: string, data: ProfileUpdate): Promise<Profile|null> {
    const now = new Date().toISOString();
    const r = await collection(f).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return r ? mapProfile(r) : null;
  },

  async del(f: FastifyInstance, id: string): Promise<boolean> {
    const res = await collection(f).deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount === 1;
  }
};

function collection(f: FastifyInstance): Collection {
  if (!f.mongo?.db) throw new Error('MongoDB connection not ready');
  return f.mongo.db.collection('profile');
}
