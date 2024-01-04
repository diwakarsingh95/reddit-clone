import { Query, Resolver } from "type-graphql";

@Resolver()
export class StatusResolver {
  @Query(() => String)
  status() {
    return "Hi👋 This is Reddit-Clone server🚀";
  }
}
