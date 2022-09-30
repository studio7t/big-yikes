import { AuthButton } from './components/AuthButton';
import { Canvas } from './components/Canvas';
import { Discoveries } from './components/Discoveries';

const App = () => {
  return (
    <div className="p-8">
      <AuthButton />
      <h1>Big Yikes</h1>
      <h2>can you make a big yikes?</h2>

      <div className="flex justify-center select-none">
        <Canvas />
      </div>

      <Discoveries />
    </div>
  );
};

export default App;
