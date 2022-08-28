import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useProjectStore } from '../stores/project.store';

export const useSubmitDiscoveries = () => {
  const structure = useProjectStore((state) => state.structure);
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const submitDiscovery = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await fetch(`${import.meta.env.VITE_API_HOST}/discovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ blocks: structure.blocks }),
      });

      const discoveries = await res.json();
      console.log(discoveries);
    };

    if (structure.isDiscovery()) submitDiscovery();
  }, [structure]);
};
