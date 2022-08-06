import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { User } from "../../entities/User";
import { LogEntry } from "../../entities/LogEntries";
import { MyContext, UserRole } from "../../helpers/types";
import { LogEntriesInput, LogEntryInput } from "./types/logEntry.types";

function isNill(value: any) {
  return value === null || value === undefined;
}
@ObjectType()
class PaginatedLogEntries {
  @Field(() => [LogEntry])
  logEntries: LogEntry[];

  @Field()
  hasNext: boolean;

  @Field()
  count: Number;
}

@Resolver((_) => LogEntry) //says which field its resolving for
class LogEntryResolver {
  @FieldResolver()
  user(@Root() logEntry: LogEntry) {
    return User.findOne({ id: logEntry.userId });
  }

  @FieldResolver()
  createdBy(@Root() logEntry: LogEntry) {
    return User.findOne({ id: logEntry.userId });
  }

  // @Authorized(UserRole.ADMIN, UserRole.USER)
  @Query(() => PaginatedLogEntries)
  async allLogEntries(
    @Arg("options", { nullable: true }) logEntriesInput: LogEntriesInput,
    @Ctx() context: MyContext
  ): Promise<PaginatedLogEntries> {
    //pagination logic
    const limit = logEntriesInput?.limit;
    if ((!isNill(limit) && limit === 0) || limit! < 0)
      throw new Error("Invalid value provided for limit");
      
    const defaultLimit = 50;
    const queryLimit = limit ? Math.min(limit, defaultLimit) : defaultLimit;
    const limitPlusOne = queryLimit + 1;

    const isAdmin = context.user?.role === "ADMIN";
    const logEntries = await LogEntry.find({
      where: {
        ...(!isAdmin && {
          userId: context.user?.id,
        }),
      },
      take: limitPlusOne,
    });
    const hasNext = logEntries.length > queryLimit;

    const newLogEntries = logEntries.slice(0, -1);
    return {
      logEntries: newLogEntries,
      hasNext,
      count: newLogEntries.length,
    };
  }

  @Authorized()
  @Mutation(() => LogEntry)
  async createLogEntry(
    @Arg("options") logEntryInput: LogEntryInput,
    @Ctx() context: MyContext
  ): Promise<LogEntry> {
    return LogEntry.create({
      ...logEntryInput,
      userId: context.user?.id,
    }).save();
  }
}

export default LogEntryResolver;
