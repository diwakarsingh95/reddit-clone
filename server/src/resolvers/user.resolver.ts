import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
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

  @Mutation(() => User)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<User> {
    const user = await em.findOne(User, { email });
    if (!user) throw Error("No user found.");

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) throw Error("Invalid username or password.");

    return user;
  }
}
