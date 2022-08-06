import * as bcrypt from "bcryptjs";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { User } from "../../entities/User";
import { LoginResponse, MyContext, UserRole } from "../../helpers/types";
import { signAccessToken } from "../../helpers";
import { UserInput } from "./types/user.types";

@Resolver()
class userResolver {
  @Authorized()
  @Query(() => User)
  async me(@Ctx() context: MyContext): Promise<User | undefined> {
    return User.findOne({
      id: context.user!.id,
    });
  }

  @Mutation(() => User)
  async register(@Arg("options") userInput: UserInput): Promise<User> {
    const { password, firstName, lastName, phoneNumber, email } = userInput;
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
    @Arg("password") password: string,
    @Ctx() context: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("Could not find user");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("wrong password");

    // login successfully , send token
    const accessToken = signAccessToken(user);
    context.res.cookie("token", accessToken, {
      maxAge: 60 * 60 * 24 * 1000, //one day in mili seconds
      httpOnly: true,
      
    });
    return {
      accessToken,
    };
  }

  @Authorized()
  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MyContext): boolean {
    res.cookie("token", "", {
      maxAge:1
    });
    return true;
  }

  @Authorized(UserRole.ADMIN)
  @Query(() => [User])
  async allUser(): Promise<User[]> {
    try {
      const users = await User.find({});
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default userResolver;
