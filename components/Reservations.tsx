/// <reference path="../typings/reservations.d.ts" />
import { ApolloConsumer } from 'react-apollo'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { IReservation } from "reservations-types";

import './Reservations.scss';
import ApolloClient from "apollo-client/ApolloClient";
import {FormEvent} from "react";

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
export const ReservationDate = ({ date }) => {
  if(typeof date === 'string') {
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

function handleCreateClick(event: FormEvent, client: ApolloClient<any>) {
  event.preventDefault();
  const form = (event.target as HTMLFormElement);
  // @ts-ignore
  const formData = new FormData(form);
  // @ts-ignore
  form.reset();

  createReservation({
    name: formData.get('name'),
    hotelName: formData.get('hotelName'),
    arrivalDate: formData.get('arrivalDate'),
    departureDate: formData.get('departureDate'),
  }, client);
}

export default function Reservations() {
  return (
    <Query query={reservationsQuery} variables={reservationsVars}>
      {({ loading, error, data: { reservations } }) => {
        if (error) return (
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
                {client => (
                  <form className="Form" onSubmit={event => handleCreateClick(event, client)}>
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
                )}
              </ApolloConsumer>
            </div>
            <div className="ReservationsList">
              {reservations.map(
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

function createReservation({ name, hotelName, arrivalDate, departureDate }, client) {
  client.mutate({
    mutation: reservationsMutation,
    variables: {
      name,
      hotelName,
      arrivalDate,
      departureDate,
    },
    update: (proxy, { data: { reservation } }) => {
      const data = proxy.readQuery({
        query: reservationsQuery,
        variables: reservationsVars
      })
      proxy.writeQuery({
        query: reservationsQuery,
        data: {
          ...data,
          reservations: [reservation, ...data.reservations]
        },
        variables: reservationsVars
      })
    }
  });
}