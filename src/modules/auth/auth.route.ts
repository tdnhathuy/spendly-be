import { FastifyInstance } from "fastify";
import { ControllerAuth } from "./auth.controller";
import { config } from "../../config/config";

export default async function (fastify: FastifyInstance) {
  const preHandler = fastify.authenticate;
  fastify.get(
    "/auth/me",
    { preHandler, schema: { tags: ["Auth"] } },
    ControllerAuth.getCurrentUser
  );

  fastify.get(
    "/login",
    { schema: { tags: ["Auth"] } },
    ControllerAuth.renderLoginPage
  );
  fastify.get(
    "/auth/success",
    { schema: { tags: ["Auth"] } },
    ControllerAuth.renderSuccessPage
  );

  fastify.get(
    "/api/auth/google",
    { schema: { tags: ["Auth"] } },
    ControllerAuth.handleGoogleLogin
  );
  fastify.get(
    "/api/auth/google/callback",
    { schema: { tags: ["Auth"] } },
    ControllerAuth.googleLoginCallback
  );

  fastify.get(
    "/api/auth/verify-token",
    { schema: { tags: ["Auth"] } },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply
            .code(400)
            .send({ error: "Cần cung cấp token trong header Authorization" });
        }

        const token = authHeader.split(" ")[1];
        const jwtInstance = fastify.jwt;

        try {
          const decoded = jwtInstance.decode(token);

          try {
            const verified = await jwtInstance.verify(token);
            return {
              status: "success",
              message: "Token hợp lệ",
              decodedToken: decoded,
              verifiedToken: verified,
              jwtSecretFirstChars:
                config.auth.jwtSecret.substring(0, 5) + "...",
            };
          } catch (verifyError) {
            return {
              status: "error",
              message: "Token không hợp lệ khi xác thực",
              error: verifyError.message,
              decodedToken: decoded,
              jwtSecretFirstChars:
                config.auth.jwtSecret.substring(0, 5) + "...",
            };
          }
        } catch (decodeError) {
          return reply.code(400).send({
            status: "error",
            message: "Không thể decode token",
            error: decodeError.message,
          });
        }
      } catch (error) {
        return reply.code(500).send({
          status: "error",
          message: "Lỗi server khi xác thực token",
          error: error.message,
        });
      }
    }
  );
  // Route đăng xuất
  fastify.post(
    "/auth/logout",
    { schema: { tags: ["Auth"] } },
    ControllerAuth.logout
  );
}
