import { Bin, Block, defaultBin, growBounds, Structure } from '@big-yikes/lib';
import create from 'zustand';
import snapUrl from '../assets/snap.mp3';
import { useTentativeStore } from './tentative.store';

interface ProjectState {
  bin: Bin;
  structure: Structure;
  addBlockIfValid: (block: Block) => boolean;
  removeBlockIfValid: (block: Block) => boolean;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  bin: defaultBin,
  structure: new Structure([]),
  addBlockIfValid: (block: Block) => {
    const bin = get().bin;
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

      set({
        structure: resultingStructure,
        bin: { ...bin, [block.type]: bin[block.type] - 1 },
      });

      new Audio(snapUrl).play();

      return true;
    }

    return false;
  },
  removeBlockIfValid: (block: Block) => {
    const bin = get().bin;
    const structure = get().structure;

    const resultingStructure = new Structure(structure.getBlocksWithout(block));

    if (resultingStructure.isValid()) {
      set({
        structure: resultingStructure,
        bin: { ...bin, [block.type]: bin[block.type] + 1 },
      });

      return true;
    }

    return false;
  },
}));
