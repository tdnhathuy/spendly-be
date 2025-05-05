import { FastifySchema } from "fastify";

const tags = ["Profile"];
export const schemaProfile: FastifySchema = {
  description: "Get profile information",
  tags: tags,
  response: {
    200: {
      type: "string",
      description: "Profile information",
      example: "Profile Hello World",
    },
  },
};

export const schemaProfileCreate: FastifySchema = {
  description: "Create a new profile",
  tags: tags,
  body: {
    type: "object",
    required: ["name", "email"],
    properties: {
      name: {
        type: "string",
        default: "User Name",
        description: "Full name of the user",
      },
      email: {
        type: "string",
        default: "user@example.com",
        format: "email",

      },
    },
  },
};
