import { useDiscoveries } from '../hooks/discoveries';

export const Discoveries = () => {
  const { isDiscovery, isAuthenticated, discoveries } = useDiscoveries();

  if (isDiscovery) {
    return (
      <div>
        <p>Congrats, you found a Big Yikes!</p>
        {isAuthenticated ? (
          <ul>
            {discoveries.map((discovery) => (
              <li key={discovery.username}>
                {discovery.username}: {new Date(discovery.time).toTimeString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Log in to see discoveries made by other users.</p>
        )}
      </div>
    );
  }

  return null;
};
