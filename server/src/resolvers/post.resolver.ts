import { Entity } from "@mikro-orm/core";
import { Post } from "../entities/post.entity";
import { MyContext } from "../utils/types";
import { Ctx, Query } from "type-graphql";

@Entity()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext) {
    return em.find(Post, {});
  }
}
