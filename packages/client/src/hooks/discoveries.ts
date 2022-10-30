import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import config from '../config';
import { useDiscoveryStore } from '../stores/discovery.store';
import { useProjectStore } from '../stores/project.store';

export const useDiscoveries = () => {
  const structure = useProjectStore((state) => state.structure);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const { setDiscoveries, setError, setIsDiscovery, setIsLoading } =
    useDiscoveryStore((state) => ({
      setDiscoveries: state.setDiscoveries,
      setError: state.setError,
      setIsDiscovery: state.setIsDiscovery,
      setIsLoading: state.setIsLoading,
    }));

  useEffect(() => {
    const submitDiscovery = async () => {
      setIsLoading(true);

      const accessToken = await getAccessTokenSilently({
        audience: config.auth.auth0Audience,
      });

      try {
        const res = await fetch(`${config.hosts.api}/discovery`, {
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

      setIsLoading(false);
    };

    setDiscoveries([]);

    if (structure.isDiscovery()) {
      setIsDiscovery(true);
      if (isAuthenticated) submitDiscovery();
    } else {
      setIsDiscovery(false);
    }
  }, [structure, isAuthenticated, getAccessTokenSilently]);
};
