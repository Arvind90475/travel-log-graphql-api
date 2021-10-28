import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
const config: PostgresConnectionOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "type-graphql-typescript",
  synchronize: process.env.NODE_ENV === "development",
  logging: true,
  entities: ["dist/entity/*.js"],
  migrations: ["dist/migration/**/*.js"],
  cli: {
    entitiesDir: "entity",
    migrationsDir: "migration",
    subscribersDir: "subscriber",
  },
};

export default config;
