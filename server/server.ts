import * as express from 'express'
import * as path from 'path'
import { ApolloServer } from 'apollo-server-express'

import schema from './schemas/index'
import Router from './router'



class Server {
  public app;
  public apollo;
  public router;
  public handle;

  constructor(nextHandler) {
    this.handle = nextHandler;
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
    this.app.get('*', (req, res) => {
      return this.handle(req, res);
    })
  }
}

export default Server;
