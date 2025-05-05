import { buildApp } from "./app";
import { config } from "./config/config";

const start = async () => {
	try {
		const fastify = await buildApp();
		await fastify.listen({
			port: config.server.port,
			host: config.server.host,
		});
		console.log(`Server đang chạy tại http://localhost:${config.server.port}`);
		console.log(`Docs API tại: http://localhost:${config.server.port}${config.swagger.routePrefix}`);

		console.log(
			fastify.printRoutes({
				// includeHooks: true, // show hooks
				// commonPrefix: false, // disable tree grouping
			})
		);
		// console.log(fastify.printPlugins());
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();
