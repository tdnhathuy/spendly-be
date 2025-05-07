import { FastifyInstance } from "fastify";
import { pluginMongodb } from "./mongodb.plugin";
import { pluginSwagger } from "./swagger.plugin";

export const setupPlugins = async (fastify: FastifyInstance) => {
	await pluginMongodb(fastify);
	await pluginSwagger(fastify);
};
