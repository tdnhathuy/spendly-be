// profile/service.ts
import { FastifyInstance } from 'fastify';
import model, { Profile, ProfileCreate, ProfileUpdate } from './model';

export default {
  getAll : (f: FastifyInstance): Promise<Profile[]> =>
    model.findAll(f),

  getById: (f: FastifyInstance, id: number): Promise<Profile|null> =>
    model.findById(f, id),

  create : (f: FastifyInstance, d: ProfileCreate): Promise<Profile> =>
    model.create(f, d),

  update : (f: FastifyInstance, id: number, d: ProfileUpdate): Promise<Profile|null> =>
    model.update(f, id, d),

  del    : (f: FastifyInstance, id: number): Promise<boolean> =>
    model.del(f, id)
};
