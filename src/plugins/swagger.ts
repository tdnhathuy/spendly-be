import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyPluginAsync } from "fastify";
import { config } from "../config/config";

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
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
			docExpansion: "none",
		},
		transformSpecification: (swaggerObject) => swaggerObject,
		transformSpecificationClone: true,
	});
};

export default swaggerPlugin;
