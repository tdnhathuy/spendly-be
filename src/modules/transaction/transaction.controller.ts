import { FastifyReply, FastifyRequest } from "fastify";
import { getCol } from "../../helper/db.helper";
export const ControllerTransaction = {
  getAll: async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const { email } = req.user;
      const collection = await getCol(req);
      const { transaction = [] } = await collection.findOne({ email });

      return rep.status(200).send({
        success: true,
        data: transaction,
      });
    } catch (error) {
      return rep.status(500).send({
        success: false,
        message: "Lỗi khi lấy danh sách giao dịch",
      });
    }
  },

  create: async (req: FastifyRequest, rep: FastifyReply) => {
    try {
      const collection = await getCol(req);

      const profile = await collection.findOneAndUpdate(
        { email: req.user.email },
        { $push: { transaction: req.body } }
      );
      console.log("profile", profile);
      return rep.send({ success: true });
    } catch (error) {
      console.log("error", error);
    }
  },
};
