import { Request, Response } from "express";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;
}

interface UserPayload extends Request {
  user?: {
    id: string;
    role: "USER" | "ADMIN";
  };
}

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
