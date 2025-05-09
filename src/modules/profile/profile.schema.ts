// profile/schema.ts
import { Static, Type } from "@sinclair/typebox";

export const SchemeIcon = Type.Object({
  _id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
  name: Type.String(),
  url: Type.String(),
});

export const SchemaWallet = Type.Object({
  _id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
  name: Type.String(),
  initialBalance: Type.Number(),
  icon: SchemeIcon,
});

export const SchemaCategory = Type.Object({
  _id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
  name: Type.String(),
  type: Type.String({ enum: ["income", "expense", "other"] }),
  icon: SchemeIcon,
});

export const SchemaTransaction = Type.Object({
  _id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
  amount: Type.Number(),
  description: Type.String(),
  category: Type.Optional(SchemaCategory),
  date: Type.String(),
  icon: SchemeIcon,
});

// Schema cho Swagger
export const SchemaProfile = Type.Object({
  _id: Type.Optional(Type.String({ pattern: "^[0-9a-fA-F]{24}$" })),
  name: Type.String(),
  email: Type.String(),
  transaction: Type.Array(SchemaTransaction),
  wallet: Type.Array(SchemaWallet),
  category: Type.Array(SchemaCategory),
});

export type Profile = Static<typeof SchemaProfile>;
export type Transaction = Static<typeof SchemaTransaction>;
export type Wallet = Static<typeof SchemaWallet>;
export type Category = Static<typeof SchemaCategory>;
export type Icon = Static<typeof SchemeIcon>;

export type ProfileCreate = Omit<Profile, "_id" | "createdAt" | "updatedAt">;
export type ProfileUpdate = Partial<Omit<Profile, "_id">>;
