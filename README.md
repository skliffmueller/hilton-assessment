# Hilton Hotel Assessment

## Demo

You may access a running instance of the project at: http://hilton.rasterized.net

Note: Does not work on Edge/IE browser due to the use of FormData object. Would have to find an alternative.

## Before you begin

This application has been developed using node version 8.16.0. A useful utility for switching between node versions is nvm.

NVM for windows:

https://github.com/coreybutler/nvm-windows/releases

or follow the guide for all other operating systems:

https://github.com/creationix/nvm#installation-and-update

Once installed you may run `nvm install 8.16.0`

Note: Sometimes when switching versions in nvm, node-sass tends to break, to fix this just run `npm rebuild node-sass`

## Installation

Just run the following:

```bash
npm install
```

## Running the application

For running as a developer just simply run the following:

```bash
npm run dev
```

Then access the site at http://localhost:3000/

If you'd like to use a different port, simply set PORT env to the port you desire. Example:

```bash
PORT=8080 npm run dev
```

To make a production build run the following:

```bash
NODE_ENV=production npm run build
```

## Deployment

First you must build the docker image:

```bash
docker build -t hilton-app:latest .
```

To run the image, you must expose port 3000:

```bash
docker run -d -p 3000:3000 hilton-app:latest
```

You should be able to access the server at http://localhost:3000/ if running locally. Or the server you are deploying too http://<domain/ip>:3000/
