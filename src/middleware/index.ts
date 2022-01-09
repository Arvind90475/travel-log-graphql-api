import { AuthChecker } from "type-graphql";
import { MyContext } from "../helpers/types";

export const customAuthChecker: AuthChecker<MyContext> = (
  { context },
  roles
) => {
  const { user } = context;
  if (!user) return false;
  if (roles.length && !roles.includes(user.role)) return false;

  return true;
};
