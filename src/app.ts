import autoload from "@fastify/autoload";
import { FastifyInstance, FastifyServerOptions } from "fastify";
import path from "path";
import { setupPlugins } from "./plugins";
import authRoutes from "./routes/auth.route";
import commonRoutes from "./routes/common.route";

async function app(instance: FastifyInstance, opts: FastifyServerOptions) {
  console.log("Bắt đầu thiết lập app...");

  await setupPlugins(instance);
  instance.register(authRoutes);
  instance.register(commonRoutes);

  await instance.register(autoload, {
    dir: path.join(__dirname, "modules"),
    options: { prefix: "/api" },
  });

  try {
    console.log(instance.printRoutes());
  } catch (error) {
    console.error("Không thể in danh sách routes:", error);
  }

  console.log("Thiết lập app hoàn tất");
}

export default app;
