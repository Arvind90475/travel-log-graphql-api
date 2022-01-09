import { Request, Response, CookieOptions } from "express";
import { ObjectType, Field } from "type-graphql";
@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}
export interface MyContext {
  req: Request & { cookies: Record<string, string> };
  res: Response;
  user?: IUserPayload;
}
export interface IUserPayload {
  id: string;
  role: "USER" | "ADMIN" | "MODERATOR";
}
