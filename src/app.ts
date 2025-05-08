import autoload from "@fastify/autoload";
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyServerOptions,
} from "fastify";
import path from "path";
import { ControllerAuth } from "./modules/auth/auth.controller";
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
    return res.redirect("/login");
  });

  instance.get("/health", async (req: FastifyRequest, res: FastifyReply) => {
    return { status: "ok", timestamp: new Date() };
  });

  // Route cho Google OAuth
  instance.get("/api/auth/google", (request, reply) => {
    console.log("Bắt đầu luồng OAuth Google");
    return ControllerAuth.handleGoogleLogin(request, reply);
  });

  // Route callback cho OAuth Google (quan trọng: phải đúng với callback URL đã cấu hình)
  instance.get("/api/auth/google/callback", (request, reply) => {
    console.log(
      "Đã nhận request callback OAuth2 Google, params:",
      request.query
    );
    return ControllerAuth.googleLoginCallback(request, reply);
  });

  // Routes cho giao diện người dùng
  instance.get("/login", ControllerAuth.renderLoginPage);
  instance.get("/auth/success", ControllerAuth.renderSuccessPage);

  try {
    console.log(
      "Đang đăng ký các modules từ thư mục:",
      path.join(__dirname, "modules")
    );
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
