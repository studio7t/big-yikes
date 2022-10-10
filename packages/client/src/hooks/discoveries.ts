import { useAuth0 } from '@auth0/auth0-react';
import { Discovery } from '@big-yikes/lib';
import { useEffect, useState } from 'react';
import config from '../config';
import { useProjectStore } from '../stores/project.store';

export const useDiscoveries = () => {
  const structure = useProjectStore((state) => state.structure);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [isDiscovery, setIsDiscovery] = useState(false);

  useEffect(() => {
    const submitDiscovery = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: config.auth.auth0Audience,
      });

      const res = await fetch(`${config.hosts.api}/discovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ blocks: structure.blocks }),
      });

      const discoveries = await res.json();
      setDiscoveries(discoveries);
    };

    setDiscoveries([]);

    if (structure.isDiscovery()) {
      setIsDiscovery(true);
      if (isAuthenticated) submitDiscovery();
    } else {
      setIsDiscovery(false);
    }
  }, [structure]);

  return { isAuthenticated, discoveries, isDiscovery };
};
