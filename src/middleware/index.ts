import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { MyContext, UserRole } from "../helpers/types";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    const token = context.req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new Error("not authenticated");
    }
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (error) {
    context.res.status(401)
    throw new Error("unAuthorised");
  }
  return next();
};

export const checkRole = (role: UserRole) => {
  const check: MiddlewareFn<MyContext> = ({ context }, next) => {
    const user = context.req.user
    if (user && (user.role === role || user.role === 'ADMIN') ) {
      return next();
    }
    throw new Error(`Unauthorized, You are not "${role}"`);
  };
  return check;
};
