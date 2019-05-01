import * as request from 'supertest';

import Server from '../server'

const server = new Server((req, res) => {return Promise.resolve()});

const reservationData = {
  name: 'Test name',
  hotelName: 'Test Hotel',
  arrivalDate: '2019-04-06T06:00:00.000Z',
  departureDate: '2019-04-07T06:00:00.000Z',
};

describe('Test /api', () => {
  it('Should respond with 200 "online"', async () => {
    await request(server.app)
      .get('/api')
      .expect(200, 'online');
  });
});

describe('Test /api/reservation Endpoints', () => {
  it('POST /api/reservation', async () => {
    await request(server.app)
      .post('/api/reservation')
      .send(reservationData)
      .expect(200, {
        data: {
          reservation: {
            id: 1,
            ...reservationData
          }
        }
      });
  });
  it('GET /api/reservation/:id', async () => {
    await request(server.app)
      .get('/api/reservation/1')
      .expect(200, {
        data: {
          reservation: {
            id: 1,
            ...reservationData
          }
        }
      });
  });
  it('GET /api/reservations', async () => {
    await request(server.app)
      .get('/api/reservations')
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