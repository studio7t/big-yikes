import { Block, BlockTypeSlug } from '@big-yikes/lib';
import create from 'zustand';

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
