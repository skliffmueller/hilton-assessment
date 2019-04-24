import { GraphQLScalarType, GraphQLEnumType } from 'graphql';
import { Kind } from 'graphql/language';

export const GraphQLDate = new GraphQLScalarType({
  name: 'GraphQLDate',
  description: 'Javascript Date object',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if(ast.kind === Kind.INT || ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
});

export const GraphQLSortOrder = new GraphQLEnumType({
  name: 'SortOrder',
  values: {
    ASC: { value: 'ASC' },
    DESC: { value: 'DESC' },
  }
});

export default {
  GraphQLDate,
  GraphQLSortOrder,
}