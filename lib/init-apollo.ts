import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
import fetch from 'isomorphic-unfetch'

function create (initialState?) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.API_URL, // Server URL (must be absolute)
      fetch: fetch,
    }),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo (initialState?) {
    return create(initialState);
}