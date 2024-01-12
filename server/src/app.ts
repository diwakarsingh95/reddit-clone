import express, { NextFunction, Request, Response } from "express";
import { Server, createServer } from "http";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { connectDatabase } from "./db";
import { MyContext } from "./utils/types";
import { StatusResolver } from "./resolvers/status.resolver";
import { PostResolver } from "./resolvers/post.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import RedisStore from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { NODE_ENV } from "./utils/constants";

// Initialize client.
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
  disableTouch: true,
});

const PORT = process.env.PORT || 8080;

export default class App {
  public orm!: MikroORM<IDatabaseDriver<Connection>>;
  public host!: express.Application;
  public server!: Server;

  public connect = async () => {
    this.orm = await connectDatabase();
  };

  public init = async () => {
    this.host = express();
    this.host.use(
      cors({
        methods: ["POST"],
        credentials: true,
        origin: "http://localhost:5173",
      })
    );
    // Initialize sesssion storage.
    this.host.use(
      session({
        name: "qid",
        store: redisStore,
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        secret: "keyboard cat",
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365, // 1 Year
          httpOnly: true,
          secure: NODE_ENV === "production",
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
