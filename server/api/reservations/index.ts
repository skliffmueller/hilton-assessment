import { Router } from 'express';

import ReservationsController from './controller';

class Reservations {
  public controller: ReservationsController;

  constructor() {
    this.controller = new ReservationsController();
  }

  mount(router: Router): void {
    router.get('/reservations', this.controller.getReservations);
    router.get('/reservation/:id', this.controller.getReservationById);
    router.post('/reservation', this.controller.postReservation);
  }
}


export default Reservations;