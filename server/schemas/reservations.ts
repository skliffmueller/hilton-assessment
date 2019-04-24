/// <reference path="../../typings/reservations.d.ts" />
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
} from 'graphql';
import {
  GraphQLDate,
  GraphQLSortOrder,
} from './scalars';

import { IGetReservationsOptions, IReservation } from "reservations-types";
import reservationsModel from '../models/reservations';


export const ReservationType = new GraphQLObjectType({
  name: 'Reservation',
  fields: {
    id: {
      type: GraphQLInt
    },
    name: {
      type: GraphQLString
    },
    hotelName: {
      type: GraphQLString,
    },
    arrivalDate: {
      type: GraphQLDate,
    },
    departureDate: {
      type: GraphQLDate,
    },
  },
});

export const ReservationSortFieldType = new GraphQLEnumType({
  name: 'ReservationSortField',
  values: {
    id: {value: 'id'},
    name: {value: 'name'},
    hotelName: {value: 'hotelName'},
    arrivalDate: {value: 'arrivalDate'},
    departureDate: {value: 'departureDate'},
  }
});

export const ReservationsQueryType = new GraphQLObjectType({
  name: 'ReservationsQuery',
  fields: {
    reservation:{
      type: ReservationType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt),
        }
      },
      resolve: async (rootValue, { id }) => reservationsModel.getReservationById(id),
    },
    reservations:{
      type: new GraphQLList(ReservationType),
      args: {
        sortField: {
          type: ReservationSortFieldType,
        },
        sortOrder: {
          type: GraphQLSortOrder,
        },
      },
      resolve: async (rootValue, options: IGetReservationsOptions) => reservationsModel.getReservations(options),
    },
  }
});

export const ReservationsMutationType = new GraphQLObjectType({
  name: 'ReservationsMutation',
  fields: {
    reservation:{
      type: ReservationType,
      args:{
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        hotelName: {
          type: new GraphQLNonNull(GraphQLString),
        },
        arrivalDate: {
          type: new GraphQLNonNull(GraphQLDate),
        },
        departureDate: {
          type: new GraphQLNonNull(GraphQLDate),
        },
      },
      resolve: async (rootValue, input: IReservation) => reservationsModel.createReservation(input),
    }
  }
})

export const ReservationSchema = new GraphQLSchema({
  query: ReservationsQueryType,
  mutation: ReservationsMutationType,
});