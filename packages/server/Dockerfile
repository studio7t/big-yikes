# Builder
FROM node:16-alpine

# build lib
WORKDIR /usr/src/app/lib

COPY ./packages/lib/package.json ./
COPY ./packages/lib/yarn.lock ./
RUN yarn --no-progress --frozen-lockfile

COPY ./packages/lib ./
RUN yarn build

# build server
WORKDIR /usr/src/app/server

COPY ./packages/server/package.json ./
COPY ./packages/server/yarn.lock ./
RUN yarn --no-progress --frozen-lockfile

COPY ./packages/server ./
RUN yarn build

EXPOSE 3001
CMD [ "yarn", "start" ]
