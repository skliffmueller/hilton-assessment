import React from 'react';
import { getDataFromTree } from 'react-apollo';
import Head from 'next/head';
import { AppComponentType, AppProps, DefaultAppIProps, NextAppContext } from 'next/app';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';

import initApollo from './init-apollo'

export interface IApolloProps {
  apolloState?: NormalizedCacheObject;
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

export default (MyApp: AppComponentType<IApolloProps & DefaultAppIProps>) => {
  return class Apollo extends React.Component<IApolloProps & DefaultAppIProps & AppProps> {
    public apolloClient: ApolloClient<NormalizedCacheObject>;
    static displayName = 'withApollo(App)';
    static async getInitialProps (ctx: NextAppContext) {
      const { Component, router } = ctx;

      let appProps = {}
      if (MyApp.getInitialProps) {
        appProps = await MyApp.getInitialProps(ctx)
      }
      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apollo = initApollo();
      try {
        // Run all GraphQL queries
        await getDataFromTree(
      <MyApp
            {...appProps}
            pageProps={{}}
            Component={Component}
            router={router}
            apolloClient={apollo}
        />
      )
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        console.error('Error while running `getDataFromTree`', error)
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();


      // Extract query data from the Apollo store
      const apolloState = apollo.cache.extract();

      return {
        ...appProps,
        apolloState,
      }
    }

    constructor (props: IApolloProps & DefaultAppIProps & AppProps) {
      super(props);
      this.apolloClient = initApollo(props.apolloState);
    }

    render () {
      return <MyApp
        {...this.props}
        apolloClient={this.apolloClient}
      />
    }
  }
}