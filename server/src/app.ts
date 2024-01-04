import express, { NextFunction, Request, Response } from "express";
import { Server, createServer } from "http";
import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { MyContext } from "./utils/context";
import { connectDatabase } from "./db";
import { StatusResolver } from "./resolvers/status.resolver";

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
    this.server = createServer(this.host);

    try {
      const apolloServer = new ApolloServer({
        schema: await buildSchema({
          resolvers: [StatusResolver],
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
