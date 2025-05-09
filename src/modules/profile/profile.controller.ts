// profile/controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { getCol } from "../../helper/db.helper";

export const ControllerProfile = {
  setupProfile: async (req: FastifyRequest, reply: FastifyReply) => {
    const email = req.user.email;
    const collection = await getCol(req);
    const profile = await collection.findOne({ email });
    if (!profile) {
      collection.insertOne({
        ...req.user,
        transaction: [],
        category: [],
        wallet: [],
      });
    }
    return reply.status(200).send({
      success: true,
      data: profile,
    });
  },
};
