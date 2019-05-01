import { Router } from 'express';
import Reservations from './reservations/index';

class API {
  public router: Router;
  public reservations: Reservations;

  constructor(router: Router) {
    this.router = router;
    this.reservations = new Reservations();
  }

  mount(): void {
    this.router.get('/', (req, res) => res.status(200).send("online"));
    this.reservations.mount(this.router);
  }
}

export default API;