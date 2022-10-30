import { useAuth0 } from '@auth0/auth0-react';
import { useBinStore } from '../stores/bin.store';
import { useProjectStore } from '../stores/project.store';
import { Button } from './Button';

export const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const { structure } = useProjectStore((state) => ({
    structure: state.structure,
  }));
  const { bin } = useBinStore((state) => ({ bin: state.bin }));

  const contents = isAuthenticated ? 'SIGN OUT' : 'SIGN UP/IN';
  const handler = isAuthenticated
    ? () => logout({ returnTo: window.location.origin })
    : () => {
        window.sessionStorage.setItem(
          'blocks',
          JSON.stringify(structure.blocks)
        );
        window.sessionStorage.setItem('bin', JSON.stringify(bin));
        loginWithRedirect();
      };

  return <Button onClick={handler}>{contents}</Button>;
};
