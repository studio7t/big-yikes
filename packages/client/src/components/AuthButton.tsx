import { useAuth0 } from '@auth0/auth0-react';
import { useProjectStore } from '../stores/project.store';
import { Button } from './Button';

export const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const { structure } = useProjectStore((state) => ({
    structure: state.structure,
  }));

  const contents = isAuthenticated ? 'SIGN OUT' : 'SIGN UP/IN';
  const handler = isAuthenticated
    ? () => logout({ returnTo: window.location.origin })
    : () => {
        window.sessionStorage.setItem(
          'blocks',
          JSON.stringify(structure.blocks)
        );
        loginWithRedirect();
      };

  return <Button onClick={handler}>{contents}</Button>;
};
