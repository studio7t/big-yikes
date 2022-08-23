import { Bin, Structure, Block, defaultBin } from '@big-yikes/lib';
import create from 'zustand';

interface ProjectState {
  bin: Bin;
  structure: Structure;
  addBlockIfValid: (block: Block) => boolean;
  removeBlockIfValid: (indexInStructure: number) => boolean;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  bin: defaultBin,
  structure: new Structure([]),
  addBlockIfValid: (block: Block) => {
    const bin = get().bin;
    if (bin[block.type] === 0) {
      return false;
    }

    const resultingStructure = new Structure([
      ...get().structure.blocks,
      block,
    ]);

    if (resultingStructure.isValid()) {
      set(() => ({
        structure: resultingStructure,
        bin: { ...bin, [block.type]: bin[block.type] - 1 },
      }));
      return true;
    }

    return false;
  },
  removeBlockIfValid: (indexInStructure: number) => {
    const bin = get().bin;
    const structure = get().structure;

    const resultingStructure = new Structure([
      ...structure.blocks.slice(0, indexInStructure),
      ...structure.blocks.slice(indexInStructure + 1),
    ]);

    if (resultingStructure.isValid()) {
      const block = structure.blocks[indexInStructure];

      set(() => ({
        structure: resultingStructure,
        bin: { ...bin, [block.type]: bin[block.type] + 1 },
      }));

      return true;
    }

    return false;
  },
}));
