# Builder
FROM node:16-alpine as builder

# install file server dep
RUN npm install http-server -g

# build lib
WORKDIR /usr/src/app/lib

COPY ./packages/lib/package.json ./
COPY ./packages/lib/yarn.lock ./
RUN yarn --no-progress --frozen-lockfile

COPY ./packages/lib ./
RUN yarn build

# build client
WORKDIR /usr/src/app/client

COPY ./packages/client/package.json ./
COPY ./packages/client/yarn.lock ./
RUN yarn --no-progress --frozen-lockfile

COPY ./packages/client ./

CMD ["/bin/sh", "-c", "yarn build && http-server -p 80 ./dist"]

