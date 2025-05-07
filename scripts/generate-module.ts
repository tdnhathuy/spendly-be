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
		[`${kebab}.route.ts`]: `
// ${kebab}/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import controller from "./${kebab}.controller";

export default async function ${kebab}Routes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();

  server.get("/", {}, controller.getAll);
  server.get("/:id", {}, controller.getById);
  server.post("/", {}, controller.create);
  server.put("/:id", {}, controller.update);
  server.delete("/:id", {}, controller.delete);
}
`,

		/* ---------- controller.ts ---------- */
		[`${kebab}.controller.ts`]: `
// ${kebab}/controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { Service${pascal} } from "./${kebab}.service";
import { ${pascal}Create, ${pascal}Update } from "./${kebab}.schema";

export default {
  getAll: async (req: FastifyRequest, reply: FastifyReply) => {
    return Service${pascal}.getAll(req.server);
  },

  getById: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const data = await Service${pascal}.getById(req.server, req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: "${pascal} not found" });
  },

  create: async (req: FastifyRequest<{ Body: ${pascal}Create }>, reply: FastifyReply) => {
    reply.code(201).send(await Service${pascal}.create(req.server, req.body));
  },

  update: async (req: FastifyRequest<{ Params: { id: string }; Body: ${pascal}Update }>, reply: FastifyReply) => {
    const data = await Service${pascal}.update(req.server, req.params.id, req.body);
    data ? reply.send(data) : reply.code(404).send({ message: "${pascal} not found" });
  },

  delete: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const data = await Service${pascal}.delete(req.server, req.params.id);
    data ? reply.send(data) : reply.code(404).send({ message: "${pascal} not found" });
  },
};
`,

		/* ---------- service.ts ---------- */
		[`${kebab}.service.ts`]: `
// ${kebab}/service.ts
import { FastifyInstance } from "fastify";
import {
  findAllDocuments,
  findDocumentById,
  insertDocument,
  updateDocument,
  deleteDocumentById,
} from "../../helper/db.helper";

const COLLECTION_NAME = "${kebab}";

export const Service${pascal} = {
  getAll: async (server: FastifyInstance) => {
    return await findAllDocuments(server, COLLECTION_NAME);
  },

  getById: async (server: FastifyInstance, id: string) => {
    return await findDocumentById(server, COLLECTION_NAME, id);
  },

  create: async (server: FastifyInstance, body: any) => {
    // Thêm các trường mặc định nếu cần
    const data = { ...body };
    return await insertDocument(server, COLLECTION_NAME, data);
  },

  update: async (server: FastifyInstance, id: string, body: any) => {
    return await updateDocument(server, COLLECTION_NAME, id, body);
  },

  delete: async (server: FastifyInstance, id: string) => {
    return await deleteDocumentById(server, COLLECTION_NAME, id);
  },
};
`,

		/* ---------- schema.ts ---------- */
		[`${kebab}.schema.ts`]: `
// ${kebab}/schema.ts
import { Static, Type } from "@sinclair/typebox";

export const Schema${pascal} = Type.Object({
  _id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
  name: Type.String(),
  // Thêm các trường khác ở đây
});

export type ${pascal} = Static<typeof Schema${pascal}>;
export type ${pascal}Create = Omit<${pascal}, "_id" | "createdAt" | "updatedAt">;
export type ${pascal}Update = Partial<Omit<${pascal}, "_id">>;
`,
	};
}
