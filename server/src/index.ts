import { MikroORM } from "@mikro-orm/core";
import ormConfig from "./mikro-orm.config";
import { Post } from "./entities/post.entity";

const main = async () => {
  const orm = await MikroORM.init(ormConfig);
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();
  if (migrations && migrations.length > 0) {
    await migrator.up();
  }

  const em = orm.em.fork();

  const post = em.create(Post, { title: "First Post" });
  await em.persistAndFlush(post);
};

main();
