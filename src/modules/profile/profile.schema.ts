import { Static, Type } from "@sinclair/typebox";

export const SchemaWallet = Type.Object({
	address: Type.String(),
	balance: Type.Number(),
	chain: Type.String(),
});

export const SchemaProfile = Type.Object({
	_id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
	name: Type.String(),
	wallets: Type.Array(SchemaWallet),
});

export type Profile = Static<typeof SchemaProfile>;
export type ProfileCreate = Omit<Profile, "_id" | "createdAt" | "updatedAt" | "wallets">;
export type ProfileUpdate = Partial<Omit<Profile, "_id">>;
