import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { MyContext, UserRole } from "../types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    const token = context.req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new Error("not authenticated");
    }
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (error) {
    throw new Error("not authenticated");
  }
  return next();
};

export const checkRole = (role: UserRole) => {
  const check: MiddlewareFn<MyContext> = ({ context }, next) => {
    if (context.req.user && context.req.user.role === role) {
      return next();
    }
    throw new Error(`Unauthorized, You are not "${role}"`);
  };
  return check;
};
