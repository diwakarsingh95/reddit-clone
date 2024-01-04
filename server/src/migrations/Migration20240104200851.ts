import { Migration } from '@mikro-orm/migrations';

export class Migration20240104200851 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "posts" ("id" serial primary key, "title" text not null, "created_at" timestamptz(0) not null default now(), "updated_at" timestamptz(0) not null default now());');
  }

}
