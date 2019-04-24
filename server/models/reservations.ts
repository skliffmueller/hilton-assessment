import { IReservation, ICreateReservation, IGetReservationsOptions } from "reservations-types";

class ReservationsModel {
  public lastId: number;
  public reservations: IReservation[];

  constructor() {
    this.lastId = 1;
    this.reservations = [];
  }
  createReservation(body: ICreateReservation): IReservation {
    const reservation = {
      id: this.lastId++,
      ...body,
    };
    this.reservations.push(reservation);
    return reservation;
  }
  getReservations(options: IGetReservationsOptions): IReservation[] {
    const { sortField, sortOrder } = options;
    let response = this.reservations.sort((a, b) => (sortOrder === 'DESC' ? b.id - a.id : a.id - b.id));
    if(sortField && sortField !== 'id') {
      response = response.sort((a, b) => {
        if(typeof a[sortField] === 'string') {
          a[sortField] = a[sortField].toLowerCase();
        }
        if(typeof b[sortField] === 'string') {
          b[sortField] = b[sortField].toLowerCase();
        }
        if(a[sortField] - b[sortField]) {
          return sortOrder === 'DESC' ? 1 : -1;
        }
        if(a[sortField] - b[sortField]) {
          return sortOrder === 'DESC' ? -1 : 1;
        }
        return 0;
      })
    }
    return response;
  }
  getReservationById(id: number): IReservation {
    if(!id) {
      throw "id must be set";
    }
    const response = this.reservations.find(a => (a.id === id));
    if(!response) {
      throw "Reservation not found";
    }
    return response;
  }
}

export default new ReservationsModel();