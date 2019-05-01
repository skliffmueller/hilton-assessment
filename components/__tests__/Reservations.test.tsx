/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import renderer from 'react-test-renderer';
import wait from 'waait';

import Reservations, {
  reservationsQuery,
  ReservationDate,
  Reservation,
  ReservationForm,
} from '../Reservations';
import {IReservation} from "reservations-types";


const reservationData = {
  id: '1',
  name: 'Test Name',
  hotelName: 'Test Hotel',
  arrivalDate: '2019-04-06',
  departureDate: '2019-04-07',
};

const mockQuery = [
  {
    request: {
      query: reservationsQuery,
      variables: {
        sortField: 'id',
        sortOrder: 'DESC',
      },
    },
    result: {
      data: {
        reservations: [
          reservationData,
        ],
      },
    },
  },
];

describe('Reservations Component', () => {

  it('Renders form', () => {
    const reservationForm = shallow(<ReservationForm onSubmit={(event) => {}} />);

    expect(reservationForm.containsAllMatchingElements([
      <label>Full Name</label>,
      <label>Hotel Name</label>,
      <label>Arrival Date</label>,
      <label>Departure Date</label>,
    ])).toEqual(true);

    expect(
      reservationForm.find('button[type="submit"]').text()
    ).toEqual('Create Reservation');

    expect(
      reservationForm.find('input[name="name"]').props()
    ).toEqual(expect.objectContaining({
      placeholder: "Full Name",
      type: "text",
    }));

    expect(
      reservationForm.find('input[name="hotelName"]').props()
    ).toEqual(expect.objectContaining({
      placeholder: "Hotel Name",
      type: "text",
    }));

    expect(
      reservationForm.find('input[name="arrivalDate"]').props()
    ).toEqual(expect.objectContaining({
      placeholder: "Arrival Date",
      type: "date",
    }));

    expect(
      reservationForm.find('input[name="departureDate"]').props()
    ).toEqual(expect.objectContaining({
      placeholder: "Departure Date",
      type: "date",
    }));
  });

  it('Renders Reservation Date with string', () => {
    const reservationDate = shallow(<ReservationDate date={"2019-04-06"} />);

    expect(
      reservationDate.find('div.ReservationsDate-Day').text()
    ).toEqual('6');

    expect(
      reservationDate.find('div.ReservationsDate-Month').text()
    ).toEqual('Apr');

    expect(
      reservationDate.find('div.ReservationsDate-Week').text()
    ).toEqual('Sat');

  });

  it('Renders Reservation Date with Date', () => {
    const date = new Date("2019-04-06");
    const reservationDate = shallow(<ReservationDate date={date} />);

    expect(
      reservationDate.find('div.ReservationsDate-Day').text()
    ).toEqual('6');

    expect(
      reservationDate.find('div.ReservationsDate-Month').text()
    ).toEqual('Apr');

    expect(
      reservationDate.find('div.ReservationsDate-Week').text()
    ).toEqual('Sat');

  });

  it('Renders Reservation Item', () => {
    const data: IReservation = {
      id: 1,
      name: "Test Name",
      hotelName: "Test Hotel",
      arrivalDate: new Date("2019-04-06"),
      departureDate: new Date("2019-04-07"),
    };
    const reservation = shallow(<Reservation {...data} />);

    expect(
      reservation.find('.Reservation').prop('data-reservation-id')
    ).toEqual(data.id);

    expect(
      reservation.find('h4').text()
    ).toEqual(data.name);

    expect(
      reservation.find('p').text()
    ).toEqual(data.hotelName);

    expect(
      reservation.find('div.Reservation-Date:first-child h5').text()
    ).toEqual('Arrive');

    expect(
      reservation.find('div.Reservation-Date:first-child ReservationDate').prop('date')
    ).toEqual(data.arrivalDate);

    expect(
      reservation.find('div.Reservation-Date:last-child ReservationDate').prop('date')
    ).toEqual(data.departureDate);

  });

  it('Renders Reservation List from Mock Query', async () => {
    const reservations = renderer.create((
      <MockedProvider mocks={mockQuery} addTypename={false}>
        <Reservations />
      </MockedProvider>
    ));

    await wait(0);

    expect(
      reservations.root.findByType(Reservation).props
    ).toEqual(
      expect.objectContaining({
        ...reservationData
      })
    );

  });
});