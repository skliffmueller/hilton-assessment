FROM node:8.16.0-stretch-slim

WORKDIR /srv/app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package.json first so npm install can be cached and skipped if we only update src files
ADD ./package.json .
RUN npm install

# Everything except from .dockerignore is copied
ADD ./ .

# webpack build
RUN npm run build

EXPOSE 3000

CMD npm run start
