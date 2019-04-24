import App, { Container } from 'next/app';
import * as React from "react";
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from "react-apollo";
import ApolloClient from "apollo-client/ApolloClient";

interface IMyApp {
  apolloClient: ApolloClient<any>;
}

class MyApp extends App<IMyApp> {
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
