import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";


import { User } from "../../entities/User";
import { LogEntry } from "../../entities/LogEntries";
import { MyContext, UserRole } from "../../helpers/types";
import { LogEntryInput } from "./types/logEntry.types";
import { checkRole, isAuth } from "../../middleware"

@Resolver((_) => LogEntry) //says which field its resolving for
class LogEntryResolver {
  
  @FieldResolver()
  user(@Root() logEntry: LogEntry){
    return User.findOne({ id: logEntry.userId });
  }

  @UseMiddleware(checkRole(UserRole.ADMIN))
  @Query(() => [LogEntry])
  async allLogEntries(): Promise<LogEntry[]> {
    return LogEntry.find({});
  }

  @UseMiddleware(isAuth)
  @Mutation(() => LogEntry)
  async createLogEntry(
    @Arg("options") logEntryInput: LogEntryInput,
    @Ctx() context: MyContext
  ): Promise<LogEntry> {
    return LogEntry.create({
      ...logEntryInput,
      userId: context.req.user?.id,
    }).save();
  }
}

export default LogEntryResolver;