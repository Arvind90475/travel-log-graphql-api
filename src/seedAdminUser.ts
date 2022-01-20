import "dotenv/config";
import * as bcrypt from "bcryptjs";
import { User } from "./entities/User";
import { UserRole } from "./helpers/types";
import { createConnection } from "typeorm";

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
        url: process.env!.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }),
  type: "postgres",
  entities: ["dist/entities/**/*.js"],
  migrationsTableName: "migrations",
  migrations: ["dist/migrations/*.js"],
  migrationsRun: false,
  logging: isDevelopmentEnvironment,
  cli: {
    entitiesDir: "src/database/entities",
    migrationsDir: "src/migrations",
  },
};

const seedAdmin = async () => {
  try {
    //@ts-ignore
    await createConnection(dbConfig);
    const adminUser = {
      firstName: "Admin",
      lastName: "User",
      email: process.env!.ADMIN_EMAIL,
    };
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 8);
    await User.create<User>({
      ...adminUser,
      password: hashedPassword,
      role: UserRole.ADMIN,
    }).save();
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

seedAdmin();
