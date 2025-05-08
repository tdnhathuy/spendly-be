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
  console.log("Bắt đầu thiết lập app...");
  
  try {
    console.log("Đang thiết lập plugins...");
    await setupPlugins(instance);
    console.log("Thiết lập plugins hoàn tất");
  } catch (error) {
    console.error("Lỗi khi thiết lập plugins:", error);
  }

  // Định nghĩa các routes cơ bản
  instance.get("/", async (req: FastifyRequest, res: FastifyReply) => {
    return { message: "Hello World!" };
  });

  instance.get("/health", async (req: FastifyRequest, res: FastifyReply) => {
    return { status: "ok", timestamp: new Date() };
  });

  try {
    console.log("Đang đăng ký các modules từ thư mục:", path.join(__dirname, "modules"));
    await instance.register(autoload, {
      dir: path.join(__dirname, "modules"),
      options: { prefix: "/api" },
    });
    console.log("Đăng ký modules hoàn tất");
  } catch (error) {
    console.error("Lỗi khi đăng ký modules:", error);
  }

  try {
    console.log("Danh sách routes đã đăng ký:");
    console.log(instance.printRoutes());
  } catch (error) {
    console.error("Không thể in danh sách routes:", error);
  }
  
  console.log("Thiết lập app hoàn tất");
}

export default app;
