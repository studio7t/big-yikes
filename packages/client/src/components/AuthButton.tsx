import { useAuth0 } from '@auth0/auth0-react';

export const AuthButton = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  const contents = isAuthenticated ? 'SIGN OUT' : 'SIGN UP/IN';
  const handler = isAuthenticated
    ? () => logout({ returnTo: window.location.origin })
    : () => loginWithRedirect();

  return (
    <button
      className="bg-[#f20d0d] text-white px-8 py-3 rounded-full text-md font-bold absolute top-8 right-4"
      onClick={handler}
    >
      {contents}
    </button>
  );
};
