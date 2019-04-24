declare module "reservations-types" {
  export interface IReservation {
    id: number,
    name: string,
    hotelName: string,
    arrivalDate: Date,
    departureDate: Date,
  }

  export interface ICreateReservation {
    name: string,
    hotelName: string,
    arrivalDate: Date,
    departureDate: Date,
  }

  export interface IGetReservationsOptions {
    sortField?: string,
    sortOrder?: string,
  }
}
