# Builder
FROM node:16-alpine as builder

# build lib
WORKDIR /usr/src/app/lib

COPY ./packages/lib ./

RUN yarn --no-progress --frozen-lockfile
RUN yarn build

# build client
WORKDIR /usr/src/app/client

COPY ./packages/client ./

RUN yarn --no-progress --frozen-lockfile
RUN yarn build


FROM nginx:1.23-alpine as runner

COPY --from=builder /usr/src/app/client/dist /usr/share/nginx/html

EXPOSE 80
