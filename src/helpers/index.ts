import { sign } from "jsonwebtoken";
import { User } from "src/entity/User";

export function signAccessToken(user:User){
    return sign(
        {id:user.id, email:user.email},
        process.env.ACCESS_TOKEN_SECRET!,
        {expiresIn:'15m'}
    );
}

export const signRefreshToken = () => {
    
}