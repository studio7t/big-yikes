import { AuthButton } from './components/AuthButton';
import { BlockSelector } from './components/BlockSelector';
import { Canvas } from './components/Canvas';
import { Discoveries } from './components/Discoveries';

const App = () => {
  return (
    <div className="p-2">
      <AuthButton />
      <h2 className="text-5xl mt-3 mb-6">Find a big yikes!</h2>
      <div className="flex">
        <BlockSelector />
        <Canvas />
      </div>
      <Discoveries />
    </div>
  );
};

export default App;
