import express, { NextFunction, Request, Response } from "express";
import { Server, createServer } from "http";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { connectDatabase } from "./db";
import { MyContext, User } from "./utils/types";
import { StatusResolver } from "./resolvers/status.resolver";
import { PostResolver } from "./resolvers/post.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import RedisStore from "connect-redis";
import session from "express-session";
import { RedisClientType, createClient } from "redis";
import {
  PORT,
  SESSION_MAX_AGE,
  SESSION_SECRET,
  __prod__,
} from "./utils/constants";

declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

export default class App {
  public orm!: MikroORM<IDatabaseDriver<Connection>>;
  public host!: express.Application;
  public server!: Server;
  private redisClient!: RedisClientType;
  private redisStore!: RedisStore;
  private corsOriginWhitelist!: [
    "http://localhost:5173",
    "https://sandbox.embed.apollographql.com"
  ];

  public connectDB = async () => {
    this.orm = await connectDatabase();
  };

  public connectRedis = async () => {
    this.redisClient = createClient();
    await this.redisClient.connect();
  };

  public init = async () => {
    this.host = express();
    // Redis Store
    this.redisStore = new RedisStore({
      client: this.redisClient,
      prefix: "myapp:",
      disableTouch: true,
    });
    // CORS
    this.host.use(
      cors({
        methods: ["POST"],
        credentials: true,
        origin: this.corsOriginWhitelist,
      })
    );
    // Initialize sesssion storage.
    this.host.use(
      session({
        name: "sid",
        store: this.redisStore,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        secret: SESSION_SECRET,
        cookie: {
          maxAge: SESSION_MAX_AGE,
          httpOnly: true,
          secure: __prod__,
          sameSite: "strict",
        },
      })
    );
    this.server = createServer(this.host);

    try {
      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [StatusResolver, PostResolver, UserResolver],
        }),
        plugins: [
          ApolloServerPluginDrainHttpServer({ httpServer: this.server }),
        ],
      });
      await apolloServer.start();

      this.host.use(
        "/graphql",
        express.json(),
        expressMiddleware(apolloServer, {
          context: async ({ req, res }) =>
            ({
              req,
              res,
              em: this.orm.em.fork(),
            } as MyContext),
        })
      );

      this.host.get("/", (_req, res) =>
        res.send("<h1>Reddit Clone Server.</h1>")
      );

      this.host.use(
        (
          error: Error,
          _req: Request,
          res: Response,
          _next: NextFunction
        ): void => {
          console.error("📌 Something went wrong", error);
          res.status(400).send(error);
        }
      );

      this.server.listen(PORT, () => {
        console.log("🚀 Server started on port", PORT);
      });
    } catch (error) {
      console.error("📌 Could not start server", error);
    }
  };
}
