const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/entities/**/*.js"],
  migrationsTableName: "migrations",
  migrations: ["dist/migrations/*.js"],
  // synchronize: isDevelopmentEnvironment,
  migrationsRun: true,
  logging: isDevelopmentEnvironment,
  cli: {
    entitiesDir: "src/database/entities",
    migrationsDir: "src/migrations",
  },
};
