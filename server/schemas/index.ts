import { mergeSchemas } from 'graphql-tools';

import { ReservationSchema } from './reservations';

export const schema = mergeSchemas({
  schemas: [
    ReservationSchema,
  ],
});

export default schema;