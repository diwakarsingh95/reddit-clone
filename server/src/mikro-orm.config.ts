import { MikroORM } from "@mikro-orm/core";
import { defineConfig } from "@mikro-orm/postgresql";
import { NODE_ENV } from "./utils/constants";

export default defineConfig({
  migrations: {
    path: "dist/migrations",
    pathTs: "src/migrations",
    tableName: "migrations",
    transactional: true,
  },
  entities: ["dist/entities/**/*.entity.js"],
  entitiesTs: ["src/entities/**/*.entity.ts"],
  tsNode: NODE_ENV !== "production",
  dbName: "reddit-clone",
  user: "postgres",
  password: "password",
  debug: NODE_ENV !== "production",
}) as Parameters<typeof MikroORM.init>[0];
