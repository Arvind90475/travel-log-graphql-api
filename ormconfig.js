const isDevelopmentEnvironment = process.env.NODE_ENV === "development";
const dbConfig = {
  type: "postgres",
  host: "localhost",
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/entities/**/*.js"],
  migrationsTableName: "migrations",
  migrations: ["dist/migrations/*.js"],
  migrationsRun: true,
  logging: isDevelopmentEnvironment,
  cli: {
    entitiesDir: "src/database/entities",
    migrationsDir: "src/migrations",
  },
};

module.exports = dbConfig;
