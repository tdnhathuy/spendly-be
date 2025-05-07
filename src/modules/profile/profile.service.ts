import { FastifyInstance } from "fastify";
import { getMongoDB } from "../../helper/func.helper";
import { ObjectId } from "mongodb";
export const ServiceProfile = {
	getAll: async (server: FastifyInstance) => {
		const db = getMongoDB(server);
		const profiles = await db.collection("profile").find().toArray();
		return profiles;
	},

	getById: async (server: FastifyInstance, id: string) => {
		const db = getMongoDB(server);
		const profile = await db.collection("profile").findOne({ _id: new ObjectId(id) });
		return profile;
	},

	create: async (server: FastifyInstance, body: any) => {
		const db = getMongoDB(server);
		body.wallets = [];
		const profile = await db.collection("profile").insertOne(body);
		return profile;
	},

	update: async (server: FastifyInstance, id: string, body: any) => {
		const db = getMongoDB(server);
		const profile = await db.collection("profile").updateOne({ _id: new ObjectId(id) }, { $set: body });
		return profile;
	},

	delete: async (server: FastifyInstance, id: string) => {
		const db = getMongoDB(server);
		const profile = await db.collection("profile").deleteOne({ _id: new ObjectId(id) });
		return profile;
	},
};
