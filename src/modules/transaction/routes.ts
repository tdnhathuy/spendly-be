// transaction/routes.ts
import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import controller from './controller';
import schema from './schema';

export default async function transactionRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();

  server.get('/',      { schema: schema.getAll },  controller.getAll);
  server.get('/:id',   { schema: schema.getById }, controller.getById);
  server.post('/',     { schema: schema.create },  controller.create);
  server.put('/:id',   { schema: schema.update },  controller.update);
  server.delete('/:id',{ schema: schema.del },     controller.del);
}
