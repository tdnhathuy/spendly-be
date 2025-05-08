import autoload from "@fastify/autoload";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import path from "path";
import { setupPlugins } from "./plugins";

async function app(instance: FastifyInstance, opts: FastifyServerOptions) {
  await setupPlugins(instance);

  instance.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    res.status(200).send({
      message: "hello World",
    });
  });

  instance.register(autoload, {
    dir: path.join(__dirname, "modules"),
    options: { prefix: "/api" },
  });
}

export default app;
