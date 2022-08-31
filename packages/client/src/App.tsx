import { BinCounts } from './components/BinCounts';
import { Canvas } from './components/Canvas';
import { Discoveries } from './components/Discoveries';
import { LoginButton } from './components/LoginButton';
import { LogoutButton } from './components/LogoutButton';

const App = () => {
  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <Canvas />
      <BinCounts />
      <Discoveries />
    </div>
  );
};

export default App;
