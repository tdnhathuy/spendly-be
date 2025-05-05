import { FastifyInstance } from "fastify";
import { registerHomeRoutes } from "./home/home.route";
import { registerProfileRoutes } from "./profile/profile.route";

export function registerAllRoutes(fastify: FastifyInstance) {
  // Đăng ký tất cả các routes
  registerHomeRoutes(fastify);
  registerProfileRoutes(fastify);
}
