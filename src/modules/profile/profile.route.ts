// profile/routes.ts
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyInstance } from "fastify";
import controller from "./profile.controller";

export default async function profileRoutes(app: FastifyInstance) {
  const server = app.withTypeProvider<TypeBoxTypeProvider>();

  server.get("/", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.getAll);
  server.get("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.getById);
  server.post("/", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.create);
  server.put("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.update);
  server.delete("/:id", {
      preHandler: app.authenticate,
      schema: {tags: ["Profile"]},
    }, controller.delete);

  const preHandler = app.authenticate;

  // Endpoint mới để kiểm tra xác thực token
  server.get(
    "/me",
    { 
      preHandler,
      schema: { 
        tags: ["Profile"],
        description: "Lấy thông tin người dùng hiện tại từ token",
        response: {
          200: {
            type: 'object',
            properties: {
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string' },
                  picture: { type: 'string' }
                }
              },
              message: { type: 'string' }
            }
          }
        }
      } 
    },
    async (request, reply) => {
      try {
        // Thông tin người dùng đã được xác thực từ middleware authenticate
        const user = request.user as Record<string, any>;
        
        return { 
          user, 
          message: "Xác thực thành công từ token " + (user && 'iat' in user ? "Google" : "hệ thống")
        };
      } catch (error) {
        console.error("Lỗi khi lấy thông tin profile:", error);
        return reply.code(500).send({ error: "Lỗi server" });
      }
    }
  );
}
