import path from "path";
import { FastifyInstance } from "fastify";

export const makeDir = (dir: string) => {
	return path.join(__dirname, "..", dir);
};

export const getMongoDB = (server: FastifyInstance) => {
	if (!server.mongo?.db) throw new Error("MongoDB không sẵn sàng");
	return server.mongo.db;
};
