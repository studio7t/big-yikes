import { BlockSelector } from './components/BlockSelector';
import { Canvas } from './components/Canvas';
import { Discoveries } from './components/Discoveries';
import { LoginButton } from './components/LoginButton';
import { LogoutButton } from './components/LogoutButton';

const App = () => {
  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <div className="flex">
        <BlockSelector />
        <Canvas />
      </div>
      <Discoveries />
    </div>
  );
};

export default App;
