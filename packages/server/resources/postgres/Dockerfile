FROM postgres:latest

RUN mkdir -p /docker-entrypoint-initdb.d

COPY ./resources/postgres/initdb.sql /docker-entrypoint-initdb.d
