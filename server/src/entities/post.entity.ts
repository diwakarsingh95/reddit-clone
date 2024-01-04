import { Entity, OptionalProps, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "posts" })
export class Post {
  [OptionalProps]?: "createdAt" | "updatedAt";

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ type: "text" })
  title!: string;
}
