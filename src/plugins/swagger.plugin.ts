import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";
import { config } from "../config/config";

export const pluginSwagger = async (fastify: FastifyInstance) => {
	await fastify.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Spendly API",
				description: "API documentation for Spendly",
				version: "1.0.0",
			},
		},
	});

	await fastify.register(fastifySwaggerUi, {
		routePrefix: config.swagger.routePrefix,
		uiConfig: {
			docExpansion: "list",

		},
		transformSpecification: (swaggerObject) => swaggerObject,
		transformSpecificationClone: true,
		
	});

	return fastify;
};
