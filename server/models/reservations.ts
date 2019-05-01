/// <reference path="../../typings/reservations.d.ts" />
import { IReservation, ICreateReservation, IGetReservationsOptions } from 'reservations-types';

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
        let sortNumber = 0;
        let aValue = a[sortField];
        let bValue = b[sortField];
        if(typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
          sortNumber = bValue.localeCompare(aValue);
        }
        if(typeof aValue === 'number' && typeof bValue === 'number') {
          sortNumber = aValue - bValue;
        }
        return sortNumber * (sortOrder === 'DESC' ? 1 : -1)
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