import fastifyMongo from "@fastify/mongodb";
import { FastifyPluginAsync } from "fastify";
import { config } from "../config/config";

const mongodbPlugin: FastifyPluginAsync = async (fastify) => {
	await fastify.register(fastifyMongo, {
		url: config.mongodb.url,
		database: config.mongodb.dbName,
		forceClose: true,
	});
};

export default mongodbPlugin;
