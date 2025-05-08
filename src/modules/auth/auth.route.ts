import { FastifyInstance } from "fastify";
import { ControllerAuth } from "./auth.controller";

export default async function (fastify: FastifyInstance) {
  // Route callback từ Google OAuth2 đã được đăng ký trong app.ts
  // Chỉ đăng ký các route còn lại ở đây

  // Route lấy thông tin người dùng hiện tại
  fastify.get(
    "/auth/me",
    {
      preHandler: fastify.authenticate,
    },
    ControllerAuth.getCurrentUser
  );

  // Route đăng xuất
  fastify.post("/auth/logout", ControllerAuth.logout);
} 