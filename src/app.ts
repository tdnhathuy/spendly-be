import autoload from "@fastify/autoload";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import { makeDir } from "./helper/func.helper";
import { setupPlugins } from "./plugins";

export async function buildApp() {
	const fastify = Fastify({
		logger: false,
	}).withTypeProvider<TypeBoxTypeProvider>();

	await setupPlugins(fastify);

	// Đăng ký modules sau khi plugins đã được đăng ký
	await fastify.register(autoload, {
		dir: makeDir("modules"),
		options: { prefix: "/api" },
	});

	return fastify;
}
