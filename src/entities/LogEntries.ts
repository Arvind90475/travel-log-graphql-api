import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../helpers/types";
import { User } from "./User";

registerEnumType(UserRole, {
  name: "UserRole",
});

@ObjectType()
@Entity()
export class LogEntry extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  title: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  description: string | null;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  comments: string | null;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  imageUrl: string | null;

  @Field(() => [Number])
  @Column("jsonb")
  location: [number];

  @Field(() => Date, { nullable: true })
  @Column("date", { nullable: true })
  visitDate: Date;   //TODO: FIX:Me

  
  @Field(() => ID)
  @Column("uuid", { name: "userId" })
  userId: string;
  
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.logEntries)
  @JoinColumn()
  user: User;
  
  @Field(() => User)
  createdBy: User;
  
  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
