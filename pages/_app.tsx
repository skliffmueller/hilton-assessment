import React from 'react';
import { ApolloProvider } from 'react-apollo';
import {AppProps, Container, DefaultAppIProps} from 'next/app';

import withApolloClient, {IApolloProps} from '../lib/with-apollo-client';


class MyApp extends React.Component<IApolloProps & DefaultAppIProps & AppProps> {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}

export default withApolloClient(MyApp);
