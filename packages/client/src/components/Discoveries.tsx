import { useDiscoveries } from '../hooks/discoveries';

export const Discoveries = () => {
  const { isDiscovery, isAuthenticated, discoveries } = useDiscoveries();

  if (isDiscovery) {
    if (isAuthenticated) {
      return (
        <ul>
          {discoveries.map((discovery) => (
            <li key={discovery.username}>
              {discovery.username}: {new Date(discovery.time).toTimeString()}
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <p>Congrats, you found a Big Yikes! Log in to submit your discovery.</p>
      );
    }
  }

  return null;
};
