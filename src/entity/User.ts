import { Field, ID, ObjectType,  } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id:number;

    @Field()
    @Column({nullable:false})
    firstName: string

    
    @Field()
    @Column('text')
    email:string;

    @Column({nullable:false})
    password: string
}
