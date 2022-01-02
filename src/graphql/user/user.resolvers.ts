import * as bcrypt from "bcryptjs";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "../../entities/User";
import { LoginResponse, UserRole } from "../../helpers/types";
import { signAccessToken } from "../../helpers";
import { checkRole } from "../../middleware";
import { UserInput } from "./types/user.types";

@Resolver()
class userResolver {
  @UseMiddleware(checkRole(UserRole.ADMIN))
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find({});
  }
  
  @Mutation(() => User)
  async register(
    @Arg("options") userInput: UserInput,
  ): Promise<User> {
    const {password, firstName, lastName, phoneNumber,email} = userInput
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create<User>({
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      email,
      role: UserRole.USER,
    }).save();
    return user;
  }
  
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
    ): Promise<LoginResponse> {
      const user = await User.findOne({ where: { email } });
      if (!user) throw new Error("Could not find user");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("wrong password");
      // login successfully , send token
      const accessToken = signAccessToken(user);
      return {
        accessToken,
      };
    }
    
    @Query(() => [User])
    async allUser(): Promise<User[]> {
      try {
        console.log('allUser query')
        const users = await User.find({});
        return users;
      } catch (error) {
        throw new Error(error)  
      }
    }
}

export default userResolver;
