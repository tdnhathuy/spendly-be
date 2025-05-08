import autoload from "@fastify/autoload";
import { FastifyInstance, FastifyReply, FastifyServerOptions } from "fastify";
import path from "path";
import { setupPlugins } from "./plugins";

async function app(instance: FastifyInstance, opts: FastifyServerOptions) {
  console.log("Bắt đầu thiết lập app...");

  await setupPlugins(instance);

  instance.get(
    "/",
    { schema: { tags: ["Common"] } },
    async (_, res: FastifyReply) => {
      return res.redirect("/login");
    }
  );

  instance.get("/health", { schema: { tags: ["Common"] } }, async () => {
    return { status: "ok", timestamp: new Date() };
  });

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
    console.log(instance.printRoutes());
  } catch (error) {
    console.error("Không thể in danh sách routes:", error);
  }

  console.log("Thiết lập app hoàn tất");
}

export default app;
