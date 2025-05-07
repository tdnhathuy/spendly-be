#!/usr/bin/env ts-node
import fs from "fs";
import path from "path";

/* ------------------ Lấy tên module ------------------ */
const [, , rawName] = process.argv;
if (!rawName) {
	console.error("❌  Thiếu tên module.\n   Ví dụ: ts-node generate-module.ts profile");
	process.exit(1);
}

const kebab = rawName.toLowerCase();
const pascal = kebab
	.split("-")
	.map((s) => s[0].toUpperCase() + s.slice(1))
	.join("");

/* --------------- Tạo thư mục module ----------------- */
const baseDir = path.join(process.cwd(), "src", "modules", kebab);
if (fs.existsSync(baseDir)) {
	console.error(`⚠️  Module "${kebab}" đã tồn tại. Hãy xoá hoặc đổi tên rồi chạy lại.`);
	process.exit(1);
}
fs.mkdirSync(baseDir, { recursive: true });
console.log(`📁  Đã tạo ${baseDir}`);

/* --------------- Viết các file ---------------------- */
for (const [file, content] of Object.entries(templates(kebab, pascal))) {
	fs.writeFileSync(path.join(baseDir, file), content.trimStart());
	console.log(`  ➜  ${file}`);
}

/* ==================================================== */
/*            Hàm sinh template cho từng file           */
/* ==================================================== */
function templates(kebab: string, pascal: string): Record<string, string> {
	const TAG = `"${pascal}"`; // tag cho swagger hoặc plugin docs
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
    const data = await service.getById(req.server, req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: '${pascal} not found' });
  },

  create: async (
    req: FastifyRequest<{ Body: CreateType }>,
    reply: FastifyReply
  ) => {
    // Ép kiểu để TypeScript không báo lỗi về unknown type
    const body = req.body as CreateType;
    reply.code(201).send(await service.create(req.server, body));
  },

  update: async (
    req: FastifyRequest<{ Params: ParamsIdType; Body: UpdateType }>,
    reply: FastifyReply
  ) => {
    // Ép kiểu để TypeScript không báo lỗi về unknown type
    const body = req.body as UpdateType;
    const data = await service.update(req.server, req.params.id, body);
    data ? reply.send(data) : reply.code(404).send({ message: '${pascal} not found' });
  },

  del: async (
    req: FastifyRequest<{ Params: ParamsIdType }>,
    reply: FastifyReply
  ) => {
    const ok = await service.del(req.server, req.params.id);
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

  getById: (f: FastifyInstance, id: string): Promise<${pascal}|null> =>
    model.findById(f, id),

  create : (f: FastifyInstance, d: ${pascal}Create): Promise<${pascal}> =>
    model.create(f, d),

  update : (f: FastifyInstance, id: string, d: ${pascal}Update): Promise<${pascal}|null> =>
    model.update(f, id, d),

  del    : (f: FastifyInstance, id: string): Promise<boolean> =>
    model.del(f, id)
};
`,

		/* ---------- schema.ts ---------- */
		"schema.ts": `
// ${kebab}/schema.ts
import { Type, Static } from '@sinclair/typebox';
import { Document, WithId } from 'mongodb';

export const ObjectIdStr = Type.String({ pattern: "^[0-9a-fA-F]{24}$" });

// Định nghĩa tất cả các trường có thể có trong ${pascal}
export const ${pascal}Fields = {
  _id: ObjectIdStr,
  name: Type.String(),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' })),
  // Thêm các trường mới ở đây, tất cả ở một nơi duy nhất
};

// Các trường tùy chọn, sẽ không bắt buộc trong schema CREATE
export const OptionalFields = ['createdAt', 'updatedAt'];
// Các trường tự động, sẽ không được yêu cầu trong schema CREATE
export const AutoFields = ['_id'];

// Tạo ${pascal} Schema từ các trường
const ${pascal} = Type.Object(${pascal}Fields);

// Xác định trường nào sẽ được yêu cầu khi tạo mới (trừ _id và các trường tự động/tùy chọn)
const createFields = Object.entries(${pascal}Fields)
  .filter(([key]) => !AutoFields.includes(key) && !OptionalFields.includes(key))
  .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export const ParamsId = Type.Object({ id: ObjectIdStr });
export const CreateReq = Type.Object(createFields);
export const UpdateReq = Type.Partial(CreateReq);

export type ${pascal}Type = Static<typeof ${pascal}>;
export type ParamsIdType = Static<typeof ParamsId>;
export type CreateType = Static<typeof CreateReq>;
export type UpdateType = Static<typeof UpdateReq>;

// Tạo hàm tiện ích để map document MongoDB sang kiểu dữ liệu TypeScript
export function createDocumentMapper<T extends Record<string, any>>(fieldsList: string[]) {
  return (doc: WithId<Document>): T => {
    const result: Record<string, any> = {};
    
    // Chuyển đổi _id thành chuỗi hex
    if (doc._id) {
      result._id = doc._id.toHexString();
    }
    
    // Sao chép tất cả các trường còn lại
    fieldsList.forEach(field => {
      if (field !== '_id' && field in doc) {
        result[field] = doc[field];
      }
    });
    
    return result as T;
  };
}

// Tạo hàm mapper cho ${pascal}
export const create${pascal}Mapper = () => 
  createDocumentMapper<${pascal}Type>(Object.keys(${pascal}Fields));

export default {
  getAll : { response: { 200: Type.Array(${pascal}) }, tags: [${TAG}] },

  getById: {
    params: ParamsId,
    response: { 200: ${pascal}, 404: error() },
    tags: [${TAG}]
  },

  create : {
    body: CreateReq,
    response: { 201: ${pascal} },
    tags: [${TAG}]
  },

  update : {
    params: ParamsId,
    body: UpdateReq,
    response: { 200: ${pascal}, 404: error() },
    tags: [${TAG}]
  },

  del: {
    params: ParamsId,
    response: { 200: Type.Object({ success: Type.Boolean() }), 404: error() },
    tags: [${TAG}]
  }
};

function error() { return Type.Object({ message: Type.String() }); }
`,

		/* ---------- model.ts ---------- */
		"model.ts": `
// ${kebab}/model.ts
import { FastifyInstance } from 'fastify';
import { Collection, ObjectId, WithId, Document } from 'mongodb';
import { ${pascal}Type, CreateType, UpdateType, create${pascal}Mapper } from './schema';

export type ${pascal} = ${pascal}Type;
export type ${pascal}Create = CreateType;
export type ${pascal}Update = UpdateType;

// Tạo mapper function từ schema
const map${pascal} = create${pascal}Mapper();

export default {
  async findAll(f: FastifyInstance): Promise<${pascal}[]> {
    const docs = await collection(f).find().toArray();
    return docs.map(map${pascal});
  },

  async findById(f: FastifyInstance, id: string): Promise<${pascal}|null> {
    const doc = await collection(f).findOne({ _id: new ObjectId(id) });
    return doc ? map${pascal}(doc) : null;
  },

  async create(f: FastifyInstance, data: ${pascal}Create): Promise<${pascal}> {
    const now = new Date().toISOString();
    const item = { ...data, createdAt: now, updatedAt: now };
    const res = await collection(f).insertOne(item);
    
    return map${pascal}({
      _id: res.insertedId,
      ...item
    } as WithId<Document>);
  },

  async update(f: FastifyInstance, id: string, data: ${pascal}Update): Promise<${pascal}|null> {
    const now = new Date().toISOString();
    const r = await collection(f).findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: now } },
      { returnDocument: 'after' }
    );
    return r ? map${pascal}(r) : null;
  },

  async del(f: FastifyInstance, id: string): Promise<boolean> {
    const res = await collection(f).deleteOne({ _id: new ObjectId(id) });
    return res.deletedCount === 1;
  }
};

function collection(f: FastifyInstance): Collection {
  if (!f.mongo?.db) throw new Error('MongoDB connection not ready');
  return f.mongo.db.collection('${kebab}');
}
`,
	};
}
