import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/user.entity";
import { MyContext } from "../utils/types";

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ) {
    const existingUser = await em.findOne(User, { username, email });
    if (existingUser) throw Error("Username already exists.");
    const hasedPassword = await argon2.hash(password);
    const user = em.create(User, { username, email, password: hasedPassword });
    await em.persistAndFlush(user);
    return user;
  }
}
