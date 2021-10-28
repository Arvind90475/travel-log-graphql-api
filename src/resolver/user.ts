import * as bcrypt from "bcryptjs";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "../entity/User";
import { LoginResponse, UserRole } from "../types";
import { signAccessToken } from "../helpers";
import { checkRole } from "../middleware";

@Resolver()
class userResolver {
  // @ts-ignore
  @UseMiddleware(checkRole("ADMIN"))
  @Query(() => [User])
  async users(): Promise<User[]> {
    return User.find({});
  }

  @Mutation(() => User)
  async register(
    @Arg("firstName") firstName: string,
    @Arg("lastName") lastName: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Arg("phoneNumber", { nullable: true }) phoneNumber?: number
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await User.create<User>({
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      email,
      role: UserRole.MODERATOR,
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
    const users = await User.find();
    return users;
  }
}

export default userResolver;
