import Fastify from "fastify";
import { registerSwagger } from "./plugins/swagger";
import { registerMongoDB } from "./plugins/mongodb";
import { registerAllRoutes } from "./features";

// Khởi tạo Fastify app
export async function buildApp() {
  const fastify = Fastify({ 
    logger: false,
    ajv: {
      customOptions: {
        strict: false, // Tắt strict mode để chấp nhận keywords như example
        allErrors: true
      }
    }
  });

  // Đăng ký plugins
  await registerSwagger(fastify);
  await registerMongoDB(fastify);

  // Đăng ký tất cả các routes
  registerAllRoutes(fastify);

  return fastify;
}
