import { AuthButton } from './components/AuthButton';
import { BlockSelector } from './components/BlockSelector';
import { Canvas } from './components/Canvas';
import { Discoveries } from './components/Discoveries';

const App = () => {
  return (
    <div className="p-4 pb-0">
      <AuthButton />
      <h1 className="font-leisure text-[140px] text-[#f20d0d] leading-none text-center mb-[-35px]">
        Big Yikes
      </h1>
      <h2 className="font-courier text-[#f20d0d] text-[26px] text-center m-3">
        can you make a big yikes?
      </h2>

      <div className="flex flex-col space-y-4 items-center select-none">
        <Canvas />
        <BlockSelector />
      </div>

      <Discoveries />
    </div>
  );
};

export default App;
