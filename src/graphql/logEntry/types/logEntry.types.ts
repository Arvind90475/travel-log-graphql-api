import { LogEntry } from "../../../entities/LogEntries";
import { InputType, Field, Int } from "type-graphql";

@InputType()
export class LogEntryInput implements Partial<LogEntry> {
    @Field()
    title: string;

    @Field(() => String, {nullable:true})
    description: string | null
    
    @Field(() => String, {nullable:true})
    comments: string | null
    
    @Field(() => String, {nullable:true})
    imageUrl:  string | null
    
    @Field(() => [Number])
    location: [number]
    
    @Field(() => Date, {nullable:true}) //TODO: fixme
    visitDate: Date
}


@InputType()
export class LogEntriesInput {
    @Field(() => Int, {nullable:true})
    limit: number | null
}