#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";

/* -------------------- Nhận tên module -------------------- */
const [, , rawName] = process.argv;
if (!rawName) {
	console.error("❌  Thiếu tên module.\n   Ví dụ: ts-node generate-module.ts products");
	process.exit(1);
}

const kebab = rawName.toLowerCase();
const pascal = kebab
	.split("-")
	.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
	.join("");

/* -------------------- Tạo thư mục -------------------- */
const baseDir = path.join(process.cwd(), "src", "modules", kebab);
if (fs.existsSync(baseDir)) {
	console.error(`⚠️  Module "${kebab}" đã tồn tại. Hãy xoá hoặc đổi tên rồi chạy lại.`);
	process.exit(1);
}
fs.mkdirSync(baseDir, { recursive: true });
console.log(`📁  Đã tạo ${baseDir}`);

/* -------------------- Ghi file -------------------- */
Object.entries(templates(kebab, pascal)).forEach(([file, content]) => {
	fs.writeFileSync(path.join(baseDir, file), content.trimStart());
	console.log(`  ➜  ${file}`);
});

/* ======================================================== */
/*              Hàm tạo template cho từng file              */
/* ======================================================== */
function templates(kebab: string, pascal: string): Record<string, string> {
	return {
		/* ---------- routes.ts ---------- */
		"routes.ts": `
// ${kebab}/routes.ts
import { FastifyInstance } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import controller from './controller';
import schema from './schema';

export default async function ${kebab}Routes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();

  server.get('/',      { schema: schema.getAll },  controller.getAll);
  server.get('/:id',   { schema: schema.getById }, controller.getById);
  server.post('/',     { schema: schema.create },  controller.create);
  server.put('/:id',   { schema: schema.update },  controller.update);
  server.delete('/:id',{ schema: schema.del },     controller.del);
}
`,

		/* ---------- controller.ts ---------- */
		"controller.ts": `
// ${kebab}/controller.ts
import { FastifyReply, FastifyRequest } from 'fastify';
import service from './service';
import { ParamsIdType, CreateType, UpdateType } from './schema';

export default {
  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    reply.send(await service.getAll(req.server));
  },

  getById: async (
    req: FastifyRequest<{ Params: ParamsIdType }>,
    reply: FastifyReply
  ) => {
    const data = await service.getById(req.server, +req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: '${pascal} not found' });
  },

  create: async (
    req: FastifyRequest<{ Body: CreateType }>,
    reply: FastifyReply
  ) => {
    reply.code(201).send(await service.create(req.server, req.body));
  },

  update: async (
    req: FastifyRequest<{ Params: ParamsIdType; Body: UpdateType }>,
    reply: FastifyReply
  ) => {
    const data = await service.update(req.server, +req.params.id, req.body);
    data ? reply.send(data) : reply.code(404).send({ message: '${pascal} not found' });
  },

  del: async (
    req: FastifyRequest<{ Params: ParamsIdType }>,
    reply: FastifyReply
  ) => {
    const ok = await service.del(req.server, +req.params.id);
    ok ? reply.send({ success: true }) : reply.code(404).send({ message: '${pascal} not found' });
  }
};
`,

		/* ---------- service.ts ---------- */
		"service.ts": `
// ${kebab}/service.ts
import { FastifyInstance } from 'fastify';
import model, { ${pascal}, ${pascal}Create, ${pascal}Update } from './model';

export default {
  getAll : (f: FastifyInstance): Promise<${pascal}[]> =>
    model.findAll(f),

  getById: (f: FastifyInstance, id: number): Promise<${pascal}|null> =>
    model.findById(f, id),

  create : (f: FastifyInstance, d: ${pascal}Create): Promise<${pascal}> =>
    model.create(f, d),

  update : (f: FastifyInstance, id: number, d: ${pascal}Update): Promise<${pascal}|null> =>
    model.update(f, id, d),

  del    : (f: FastifyInstance, id: number): Promise<boolean> =>
    model.del(f, id)
};
`,

		/* ---------- schema.ts ---------- */
		"schema.ts": `
// ${kebab}/schema.ts
import { Type, Static } from '@sinclair/typebox';

const ${pascal} = Type.Object({
  id:        Type.Number(),
  name:      Type.String(),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
});

export const ParamsId  = Type.Object({ id: Type.String() });
export const CreateReq = Type.Omit(${pascal}, ['id', 'createdAt', 'updatedAt']);
export const UpdateReq = Type.Partial(CreateReq);

export type ParamsIdType = Static<typeof ParamsId>;
export type CreateType   = Static<typeof CreateReq>;
export type UpdateType   = Static<typeof UpdateReq>;

export default {
  getAll : { response: { 200: Type.Array(${pascal}) }, tags: ["${pascal}"] },

  getById: {
    tags: ["${pascal}"],
    params: ParamsId,
    response: { 200: ${pascal}, 404: err() }
  },

  create : {
    tags: ["${pascal}"],
    body: CreateReq,
    response: { 201: ${pascal} }
  },

  update : {
    tags: ["${pascal}"],
    params: ParamsId,
    body: UpdateReq,
    response: { 200: ${pascal}, 404: err() }
  },

  del: {
    tags: ["${pascal}"],
    params: ParamsId,
    response: { 200: Type.Object({ success: Type.Boolean() }), 404: err() }
  }
};

function err() { return Type.Object({ message: Type.String() }); }
`,

		/* ---------- model.ts ---------- */
		"model.ts": `
// ${kebab}/model.ts
import { FastifyInstance } from 'fastify';
import { Collection, Document, WithId } from 'mongodb';

export interface ${pascal} {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}
export type ${pascal}Create = Omit<${pascal}, 'id'|'createdAt'|'updatedAt'>;
export type ${pascal}Update = Partial<${pascal}Create>;

export default {
  async findAll(f: FastifyInstance): Promise<${pascal}[]> {
    return (await col(f).find().toArray()).map(map);
  },

  async findById(f: FastifyInstance, id: number): Promise<${pascal}|null> {
    const doc = await col(f).findOne({ id });
    return doc ? map(doc) : null;
  },

  async create(f: FastifyInstance, data: ${pascal}Create): Promise<${pascal}> {
    const now = new Date().toISOString();
    const item: ${pascal} = { ...data, id: Date.now(), createdAt: now, updatedAt: now };
    await col(f).insertOne(item);
    return item;
  },

  async update(f: FastifyInstance, id: number, data: ${pascal}Update): Promise<${pascal}|null> {
    const now = new Date().toISOString();
    const r = await col(f).findOneAndUpdate(
      { id },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return r ? map(r) : null;
  },

  async del(f: FastifyInstance, id: number): Promise<boolean> {
    const res = await col(f).deleteOne({ id });
    return res.deletedCount === 1;
  }
};

function col(f: FastifyInstance): Collection {
  if (!f.mongo?.db) throw new Error('MongoDB connection not ready');
  return f.mongo.db.collection('${kebab}');
}
function map(doc: WithId<Document>): ${pascal} {
  return {
    id: doc.id,
    name: doc.name,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
}
`,
	};
}
