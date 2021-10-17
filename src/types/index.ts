import {Request,Response} from 'express'
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class LoginResponse {
    @Field()
    accessToken: string;
}

export interface MyContext {
    req: Request;
    res: Response;
    payload?:{
        id:string
        email:string
    }
}