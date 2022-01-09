import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { User } from "../../entities/User";
import { LogEntry } from "../../entities/LogEntries";
import { MyContext, UserRole } from "../../helpers/types";
import { LogEntryInput } from "./types/logEntry.types";

@Resolver((_) => LogEntry) //says which field its resolving for
class LogEntryResolver {
  @FieldResolver()
  user(@Root() logEntry: LogEntry) {
    return User.findOne({ id: logEntry.userId });
  }

  @Authorized(UserRole.ADMIN, UserRole.USER)
  @Query(() => [LogEntry])
  async allLogEntries(@Ctx() context: MyContext): Promise<LogEntry[]> {
    let logEntries = [];
    if (context.user?.role === "ADMIN") {
      logEntries = await LogEntry.find();
    } else {
      logEntries = await LogEntry.find({
        where: {
          userId: context.user?.id,
        },
      });
    }
    return logEntries;
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
