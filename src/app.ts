import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import { registerMongoDB } from "./plugins/mongodb";
import { registerSwagger } from "./plugins/swagger";
import autoload from "@fastify/autoload";
import path from "path";

// Khởi tạo Fastify app
export async function buildApp() {
	const fastify = Fastify({
		logger: false,
		ajv: {
			customOptions: {
				strict: false, // Tắt strict mode để chấp nhận keywords như example
				allErrors: true,
			},
		},
	}).withTypeProvider<TypeBoxTypeProvider>();

	fastify.register(autoload, {
		dir: path.join(__dirname, "plugins"),
	});
	fastify.register(autoload, {
		dir: path.join(__dirname, "modules"),
	});

	return fastify;
}
