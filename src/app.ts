import autoload from "@fastify/autoload";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import path from "path";
import { makeDir } from "./helper/func.helper";

export async function buildApp() {
	const fastify = Fastify({
		logger: false,
	}).withTypeProvider<TypeBoxTypeProvider>();

	fastify.register(autoload, { dir: makeDir("plugins") });
	fastify.register(autoload, { dir: makeDir("modules") });

	fastify.get("/abc", (req, res) => {
		return res.send({
			message: "Hello World",
		});
	});

	return fastify;
}
