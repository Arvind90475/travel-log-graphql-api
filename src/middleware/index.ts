import { verify } from "jsonwebtoken";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";
import { MyContext } from "../types";


export const isAuth:Middleware<MyContext> = ({context},next) => {
    try {
        const token = context.req.headers['authorization']?.split(' ')[1];
        if(!token){
            throw new Error('not authenticated');
        }
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        context.payload = payload as any;
    } catch (error) {
        throw new Error('not authenticated')
    }
    return next();
}