import { useAuth0 } from '@auth0/auth0-react';
import { Discovery } from '@big-yikes/lib';
import { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/project.store';

export const useDiscoveries = () => {
  const structure = useProjectStore((state) => state.structure);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [isDiscovery, setIsDiscovery] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const submitDiscovery = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      try {
        const res = await fetch(`${import.meta.env.VITE_API_HOST}/discovery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ blocks: structure.blocks }),
        });

        if (res.ok) {
          const discoveries = await res.json();
          setDiscoveries(discoveries);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      }
    };

    setDiscoveries([]);

    if (structure.isDiscovery()) {
      setIsDiscovery(true);
      if (isAuthenticated) submitDiscovery();
    } else {
      setIsDiscovery(false);
    }
  }, [structure]);

  return { discoveries, isDiscovery, error };
};
