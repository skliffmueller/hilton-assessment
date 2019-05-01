import * as request from 'supertest';

import Server from '../server'

const server = new Server((req, res) => {return Promise.resolve()});

const reservationData = {
  name: 'Test name',
  hotelName: 'Test Hotel',
  arrivalDate: '2019-04-06T06:00:00.000Z',
  departureDate: '2019-04-07T06:00:00.000Z',
};

const reservationsMutation = `
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

const reservationQuery = `
  query getReservation($id: Int!) {
    reservation(
      id: $id
    ) {
      id,
      name,
      hotelName,
      arrivalDate,
      departureDate
    }
  }
`;

const reservationsQuery = `
  query getReservations($sortField: ReservationSortField, $sortOrder: SortOrder) {
    reservations(
      sortField: $sortField,
      sortOrder: $sortOrder
    ) {
      id,
      name,
      hotelName,
      arrivalDate,
      departureDate
    }
  }
`;

describe('Test /graphql Reservations', () => {
  it('Mutation reservation(\<reservation\>)', async () => {
    await request(server.app)
      .post('/graphql')
      .send({
        operationName: 'createReservation',
        query: reservationsMutation,
        variables: reservationData
      })
      .expect(200, {
        data: {
          reservation: {
            id: 1,
            ...reservationData
          }
        }
      });
  });

  it('Query reservation(id)', async () => {
    await request(server.app)
      .post('/graphql')
      .send({
        operationName: 'getReservation',
        query: reservationQuery,
        variables: {
          id: 1
        }
      })
      .expect(200, {
        data: {
          reservation: {
            id: 1,
            ...reservationData
          }
        }
      });
  });

  it('Query reservations(sortField, sortOrder)', async () => {
    await request(server.app)
      .post('/graphql')
      .send({
        operationName: 'getReservations',
        query: reservationsQuery,
        variables: {
          sortField: 'id',
          sortOrder: 'DESC'
        }
      })
      .expect(200, {
        data: {
          reservations: [{
            id: 1,
            ...reservationData
          }]
        }
      });
  });
});