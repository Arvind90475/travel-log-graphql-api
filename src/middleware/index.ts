import { MiddlewareFn } from "type-graphql/dist/interfaces/Middleware";
import { MyContext, UserRole } from "../helpers/types";

export const isLoggedIn: MiddlewareFn<MyContext> = ({ context }, next) => {
  try {
    if (!context.req.user) throw new Error();
    return next();
  } catch (error) {
    context.res.status(401);
    throw new Error("unAuthorised");
  }
};

export const checkRole = (role: UserRole) => {
  const check: MiddlewareFn<MyContext> = ({ context }, next) => {
    const user = context.req.user;
    if (user && (user.role === role || user.role === "ADMIN")) {
      return next();
    }
    throw new Error(`Unauthorized, You are not "${role}"`);
  };
  return check;
};
