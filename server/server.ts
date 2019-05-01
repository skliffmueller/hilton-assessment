import * as express from 'express';
import { Application } from 'express';
import * as path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { Server as nextServer } from 'next';

import schema from './schemas/index';
import Router from './router';

class Server {
  public app: Application;
  public apollo: ApolloServer;
  public router: Router;
  public handler: nextServer["handleRequest"];

  constructor(nextHandler: nextServer["handleRequest"]) {
    this.handler = nextHandler;
    this.app = express();
    this.apollo = new ApolloServer({
      schema,
      playground: true,
    });
    this.router = new Router();

    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.apollo.applyMiddleware({
      app: this.app
    });
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  private routes(): void {
    this.router.mount(this.app);
    this.app.get('*', (req, res) => this.handler(req, res));
  }
}

export default Server;
