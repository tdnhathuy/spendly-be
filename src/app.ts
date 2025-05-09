import autoload from "@fastify/autoload";
import { FastifyInstance, FastifyServerOptions } from "fastify";
import path from "path";
import { setupPlugins } from "./plugins";

async function app(instance: FastifyInstance, opts: FastifyServerOptions) {
  await setupPlugins(instance);

  await instance.register(autoload, {
    dir: path.join(__dirname, "routes"),
  });

  await instance.register(
    async (apiInstance) => {
      apiInstance.addHook("onRequest", instance.authenticate);

      await apiInstance.register(autoload, {
        dir: path.join(__dirname, "modules"),
      });
    },

    { prefix: "/api" }
  );

  console.log(instance.printRoutes());
}

export default app;
