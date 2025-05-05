import { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import { IProfile } from "./profile.type";
import { ProfileService } from "./profile.service";

export class ProfileController {
  private profileService: ProfileService;

  constructor(fastify: FastifyInstance) {
    this.profileService = new ProfileService(fastify);
  }

  getProfile = async (request: FastifyRequest, reply: FastifyReply) => {
    return "Profile Hello World";
  };

  createProfile = async (
    request: FastifyRequest<{
      Body: IProfile;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { name, email } = request.body;
      const result = await this.profileService.createProfile({ name, email });
      return result;
    } catch (error) {
      console.error("Error creating profile:", error);
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: "Failed to create profile",
      });
    }
  };
}
