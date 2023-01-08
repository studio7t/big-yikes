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

// hard coding env values because lambda has no easy way to get env vars
// it's less than ideal, but nothing is secret here, so meh
export default globalThis.env || {
  auth: {
    auth0Audience:
      import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.bigyikes.ca',
    auth0ClientId:
      import.meta.env.VITE_AUTH0_CLIENT_ID ||
      'tS3GvrFqCYfvb6sDB3W4TeiJo2UcPIat',
    auth0Domain: import.meta.env.VITE_AUTH0_DOMAIN || 'sventico.auth0.com',
  },
  hosts: {
    api: import.meta.env.VITE_API_HOST || '/api',
  },
};
