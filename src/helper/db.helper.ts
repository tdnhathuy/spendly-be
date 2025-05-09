import { FastifyRequest } from "fastify";
import { Profile } from "../modules/profile/profile.schema";

export const getCol = async <T = Profile>(
  req: FastifyRequest,
  name = "profile"
) => {
  return req.server.mongo.db.collection<T>(name);
};
