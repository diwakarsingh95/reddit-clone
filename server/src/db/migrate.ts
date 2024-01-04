import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "../mikro-orm.config";

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);
  try {
    const migrator = orm.getMigrator();
    try {
      await migrator.createInitialMigration();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      await migrator.createMigration();
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
  }
  await orm.close(true);
})();
