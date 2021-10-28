import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { buildSchema } from "type-graphql";
import userResolver from "./resolver/user";
import dbConfig from "./ormconfig";
import { MyContext } from "./types";
import { verify } from "jsonwebtoken";
// import { User } from "./entity/User";

const main = async () => {
  await createConnection(dbConfig);
  // await User.delete({});
  const app = express();
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [userResolver],
    }),
    context: ({ req, res }: MyContext) => {
      try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (token) {
          const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
          req.user = payload as any;
        }
      } catch (error) {
        console.log(`error: ${error.message}`);
      }
      return { req, res };
    },
  });
  server.applyMiddleware({ app, path: "/graphql" });
  app.listen(4000, () => console.log("server has started on port 4000"));
};

main();
