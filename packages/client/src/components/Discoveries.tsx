import { useAuth0 } from '@auth0/auth0-react';
import { useDiscoveries } from '../hooks/discoveries';

export const Discoveries = () => {
  const { isAuthenticated } = useAuth0();
  const { isDiscovery, discoveries, error } = useDiscoveries();

  if (isDiscovery) {
    return (
      <div>
        <p>Congrats, you found a Big Yikes!</p>
        {!isAuthenticated ? (
          <p>Log in to see discoveries made by other users.</p>
        ) : error ? (
          <p>Something went wrong...</p>
        ) : (
          <ul>
            {discoveries.map((discovery) => (
              <li key={discovery.username}>
                {discovery.username}: {new Date(discovery.time).toTimeString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return null;
};
