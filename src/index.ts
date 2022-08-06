import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import { buildSchema } from "type-graphql";

import UserResolver from "./graphql/user/user.resolvers";
import LogEntryResolver from "./graphql/logEntry/logEntry.resolver";
import { MyContext } from "./helpers/types";
import { customAuthChecker } from "./middleware";
import { verify } from "jsonwebtoken";

const main = async () => {
  const PORT = process.env.PORT || 4000
  await createConnection();
  const app = express();
  //@ts-ignore
  app.use(cookieParser());
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : process.env.ORIGIN_URL,
      credentials: true,
      exposedHeaders: ["set-cookie"],
    })
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, LogEntryResolver],
      globalMiddlewares: [],
      authChecker: customAuthChecker,
    }),
    introspection:true,
    playground: true,
    context: (context: MyContext) => {
      try {
        const { req } = context;
        const tokenFromCookie = req.cookies["token"];
        const tokenFromHeader = req.headers["authorization"]?.split(" ")[1];
        const token = tokenFromCookie || tokenFromHeader;
        if (token) {
          //throws error if verify fails
          context.user = verify(token, process.env.ACCESS_TOKEN_SECRET!) as any;
        }
      } catch (error) {
        console.log(
          `errored at checkTokenAndSetUser middleware: ${error.message}`
        );
      }
      return context;
    },
  });

  server.applyMiddleware({ app, path: "/graphql", cors: false });
  app.listen(PORT, () => console.log(`server has started on : http://localhost:${PORT}`));
};

main().catch(e => {
  console.error(`errored : ${e}`)
});
