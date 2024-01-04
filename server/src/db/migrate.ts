import { MikroORM } from "@mikro-orm/core";
import mikroOrmConfig from "../mikro-orm.config";

(async () => {
  const orm = await MikroORM.init(mikroOrmConfig);

  const migrator = orm.getMigrator();
  await migrator
    .createMigration(undefined, undefined, true)
    .catch(console.error);
  await migrator.up().catch(console.error);

  await orm.close(true);
})();
