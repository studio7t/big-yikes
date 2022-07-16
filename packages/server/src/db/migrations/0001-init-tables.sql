-- CREATE TABLE IF NOT EXISTS users (
--   id text PRIMARY KEY
-- );

-- CREATE TABLE IF NOT EXISTS saves (
--   id serial PRIMARY KEY,
--   user_id text NOT NULL REFERENCES users (id),
--   structure text NOT NULL,
--   time timestamptz
-- );

CREATE TABLE IF NOT EXISTS big_yikes (
  id serial PRIMARY KEY,
  structure text NOT NULL,
  hash text
);

-- CREATE TABLE IF NOT EXISTS discoveries (
--   user_id text NOT NULL REFERENCES users (id),
--   big_yikes_id integer NOT NULL REFERENCES big_yikes (id),
--   time timestamptz
-- );
