import { sign } from "jsonwebtoken";
import { User } from "src/entities/User";

export function signAccessToken(user: User) {
  return sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
}

export const signRefreshToken = () => {};
