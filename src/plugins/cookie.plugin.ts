import { FastifyInstance } from "fastify";
import fastifyCookie from "@fastify/cookie";
import { config } from "../config/config";

export const pluginCookie = async (fastify: FastifyInstance) => {
  try {
    await fastify.register(fastifyCookie, {
      secret: config.auth.jwtSecret,
      hook: 'onRequest',
      parseOptions: {
        httpOnly: true,
        secure: config.auth.cookieSecure,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7 ngày
      }
    });

    console.log("Cookie plugin đã được thiết lập thành công");
    return fastify;
  } catch (error) {
    console.error("Lỗi khi thiết lập Cookie plugin:", error);
    return fastify;
  }
}; 