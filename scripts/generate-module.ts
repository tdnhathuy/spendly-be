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
import { TypeBoxTypeProvider } from 'fastify-type-provider-json-schema-to-ts';
import controller from './controller';
import schema from './schema';

export default async function ${moduleName}Routes(fastify: FastifyInstance) {
  fastify.withTypeProvider<TypeBoxTypeProvider>().get('/', {
    schema: schema.get,
  }, controller.get);
}
`,

	"controller.ts": `// ${moduleName}/controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import service from './service';
import { GetResponseType } from './schema';

export default {
  get: async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    const data: GetResponseType = await service.getAll();
    reply.send(data);
  },
};
`,

	"service.ts": `// ${moduleName}/service.ts
import model from './model';

export default {
  getAll: async () => {
    return await model.findAll();
  },
};
`,

	"schema.ts": `// ${moduleName}/schema.ts
import { Type } from '@sinclair/typebox';
import { Static } from '@sinclair/typebox';

export const GetResponse = Type.Array(Type.Object({
  id: Type.Number(),
  name: Type.String(),
}));

export type GetResponseType = Static<typeof GetResponse>;

export default {
  get: {
    response: {
      200: GetResponse,
    },
  },
};
`,

	"model.ts": `// ${moduleName}/model.ts
export interface ${capitalized} {
  id: number;
  name: string;
}

export default {
  findAll: async (): Promise<${capitalized}[]> => {
    return [{ id: 1, name: '${capitalized} example' }];
  },
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
