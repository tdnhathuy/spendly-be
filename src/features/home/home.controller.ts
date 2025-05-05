import { FastifyReply, FastifyRequest } from "fastify";

export class HomeController {
  async getHomePage(request: FastifyRequest, reply: FastifyReply) {
    return "Hello World";
  }
} 