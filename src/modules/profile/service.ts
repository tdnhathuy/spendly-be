// profile/service.ts
import { FastifyInstance } from 'fastify';
import model from './model';
import { Profile, ProfileCreate, ProfileUpdate } from './model';

export default {
  getAll: async (fastify: FastifyInstance): Promise<Profile[]> => {
    return await model.findAll(fastify);
  },
  
  getById: async (fastify: FastifyInstance, id: number): Promise<Profile | null> => {
    return await model.findById(fastify, id);
  },
  
  create: async (fastify: FastifyInstance, data: ProfileCreate): Promise<Profile> => {
    return await model.create(fastify, data);
  },
  
  update: async (fastify: FastifyInstance, id: number, data: ProfileUpdate): Promise<Profile | null> => {
    return await model.update(fastify, id, data);
  },
  
  delete: async (fastify: FastifyInstance, id: number): Promise<boolean> => {
    return await model.delete(fastify, id);
  }
};
