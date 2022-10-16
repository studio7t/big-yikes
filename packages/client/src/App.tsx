import { AuthButton } from './components/AuthButton';
import { BlockSelector } from './components/BlockSelector';
import { Board } from './components/Board';
import { Discoveries } from './components/Discoveries';

// TODO add auth loading state
const App = () => {
  return (
    <div className="p-4 pb-0">
      <div className="absolute top-8 right-4">
        <AuthButton />
      </div>
      <h1 className="font-leisure text-[140px] text-primary leading-none text-center mb-[-35px]">
        Big Yikes
      </h1>
      <h2 className="font-courier text-primary text-[26px] text-center m-3">
        can you find a big yikes?
      </h2>

      <div className="flex flex-col space-y-4 items-center select-none">
        <div className="relative">
          <Discoveries />
          <Board />
        </div>
        <BlockSelector />
      </div>
    </div>
  );
};

export default App;
