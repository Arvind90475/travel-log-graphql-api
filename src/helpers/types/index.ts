import { Request, Response, CookieOptions } from "express";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}

export interface IUserPayload {
  id: string;
  role: "USER" | "ADMIN";
}

export type UserPayload = Request & { user?: IUserPayload } & {
  cookies: Record<string, string>;
};

export interface MyContext {
  req: UserPayload;
  res: Response;
  payload?: {
    id: string;
    role: "USER" | "ADMIN";
  };
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}
