import { useAuth0 } from '@auth0/auth0-react';

export const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return !isAuthenticated ? (
    <button className="underline" onClick={() => loginWithRedirect()}>
      Log In
    </button>
  ) : (
    <button
      className="underline"
      onClick={() => logout({ returnTo: window.location.origin })}
    >
      Log Out
    </button>
  );
};
