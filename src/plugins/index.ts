import { FastifyInstance } from "fastify";
import { pluginMongodb } from "./mongodb.plugin";
import { pluginSwagger } from "./swagger.plugin";
import { pluginJwt } from "./jwt.plugin";
import { pluginCookie } from "./cookie.plugin";
// Không cần plugin session và oauth2 nữa

export const setupPlugins = async (fastify: FastifyInstance) => {
  try {
    console.log("Đang thiết lập plugins...");
    await pluginMongodb(fastify);
    await pluginCookie(fastify);
    await pluginJwt(fastify);
    await pluginSwagger(fastify);
    console.log("Thiết lập plugins hoàn tất");
  } catch (error) {
    console.error("Lỗi khi thiết lập plugins:", error);
  }
};
