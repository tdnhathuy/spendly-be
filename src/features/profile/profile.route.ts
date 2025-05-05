import { FastifyInstance } from 'fastify';
import { ProfileController } from './profile.controller';
import { schemaProfile, schemaProfileCreate } from './profile.scheme';

export function registerProfileRoutes(fastify: FastifyInstance) {
	const controller = new ProfileController(fastify);
	const { getProfile, createProfile } = controller;

	fastify.get('/profile', { schema: schemaProfile }, getProfile);
	fastify.post('/profile/create', { schema: schemaProfileCreate }, createProfile);
}
