CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS block_types (
  id serial PRIMARY KEY,
  coords text NOT NULL,
  color text NOT NULL
);

CREATE TABLE IF NOT EXISTS bins (
  id serial PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS bin_entries (
  id serial PRIMARY KEY,
  block_type_id integer NOT NULL REFERENCES block_types (id),
  count integer,
  bin_id integer NOT NULL REFERENCES bins (id)
);

CREATE TABLE IF NOT EXISTS structures (
  id serial PRIMARY KEY,
  hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS blocks (
  id serial PRIMARY KEY,
  position_x integer NOT NULL,
  position_y integer NOT NULL,
  block_type_id integer NOT NULL REFERENCES block_types (id),
  structure_id integer NOT NULL REFERENCES structures (id)
);

CREATE TABLE IF NOT EXISTS projects (
  id serial PRIMARY KEY,
  structure_id integer NOT NULL REFERENCES structures (id),
  bin_id integer NOT NULL REFERENCES bins (id)
);

CREATE TABLE IF NOT EXISTS saves (
  id serial PRIMARY KEY,
  user_id text NOT NULL REFERENCES users (id),
  project_id integer NOT NULL REFERENCES projects (id)
);

CREATE TABLE IF NOT EXISTS discoveries (
  id serial PRIMARY KEY,
  structure_id integer NOT NULL REFERENCES structures (id),
  user_id text NOT NULL REFERENCES users (id),
  time timestamptz
);
