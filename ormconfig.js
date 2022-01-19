const isDevelopmentEnvironment = process.env.NODE_ENV === "development";

const dbConfig = {
  ...(isDevelopmentEnvironment
    ? {
        host: "localhost",
        port: process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      }
    : {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }),
  type: "postgres",
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
