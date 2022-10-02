import { Block, BlockTypeSlug, blockTypeSlugs } from '@big-yikes/lib';
import create from 'zustand';
import { useBinStore } from './bin.store';

interface TentativeState {
  hoveringBlock: Block | null;
  blockType: BlockTypeSlug;
  setHoveringBlock: (block: Block | null) => void;
  setBlockType: (blockType: BlockTypeSlug) => void;
}

export const useTentativeStore = create<TentativeState>((set) => ({
  hoveringBlock: null,
  blockType: '1x1',
  setHoveringBlock: (block: Block | null) => set({ hoveringBlock: block }),
  setBlockType: (blockType: BlockTypeSlug) => set({ blockType }),
}));

export const chooseNextAvailableBlockType = () => {
  const { bin } = useBinStore.getState();
  const { blockType } = useTentativeStore.getState();
  const blockTypeIndex = blockTypeSlugs.findIndex((slug) => slug === blockType);

  const { setBlockType } = useTentativeStore.getState();
  for (let i = 1; i < blockTypeSlugs.length; i++) {
    const nextBlockType =
      blockTypeSlugs[(blockTypeIndex + i) % blockTypeSlugs.length];
    if (bin[nextBlockType] !== 0) {
      setBlockType(nextBlockType);
      break;
    }
  }
};
