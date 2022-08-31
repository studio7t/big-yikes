import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();

  return isAuthenticated ? (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  ) : null;
};
