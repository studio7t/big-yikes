import { Discovery } from '@big-yikes/lib';
import { useDiscoveries } from '../hooks/discoveries';

export const Discoveries = () => {
  const { isDiscovery, isAuthenticated, discoveries } = useDiscoveries();

  if (isDiscovery) {
    return (
      <div>
        <p>Congrats, you found a Big Yikes!</p>
        {isAuthenticated ? <DiscoveriesList discoveries={discoveries} /> : null}
      </div>
    );
  }

  return null;
};

const DiscoveriesList = ({ discoveries }: { discoveries: Discovery[] }) => {
  return (
    <ul>
      {discoveries.map((discovery) => (
        <li key={discovery.username}>
          {discovery.username}: {new Date(discovery.time).toTimeString()}
        </li>
      ))}
    </ul>
  );
};
