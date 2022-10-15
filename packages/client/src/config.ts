/**
 * Extracts config values from process in dev and from the environment.js file in production.
 * Please add any updates to `./entrypoint.sh`, `./.env.example`, and here.
 */
declare global {
  // eslint-disable-next-line no-var
  var env: {
    auth: {
      auth0Audience: string;
      auth0ClientId: string;
      auth0Domain: string;
    };
    hosts: {
      api: string;
    };
  };
}

export default globalThis.env || {
  auth: {
    auth0Audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    auth0ClientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    auth0Domain: import.meta.env.VITE_AUTH0_DOMAIN,
  },
  hosts: {
    api: import.meta.env.VITE_API_HOST,
  },
};
