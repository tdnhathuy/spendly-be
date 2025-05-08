import { Static, Type } from "@sinclair/typebox";
import { ObjectId } from "mongodb";

export type UserProvider = "google" | "local";

export interface User {
  name: string;
  email: string;
  picture?: string;
  provider: UserProvider;
  providerId?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const SchemaUser = Type.Object({
  name: Type.String(),
  email: Type.String({ format: 'email' }),
  picture: Type.Optional(Type.String()),
  provider: Type.Enum({ google: 'google', local: 'local' } as const),
  providerId: Type.Optional(Type.String()),
  password: Type.Optional(Type.String()),
  createdAt: Type.Optional(Type.String({ format: 'date-time' })),
  updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
});

export interface LoginResponse {
  token: string;
  user: Omit<User, 'password'> & { id: string };
}

export const SchemaLoginResponse = Type.Object({
  token: Type.String(),
  user: Type.Object({
    id: Type.String(),
    name: Type.String(),
    email: Type.String(),
    picture: Type.Optional(Type.String()),
    provider: Type.Enum({ google: 'google', local: 'local' } as const),
    providerId: Type.Optional(Type.String()),
    createdAt: Type.Optional(Type.String({ format: 'date-time' })),
    updatedAt: Type.Optional(Type.String({ format: 'date-time' }))
  })
}); 