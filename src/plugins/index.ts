import { FastifyInstance } from "fastify";
import { pluginCors } from "./cors.plugin";
import { pluginJwt } from "./jwt.plugin";
import { pluginMongodb } from "./mongodb.plugin";
import { pluginSwagger } from "./swagger.plugin";

export const setupPlugins = async (fastify: FastifyInstance) => {
  try {
    await pluginMongodb(fastify);
    await pluginJwt(fastify);
    await pluginSwagger(fastify);
    await pluginCors(fastify);
  } catch (error) {
    console.error("Lỗi khi thiết lập plugins:", error);
  }
};
