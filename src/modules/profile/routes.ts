// profile/routes.ts
import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from 'fastify-type-provider-json-schema-to-ts';
import controller from './controller';
import schema from './schema';

export default async function profileRoutes(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get('/', {
    schema: schema.get,
  }, controller.get);
}
