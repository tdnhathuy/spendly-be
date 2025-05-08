import { FastifyInstance } from "fastify";
import fastifySecureSession from "@fastify/secure-session";
import { config } from "../config/config";
import crypto from 'crypto';

export const pluginSession = async (fastify: FastifyInstance) => {
  try {
    // Tạo khóa cho session
    const key = crypto.randomBytes(32);
    console.log("Tạo khóa bảo mật cho session");

    await fastify.register(fastifySecureSession, {
      key: key,
      cookie: {
        path: '/',
        httpOnly: true,
        secure: config.auth.cookieSecure,
      }
    });

    console.log("Session plugin đã được thiết lập thành công");
    return fastify;
  } catch (error) {
    console.error("Lỗi khi thiết lập Session plugin:", error);
    return fastify;
  }
}; 