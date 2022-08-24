import { BinCounts } from './components/BinCounts';
import { Canvas } from './components/Canvas';
import { LoginButton } from './components/LoginButton';
import { LogoutButton } from './components/LogoutButton';

const App = () => {
  return (
    <div>
      <LoginButton />
      <LogoutButton />
      <Canvas />
      <BinCounts />
    </div>
  );
};

export default App;
