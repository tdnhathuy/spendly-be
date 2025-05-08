// profile/schema.ts
import { Static, Type } from "@sinclair/typebox";

export const SchemaProfile = Type.Object({
  _id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
  name: Type.String(),
  // Thêm các trường khác ở đây
});

export type Profile = Static<typeof SchemaProfile>;
export type ProfileCreate = Omit<Profile, "_id" | "createdAt" | "updatedAt">;
export type ProfileUpdate = Partial<Omit<Profile, "_id">>;
