import { useAuth0 } from '@auth0/auth0-react';
import { format } from 'date-fns';
import { ReactNode } from 'react';
import { useDiscoveries } from '../hooks/discoveries';
import { useDiscoveryStore } from '../stores/discovery.store';
import { history } from '../stores/history';
import { useProjectStore } from '../stores/project.store';
import {
  CANVAS_BUFFER,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  GRID_BORDER_WIDTH,
} from '../utils/dimensions';
import { Button } from './Button';

export const Discoveries = () => {
  useDiscoveries();
  const { isAuthenticated } = useAuth0();
  const { isDiscovery, setIsDiscovery, error, isLoading } = useDiscoveryStore(
    (state) => ({
      isDiscovery: state.isDiscovery,
      setIsDiscovery: state.setIsDiscovery,
      error: state.error,
      isLoading: state.isLoading,
    })
  );
  const { clear } = useProjectStore((state) => ({ clear: state.clear }));

  const restart = () => {
    clear();
    history.reset();
  };

  return isDiscovery ? (
    <div
      className="absolute bg-white bg-opacity-90 top-0 left-0"
      style={{
        margin: CANVAS_BUFFER + GRID_BORDER_WIDTH / 2,
        width: CANVAS_WIDTH - GRID_BORDER_WIDTH,
        height: CANVAS_HEIGHT - GRID_BORDER_WIDTH,
      }}
    >
      <div className="flex flex-col justify-between items-center h-full p-4">
        <div className="text-primary">
          <h2 className="text-2xl font-ptsans-bold text-center mb-4 tracking-wider">
            YOU FOUND A BIG YIKES.
          </h2>
          {!isAuthenticated ? (
            <StatusMessage>
              log in to see discoveries made by other users
            </StatusMessage>
          ) : error ? (
            <StatusMessage>something went wrong...</StatusMessage>
          ) : isLoading ? (
            <StatusMessage>loading...</StatusMessage>
          ) : (
            <RecordList />
          )}
        </div>
        <div className="flex space-x-16">
          <Button onClick={() => restart()}>RESTART</Button>
          <Button onClick={() => setIsDiscovery(false)}>CONTINUE</Button>
        </div>
      </div>
    </div>
  ) : null;
};

const RecordList = () => {
  const { discoveries } = useDiscoveryStore((state) => ({
    discoveries: state.discoveries,
  }));

  return (
    <div className="h-[240px] px-8 overflow-auto">
      <table>
        <thead className="text-xl font-ptsans-bold text-left tracking-wider">
          <tr>
            <th></th>
            <th>USER</th>
            <th>FOUND ON</th>
          </tr>
        </thead>
        <tbody className="font-ptsans tracking-wider text-lg">
          {discoveries.map((discovery, index) => {
            return (
              <tr key={index}>
                <td className="pr-4">{discoveries.length - index}.</td>
                <td className="pr-8">{discovery.username}</td>
                <td>
                  {format(new Date(discovery.time), 'MMM dd yyyy, hh:MM aa')}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const StatusMessage = ({ children }: { children: ReactNode }) => {
  return (
    <p className="font-ptsans text-xl tracking-wider text-center">{children}</p>
  );
};
