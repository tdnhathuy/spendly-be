#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";

const moduleName = process.argv[2];

if (!moduleName) {
	console.error("❌ Please provide a module name.\nUsage: ts-node generate-module.ts <module-name>");
	process.exit(1);
}

const baseDir = path.join(__dirname, "..", "src", "modules", moduleName);
const capitalized = capitalize(moduleName);

const files: Record<string, string> = {
	"routes.ts": `// ${moduleName}/routes.ts
import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import controller from './controller';
import schema from './schema';

export default async function ${moduleName}Routes(fastify: FastifyInstance) {
  const server = fastify.withTypeProvider<TypeBoxTypeProvider>();
  
  server.get('/', {
    schema: schema.getAll
  }, controller.getAll);
  
  server.get('/:id', {
    schema: schema.getById
  }, controller.getById);
  
  server.post('/', {
    schema: schema.create
  }, controller.create);
  
  server.put('/:id', {
    schema: schema.update
  }, controller.update);
  
  server.delete('/:id', {
    schema: schema.delete
  }, controller.delete);
}
`,

	"controller.ts": `// ${moduleName}/controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import service from './service';
import { 
  ParamsWithIdType,
  CreateRequestType,
  UpdateRequestType
} from './schema';

export default {
  getAll: async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const data = await service.getAll(req.server);
    reply.send(data);
  },
  
  getById: async (
    req: FastifyRequest<{ Params: ParamsWithIdType }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const data = await service.getById(req.server, parseInt(id, 10));
    
    if (!data) {
      reply.code(404).send({ message: '${capitalized} not found' });
      return;
    }
    
    reply.send(data);
  },
  
  create: async (
    req: FastifyRequest<{ Body: CreateRequestType }>,
    reply: FastifyReply
  ) => {
    const data = await service.create(req.server, req.body);
    reply.code(201).send(data);
  },
  
  update: async (
    req: FastifyRequest<{ Params: ParamsWithIdType, Body: UpdateRequestType }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const data = await service.update(req.server, parseInt(id, 10), req.body);
    
    if (!data) {
      reply.code(404).send({ message: '${capitalized} not found' });
      return;
    }
    
    reply.send(data);
  },
  
  delete: async (
    req: FastifyRequest<{ Params: ParamsWithIdType }>,
    reply: FastifyReply
  ) => {
    const { id } = req.params;
    const success = await service.delete(req.server, parseInt(id, 10));
    
    if (!success) {
      reply.code(404).send({ message: '${capitalized} not found' });
      return;
    }
    
    reply.code(200).send({ success: true });
  }
};
`,

	"service.ts": `// ${moduleName}/service.ts
import { FastifyInstance } from 'fastify';
import model from './model';
import { ${capitalized}, ${capitalized}Create, ${capitalized}Update } from './model';

export default {
  getAll: async (fastify: FastifyInstance): Promise<${capitalized}[]> => {
    return await model.findAll(fastify);
  },
  
  getById: async (fastify: FastifyInstance, id: number): Promise<${capitalized} | null> => {
    return await model.findById(fastify, id);
  },
  
  create: async (fastify: FastifyInstance, data: ${capitalized}Create): Promise<${capitalized}> => {
    return await model.create(fastify, data);
  },
  
  update: async (fastify: FastifyInstance, id: number, data: ${capitalized}Update): Promise<${capitalized} | null> => {
    return await model.update(fastify, id, data);
  },
  
  delete: async (fastify: FastifyInstance, id: number): Promise<boolean> => {
    return await model.delete(fastify, id);
  }
};
`,

	"schema.ts": `// ${moduleName}/schema.ts
import { Type } from '@sinclair/typebox';
import { Static } from '@sinclair/typebox';

const ${capitalized}Type = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
});

export const ParamsWithId = Type.Object({
  id: Type.String()
});

export const GetAllResponse = Type.Array(${capitalized}Type);

export const GetByIdResponse = ${capitalized}Type;

export const CreateRequest = Type.Object({
  name: Type.String()
});

export const CreateResponse = ${capitalized}Type;

export const UpdateRequest = Type.Object({
  name: Type.String()
});

export const UpdateResponse = ${capitalized}Type;

export const DeleteResponse = Type.Object({
  success: Type.Boolean()
});

export type ParamsWithIdType = Static<typeof ParamsWithId>;
export type GetAllResponseType = Static<typeof GetAllResponse>;
export type GetByIdResponseType = Static<typeof GetByIdResponse>;
export type CreateRequestType = Static<typeof CreateRequest>;
export type CreateResponseType = Static<typeof CreateResponse>;
export type UpdateRequestType = Static<typeof UpdateRequest>;
export type UpdateResponseType = Static<typeof UpdateResponse>;
export type DeleteResponseType = Static<typeof DeleteResponse>;

export default {
  getAll: {
    response: {
      200: GetAllResponse
    }
  },
  
  getById: {
    params: ParamsWithId,
    response: {
      200: GetByIdResponse,
      404: Type.Object({
        message: Type.String()
      })
    }
  },
  
  create: {
    body: CreateRequest,
    response: {
      201: CreateResponse
    }
  },
  
  update: {
    params: ParamsWithId,
    body: UpdateRequest,
    response: {
      200: UpdateResponse,
      404: Type.Object({
        message: Type.String()
      })
    }
  },
  
  delete: {
    params: ParamsWithId,
    response: {
      200: DeleteResponse,
      404: Type.Object({
        message: Type.String()
      })
    }
  }
};
`,

	"model.ts": `// ${moduleName}/model.ts
import { FastifyInstance } from 'fastify';
import { Collection, Document, WithId } from 'mongodb';

export interface ${capitalized} {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ${capitalized}Create = Omit<${capitalized}, 'id' | 'createdAt' | 'updatedAt'>;
export type ${capitalized}Update = Partial<${capitalized}Create>;

export default {
  findAll: async (fastify: FastifyInstance): Promise<${capitalized}[]> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('${moduleName}');
    const result = await collection.find({}).toArray();
    
    // Transform MongoDB documents to our application type
    return result.map((doc: WithId<Document>) => ({
      id: doc.id || 0,
      name: doc.name || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    })) as ${capitalized}[];
  },
  
  findById: async (fastify: FastifyInstance, id: number): Promise<${capitalized} | null> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('${moduleName}');
    const doc = await collection.findOne({ id });
    
    if (!doc) return null;
    
    // Transform MongoDB document to our application type
    return {
      id: doc.id || 0,
      name: doc.name || '',
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    } as ${capitalized};
  },
  
  create: async (fastify: FastifyInstance, data: ${capitalized}Create): Promise<${capitalized}> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('${moduleName}');
    const now = new Date().toISOString();
    const newItem: ${capitalized} = { 
      ...data, 
      id: Date.now(), 
      createdAt: now,
      updatedAt: now
    };
    
    await collection.insertOne(newItem);
    return newItem;
  },
  
  update: async (fastify: FastifyInstance, id: number, data: ${capitalized}Update): Promise<${capitalized} | null> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('${moduleName}');
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
    } as ${capitalized};
  },
  
  delete: async (fastify: FastifyInstance, id: number): Promise<boolean> => {
    if (!fastify.mongo?.db) throw new Error('MongoDB connection not available');
    
    const collection: Collection = fastify.mongo.db.collection('${moduleName}');
    const result = await collection.deleteOne({ id });
    return result.deletedCount > 0;
  }
};
`,
};

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

if (!fs.existsSync(baseDir)) {
	fs.mkdirSync(baseDir, { recursive: true });
	console.log(`📁 Created: ${baseDir}`);
}

for (const [fileName, content] of Object.entries(files)) {
	const filePath = path.join(baseDir, fileName);
	if (!fs.existsSync(filePath)) {
		fs.writeFileSync(filePath, content);
		console.log(`✅ Created: ${filePath}`);
	} else {
		console.warn(`⚠️ Already exists: ${filePath}`);
	}
}
