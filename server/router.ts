import * as express from 'express'
import { Application } from 'express'
import API from './api/index'


class Router {
  public router;
  public api;

  constructor() {
    this.router = express.Router();
    this.api = new API(this.router);
  }

  mount(app: Application) {
    this.api.mount();
    app.use('/api', this.api.router);
  }
}

export default Router;
