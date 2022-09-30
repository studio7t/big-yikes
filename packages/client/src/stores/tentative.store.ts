import { Block, BlockTypeSlug, growBounds } from '@big-yikes/lib';
import p5Types from 'p5';
import create from 'zustand';
import tickUrl from '../assets/tick.mp3';
import { snapMouseToGridCoords } from '../utils/coord-conversion';
import { isMouseInCanvas } from '../utils/mouse-in-canvas';
import { useProjectStore } from './project.store';

interface TentativeState {
  hoveringBlock: Block | null;
  blockType: BlockTypeSlug;
  updateHoveringBlock: (p5: p5Types) => void;
  setBlockType: (blockType: BlockTypeSlug) => void;
}

export const useTentativeStore = create<TentativeState>((set, get) => ({
  hoveringBlock: null,
  blockType: '1x1',
  updateHoveringBlock: (p5: p5Types) => {
    const { blockType, hoveringBlock } = get();
    const { bin } = useProjectStore.getState();

    if (bin[blockType] === 0 || !isMouseInCanvas(p5)) {
      if (hoveringBlock) set({ hoveringBlock: null });
      return;
    }

    const snappedMousePos = snapMouseToGridCoords(p5);
    const potentialBlock = new Block(blockType, snappedMousePos);
    const structure = useProjectStore.getState().structure;
    const nearbyBlocks = structure.getBlocksInBounds(
      growBounds(potentialBlock.bounds)
    );

    if (potentialBlock.isValidAndConnected(nearbyBlocks)) {
      set({ hoveringBlock: potentialBlock });
      new Audio(tickUrl).play();
    } else {
      set({ hoveringBlock: null });
    }
  },
  setBlockType: (blockType: BlockTypeSlug) => set({ blockType }),
}));