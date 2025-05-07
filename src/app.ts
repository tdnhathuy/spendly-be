import autoload from "@fastify/autoload";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import { makeDir } from "./helper/func.helper";
import { setupPlugins } from "./plugins";

export async function buildApp() {
	const fastify = Fastify({
		logger: process.env.NODE_ENV !== 'production',
		disableRequestLogging: process.env.NODE_ENV === 'production',
		trustProxy: true
	}).withTypeProvider<TypeBoxTypeProvider>();

	await setupPlugins(fastify);

	// Đăng ký modules sau khi plugins đã được đăng ký
	await fastify.register(autoload, {
		dir: makeDir("modules"),
		options: { prefix: "/api" },
	});

	// Thêm route mặc định để kiểm tra server
	fastify.get('/', async () => {
		return { status: 'ok', message: 'Server is running' };
	});

	return fastify;
}
