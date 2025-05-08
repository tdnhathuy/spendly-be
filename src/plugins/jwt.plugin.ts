import { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { config } from "../config/config";

export const pluginJwt = async (fastify: FastifyInstance) => {
  try {
    if (!config.auth.jwtSecret) {
      console.error("Lỗi: Thiếu JWT secret key trong cấu hình");
      throw new Error("JWT_SECRET không được cấu hình");
    }

    await fastify.register(fastifyJwt, {
      secret: config.auth.jwtSecret,
      sign: {
        expiresIn: "7d",
      },
    });

    fastify.decorate("authenticate", async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.code(401).send({ error: "Chưa xác thực" });
      }
    });

    console.log("JWT plugin đã được thiết lập thành công");
    return fastify;
  } catch (error) {
    console.error("Lỗi khi thiết lập JWT plugin:", error);
    throw error;
  }
}; 