import { useAuth0 } from '@auth0/auth0-react';
import { ReactNode, useEffect, useRef, useState } from 'react';
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

// TODO human readable dates
const RecordList = () => {
  const [tableHeight, setTableHeight] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);
  const { discoveries } = useDiscoveryStore((state) => ({
    discoveries: state.discoveries,
  }));

  useEffect(() => {
    if (tableRef.current) setTableHeight(tableRef.current.offsetHeight);
  }, [tableRef, discoveries]);

  const maxTableHeight = 256;

  return (
    <div className="relative" style={{ height: `${maxTableHeight}px` }}>
      <div className="h-full overflow-scroll">
        <table ref={tableRef}>
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
                  <td>{new Date(discovery.time).toISOString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {tableHeight > maxTableHeight ? (
        <div className="absolute bottom-0 h-20 w-full bg-gradient-to-b from-transparent to-white" />
      ) : null}
    </div>
  );
};

const StatusMessage = ({ children }: { children: ReactNode }) => {
  return (
    <p className="font-ptsans text-xl tracking-wider text-center">{children}</p>
  );
};
