const withTypescript = require('@zeit/next-typescript');
const withSass = require('@zeit/next-sass');
module.exports = withTypescript(
  withSass(
    {
      env: {
        API_URL: process.env.NODE_ENV === 'production' ? 'http://hilton.rasterized.net/graphql' : 'http://localhost:3000/graphql'
      }
    }
  )
);