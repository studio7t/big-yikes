import {
  Bin,
  Block,
  BlockTypeSlug,
  blockTypeSlugs,
  defaultBin,
  growBounds,
  Structure,
} from '@big-yikes/lib';
import create from 'zustand';
import snapUrl from '../assets/snap.mp3';
import { useTentativeStore } from './tentative.store';

interface ProjectState {
  bin: Bin;
  structure: Structure;
  addToBin: (blockType: BlockTypeSlug, count?: number) => void;
  removeFromBin: (blockType: BlockTypeSlug, count?: number) => void;
  addBlockIfValid: (block: Block) => boolean;
  removeBlockIfValid: (block: Block) => boolean;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  bin: defaultBin,
  structure: new Structure([]),
  addToBin: (blockType: BlockTypeSlug, count = 1) => {
    const { bin } = get();
    set({ bin: { ...bin, [blockType]: bin[blockType] + count } });
  },
  removeFromBin: (blockType: BlockTypeSlug, count = 1) => {
    const { bin } = get();

    if (bin[blockType] - count <= 0) {
      const blockTypeIndex = blockTypeSlugs.findIndex(
        (slug) => slug === blockType
      );

      const { setBlockType } = useTentativeStore.getState();
      for (let i = 1; i < blockTypeSlugs.length; i++) {
        const nextBlockType =
          blockTypeSlugs[(blockTypeIndex + i) % blockTypeSlugs.length];
        if (bin[nextBlockType] !== 0) {
          setBlockType(nextBlockType);
          break;
        }
      }
    }
    set({ bin: { ...bin, [blockType]: Math.max(bin[blockType] - count, 0) } });
  },
  addBlockIfValid: (block: Block) => {
    const { bin, removeFromBin } = get();
    if (bin[block.type] === 0) {
      return false;
    }

    const nearbyBlocks = get().structure.getBlocksInBounds(
      growBounds(block.bounds)
    );
    if (block.isValidAndConnected(nearbyBlocks)) {
      const resultingStructure = new Structure([
        ...get().structure.blocks,
        block,
      ]);

      set({ structure: resultingStructure });
      removeFromBin(block.type);

      new Audio(snapUrl).play();

      return true;
    }

    return false;
  },
  removeBlockIfValid: (block: Block) => {
    const { addToBin } = get();
    const structure = get().structure;

    const resultingStructure = new Structure(structure.getBlocksWithout(block));

    if (resultingStructure.isValid()) {
      set({ structure: resultingStructure });
      addToBin(block.type);
      return true;
    }

    return false;
  },
}));
