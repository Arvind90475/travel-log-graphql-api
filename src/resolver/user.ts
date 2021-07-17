import { User } from "../entity/User";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import * as bcrypt from "bcryptjs";


@Resolver()
class userResolver{
    @Query(() => String)
    hello():string{
        return 'hello world'; 
    }

    @Mutation(() => User)
    async register(
        @Arg('firstName') firstName :string,
        @Arg('email') email : string,
        @Arg('password') password : string
    ):Promise<User>{
        const hashedPassword = await bcrypt.hash(password, 8)
        const user =  await User.create({
            password : hashedPassword,
            firstName,
            email            
        }).save();

        return user;
    }


    @Query(() => [User])
    async allUser():Promise<User[]>{
        const users = await User.find();
        return users;
    }
}

export default userResolver;