import { useAuth0 } from '@auth0/auth0-react';
import { Button } from './Button';

export const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const contents = isAuthenticated ? 'SIGN OUT' : 'SIGN UP/IN';
  const handler = isAuthenticated
    ? () => logout({ returnTo: window.location.origin })
    : () => loginWithRedirect();

  return <Button onClick={handler}>{contents}</Button>;
};
