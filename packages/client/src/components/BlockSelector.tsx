import {
  Block,
  blockTypes,
  BlockTypeSlug,
  blockTypeSlugs,
} from '@big-yikes/lib';
import { useBinStore } from '../stores/bin.store';
import { useTentativeStore } from '../stores/tentative.store';
import { CANVAS_WIDTH, GRID_BORDER_WIDTH } from '../utils/dimensions';

export const BlockSelector = () => {
  return (
    <div
      className="flex justify-between p-2 border-solid border-primary"
      style={{ width: CANVAS_WIDTH, borderWidth: GRID_BORDER_WIDTH }}
    >
      {blockTypeSlugs.map((slug) => (
        <BlockSelectorOption key={slug} blockType={slug} />
      ))}
    </div>
  );
};

const BlockSelectorOption = ({ blockType }: { blockType: BlockTypeSlug }) => {
  const { bin } = useBinStore((state) => ({ bin: state.bin }));

  const { activeBlockType, setBlockType } = useTentativeStore((state) => ({
    activeBlockType: state.blockType,
    setBlockType: state.setBlockType,
  }));

  const size = 80;

  const block = new Block(blockType, { x: 0, y: 0 });
  const blockWidth = block.bounds.maxX + 1 - block.bounds.minX;

  const isRightAligned = block.coordinates.find((coord) => coord.x < 0);

  const borderColor =
    blockType === activeBlockType ? 'border-primary' : 'border-transparent';

  return (
    <div
      className={`border-2 p-2 pb-0 border-dashed ${borderColor} rounded-md`}
    >
      <button onClick={() => setBlockType(blockType)}>
        <svg
          width={size}
          height={size}
          viewBox={'0 0 6 6'}
          fill={blockTypes[blockType].color}
          stroke={blockTypes[blockType].color}
          strokeWidth="0.1"
        >
          {block.coordinates.map((coord) => (
            <rect
              key={`${coord.x}-${coord.y}`}
              x={
                2 * (coord.x + 1) -
                (blockWidth === 2 ? 1 : 0) +
                (blockWidth === 2 && isRightAligned ? 2 : 0)
              }
              y={6 - 2 * coord.y - 2}
              width="2"
              height="2"
            />
          ))}
        </svg>
      </button>
      <p className="text-center text-primary">{bin[blockType]}</p>
    </div>
  );
};
