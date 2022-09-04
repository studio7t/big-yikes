import { Block, BlockTypeSlug, growBounds, isEqual } from '@big-yikes/lib';
import p5Types from 'p5';
import create from 'zustand';
import { isMouseInCanvas, snapMouseToGridCoords } from '../utils/mouse-to-grid';
import { useProjectStore } from './project.store';

interface TentativeState {
  hoveringBlock: Block | null;
  blockType: BlockTypeSlug;
  updateHoveringBlock: (p5: p5Types) => void;
  setBlockType: (blockType: BlockTypeSlug) => void;
}

export const useTentativeState = create<TentativeState>((set, get) => ({
  hoveringBlock: null,
  blockType: '1x1',
  updateHoveringBlock: (p5: p5Types) => {
    const { blockType, hoveringBlock } = get();

    const mouseInCanvas = isMouseInCanvas(p5);
    if (!mouseInCanvas) {
      if (hoveringBlock) set({ hoveringBlock: null });
      return;
    }

    const snappedMousePos = snapMouseToGridCoords(p5);
    if (
      hoveringBlock === null ||
      hoveringBlock.type !== blockType ||
      !isEqual(hoveringBlock.position, snappedMousePos)
    ) {
      const potentialBlock = new Block(blockType, snappedMousePos);
      const structure = useProjectStore.getState().structure;
      const nearbyBlocks = structure.getBlocksInBounds(
        growBounds(potentialBlock.bounds)
      );

      if (potentialBlock.isValidAndConnected(nearbyBlocks)) {
        set({ hoveringBlock: new Block(blockType, snappedMousePos) });
        // play sound here
      } else {
        set({ hoveringBlock: null });
      }
    }
  },
  setBlockType: (blockType: BlockTypeSlug) => set({ blockType }),
}));
