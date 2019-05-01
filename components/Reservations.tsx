/// <reference path="../typings/reservations.d.ts" />
import React, { FormEvent } from 'react';
import { ApolloConsumer, Query, QueryResult } from 'react-apollo';
import { NormalizedCacheObject, ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag'

import {ICreateReservation, IReservation} from "reservations-types";

import './Reservations.scss';


export const reservationsQuery = gql`
  query getReservations($sortField: ReservationSortField, $sortOrder: SortOrder) {
    reservations(sortField: $sortField, sortOrder: $sortOrder) {
      id,
      name,
      hotelName,
      arrivalDate,
      departureDate
    }
  }
`;

export const reservationsMutation = gql`
  mutation createReservation($name: String!, $hotelName: String!, $arrivalDate: GraphQLDate!, $departureDate: GraphQLDate!) {
    reservation(
      name: $name,
      hotelName: $hotelName,
      arrivalDate: $arrivalDate,
      departureDate: $departureDate
    ) {
      id,
      name,
      hotelName,
      arrivalDate,
      departureDate
    }
  }
`;

export const reservationsVars = {
  sortField:'id',
  sortOrder:'DESC',
};
const weekIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface IReservationDate {
  date: string | number | Date;
}

export const ReservationDate = ({ date }: IReservationDate) => {
  if(typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  const day = date.getUTCDate();
  const month = monthIndex[date.getUTCMonth()];
  const week = weekIndex[date.getUTCDay()];
  return (
    <div className="ReservationsDate">
      <div className="ReservationsDate-Day">{day}</div>
      <div className="ReservationsDate-Stack">
        <div className="ReservationsDate-Month">{month}</div>
        <div className="ReservationsDate-Week">{week}</div>
      </div>
    </div>
  )
}

export const Reservation = ({ id, name, hotelName, arrivalDate, departureDate }: IReservation) => {
  return (
    <div className="Reservation" data-reservation-id={id}>
      <div className="Reservation-Content">
        <h4>{name}</h4>
        <p>{hotelName}</p>
      </div>
      <div className="Reservation-Dates">
        <div className="Reservation-Date">
          <h5>Arrive</h5>
          <ReservationDate date={arrivalDate} />
        </div>
        <div className="Reservation-Date">
          <h5>Depart</h5>
          <ReservationDate date={departureDate} />
        </div>
      </div>
    </div>
  )
}

export interface IReservationForm {
  onSubmit: (event: FormEvent) => void;
}

export const ReservationForm = ({ onSubmit }: IReservationForm) => {
  return (
    <form className="Form" onSubmit={onSubmit}>
      <div className="Form-element">
        <label>Full Name</label>
        <input type="text" name="name" placeholder="Full Name" />
      </div>
      <div className="Form-element">
        <label>Hotel Name</label>
        <input type="text" name="hotelName" placeholder="Hotel Name" />
      </div>

      <div className="Form-date">
        <div className="Form-column">
          <label>Arrival Date</label>
          <input type="date" name="arrivalDate" placeholder="Arrival Date" />
        </div>
        <div className="Form-column">
          <label>Departure Date</label>
          <input type="date" name="departureDate" placeholder="Departure Date" />
        </div>
      </div>

      <div className="Form-button">
        <button type="submit">Create Reservation</button>
      </div>
    </form>
  );
}

function handleCreateClick(event: FormEvent, client: ApolloClient<NormalizedCacheObject>) {
  event.preventDefault();
  const form = (event.target as HTMLFormElement);
  const formData = new FormData(form);
  form.reset();

  let invalid = false;
  const parsedData: ICreateReservation = {
    name: '',
    hotelName: '',
    arrivalDate: '',
    departureDate: '',
  };
  Object.keys(parsedData).forEach(key => {
    const value = formData.get(key);
    if(value && typeof value === 'string') {
      (parsedData as any)[key] = value;
    } else {
      invalid = true;
    }
  });
  if(!invalid) {
    createReservation(parsedData, client);
  }
}

export interface IReservationsResult {
  reservations: IReservation[];
}

export default function Reservations() {
  return (
    <Query query={reservationsQuery} variables={reservationsVars}>
      {({ loading, error, networkStatus, data }: QueryResult<IReservationsResult>) => {
        if (error || !data) return (
          <div className="Reservations">
            <h5>Error</h5>
          </div>
        );
        if (loading) return (
          <div className="Reservations">
            <h5>Loading</h5>
          </div>
        );

        return (
          <div className="Reservations">
            <div className="ReservationTools">
              <ApolloConsumer>
                {client => (<ReservationForm onSubmit={(event: FormEvent) => handleCreateClick(event, client)} />)}
              </ApolloConsumer>
            </div>
            <div className="ReservationsList">
              {data.reservations.map(
                (reservation) =>
                  (<Reservation key={reservation.id} {...reservation} />)
              )}
            </div>
          </div>
        )
      }}
    </Query>
  )
}
export interface ICreateReservationMutation {
  reservation: IReservation;
}

function createReservation({ name, hotelName, arrivalDate, departureDate }: ICreateReservation, client: ApolloClient<any>) {
  client.mutate<ICreateReservationMutation>({
    mutation: reservationsMutation,
    variables: {
      name,
      hotelName,
      arrivalDate,
      departureDate,
    },
    update: (proxy, { data }) => {
      if(data) {
        const { reservation } = data;
        const prevData = proxy.readQuery<IReservationsResult>({
          query: reservationsQuery,
          variables: reservationsVars,
        });
        if(prevData) {
          proxy.writeQuery<IReservationsResult>({
            query: reservationsQuery,
            data: {
              ...data,
              reservations: [reservation, ...prevData.reservations]
            },
            variables: reservationsVars,
          })
        }
      }
    }
  });
}