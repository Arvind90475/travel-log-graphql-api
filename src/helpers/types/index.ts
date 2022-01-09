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

export type UserPayload = { user?: IUserPayload } & {
  cookies: Record<string, string>;
};

export interface MyContext {
  req: Request & UserPayload;
  res: Response;
  payload?: IUserPayload
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}
