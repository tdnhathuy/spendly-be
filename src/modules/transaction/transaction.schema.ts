// transaction/schema.ts
import { Static, Type } from "@sinclair/typebox";

export const SchemaTransaction = Type.Object({
  _id: Type.String({ pattern: "^[0-9a-fA-F]{24}$" }),
  name: Type.String(),
  // Thêm các trường khác ở đây
});

export type Transaction = Static<typeof SchemaTransaction>;
export type TransactionCreate = Omit<Transaction, "_id" | "createdAt" | "updatedAt">;
export type TransactionUpdate = Partial<Omit<Transaction, "_id">>;
