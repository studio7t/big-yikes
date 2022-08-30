# Builder
FROM node:16-alpine

# build lib
WORKDIR /usr/src/app/lib

COPY ./packages/lib ./

RUN yarn --no-progress --frozen-lockfile
RUN yarn build

# build server
WORKDIR /usr/src/app/server

COPY ./packages/server ./

RUN yarn --no-progress --frozen-lockfile
RUN yarn build

EXPOSE 3001
CMD [ "yarn", "start" ]
