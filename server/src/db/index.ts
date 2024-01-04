import { MikroORM } from "@mikro-orm/postgresql";
import mikroOrmConfig from "../mikro-orm.config";

export const connectDatabase = async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();
  if (migrations && migrations.length > 0) {
    await migrator.up();
  }
  return orm;
};
