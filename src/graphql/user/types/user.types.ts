import { User } from "../../../entities/User";
import { InputType, Field } from "type-graphql";

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Number, { nullable: true })
  phoneNumber: number | null;
}
