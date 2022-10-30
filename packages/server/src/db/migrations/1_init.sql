CREATE TABLE IF NOT EXISTS structures (
  id SERIAL PRIMARY KEY,
  hash TEXT NOT NULL,
  blocks jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS discoveries (
  id SERIAL PRIMARY KEY,
  structure_id INTEGER REFERENCES structures(id) NOT NULL,
  username TEXT NOT NULL,
  time BIGINT NOT NULL
);

