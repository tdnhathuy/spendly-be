import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { OAuth2Client } from "google-auth-library";

interface GooglePayload {
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  sub: string;
  iat: number;
  exp: number;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      id: string;
      email: string;
      name: string;
      picture: string;
    };
    jwtVerify(): Promise<any>;
  }

  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

export const pluginJwt = async (fastify: FastifyInstance) => {
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SECRET || "supersecret",
  });

  const googleClient = new OAuth2Client();

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return reply.code(401).send({ error: "Không có token xác thực" });
        }

        const token = authHeader.substring(7);
        if (token.includes(".")) {
          try {
            const ticket = await googleClient.verifyIdToken({
              idToken: token,
              audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload() as GooglePayload;
            if (!payload) {
              return reply.code(401).send({ error: "Token không hợp lệ" });
            }

            request.user = {
              id: payload.sub,
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
            };

            return;
          } catch (googleError) {
            try {
              await request.jwtVerify();
              return;
            } catch (jwtError) {
              return reply.code(401).send({ error: "Token không hợp lệ" });
            }
          }
        } else {
          return reply.code(401).send({ error: "Token không đúng định dạng" });
        }
      } catch (err) {
        return reply.code(500).send({ error: "Lỗi xác thực" });
      }
    }
  );
};
