declare module "reservations-types" {
  export interface IReservation {
    id: number,
    name: string,
    hotelName: string,
    arrivalDate: string | number | Date,
    departureDate: string | number | Date,
  }

  export interface ICreateReservation {
    name: string,
    hotelName: string,
    arrivalDate: string | number | Date,
    departureDate: string | number | Date,
  }

  export enum ReservationFields {
    id = "id",
    name = "name",
    hotelName = "hotelName",
    arrivalDate = "arrivalDate",
    departureDate = "departureDate",
  }

  export interface IGetReservationsOptions {
    sortField?: ReservationFields,
    sortOrder?: string,
  }
}
