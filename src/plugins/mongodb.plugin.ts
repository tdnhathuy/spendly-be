import fastifyMongo from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { config } from "../config/config";

export const pluginMongodb = async (fastify: FastifyInstance) => {
	console.log("Bắt đầu kết nối MongoDB:", config.mongodb.url);
	try {
		const result = await fastify.register(fastifyMongo, {
			url: config.mongodb.url,
			database: config.mongodb.dbName,
			forceClose: true,
			connectTimeoutMS: 5000,
			serverSelectionTimeoutMS: 5000
		});
		console.log("Kết nối MongoDB thành công!");
		return result;
	} catch (error) {
		console.error("Lỗi kết nối MongoDB:", error);
		// Vẫn tiếp tục chạy ứng dụng thay vì treo
		return fastify;
	}
};
