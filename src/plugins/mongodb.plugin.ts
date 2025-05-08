import fastifyMongo from "@fastify/mongodb";
import { FastifyInstance } from "fastify";
import { config } from "../config/config";

export const pluginMongodb = async (fastify: FastifyInstance) => {
	return await fastify.register(fastifyMongo, {
		url: config.mongodb.url,
		database: config.mongodb.dbName,
		forceClose: true,
	});
};
