import {
  Block,
  blockTypes,
  BlockTypeSlug,
  blockTypeSlugs,
} from '@big-yikes/lib';
import { useProjectStore } from '../stores/project.store';
import { useTentativeState } from '../stores/tentative.store';

const BlockSelectorOption = ({ blockType }: { blockType: BlockTypeSlug }) => {
  const { bin } = useProjectStore((state) => ({ bin: state.bin }));

  const { activeBlockType, setBlockType } = useTentativeState((state) => ({
    activeBlockType: state.blockType,
    setBlockType: state.setBlockType,
  }));

  const size = 80;

  const block = new Block(blockType, { x: 0, y: 0 });
  const blockWidth = block.bounds.maxX + 1 - block.bounds.minX;
  const blockHeight = block.bounds.maxY + 1 - block.bounds.minY;

  const borderColor =
    blockType === activeBlockType ? 'border-gray-500' : 'border-transparent';

  return (
    <div className={`border-2 border-dashed ${borderColor} rounded-md`}>
      <button className="p-2" onClick={() => setBlockType(blockType)}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${blockWidth} ${blockHeight}`}
          fill={blockTypes[blockType].color}
        >
          {block.coordinates.map((coord) => (
            <rect
              key={`${coord.x}-${coord.y}`}
              x={coord.x}
              y={blockHeight - 1 - coord.y}
              width="1"
              height="1"
            />
          ))}
        </svg>
      </button>
      <p className="text-center">{bin[blockType]}</p>
    </div>
  );
};

export const BlockSelector = () => {
  return (
    <div className="p-2 space-y-2">
      {blockTypeSlugs.map((slug) => (
        <BlockSelectorOption key={slug} blockType={slug} />
      ))}
    </div>
  );
};
