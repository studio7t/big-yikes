import { Block, growBounds, Structure } from '@big-yikes/lib';
import create from 'zustand';
import { useBinStore } from './bin.store';

interface ProjectState {
  structure: Structure;
  addBlock: (block: Block) => void;
  removeBlock: (block: Block) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  structure: new Structure([]),
  addBlock: (block: Block) => {
    set({ structure: get().structure.withBlockAdded(block) });
  },
  removeBlock: (block: Block) => {
    set({ structure: get().structure.withBlockRemoved(block) });
  },
}));

export const ableToAdd = (block: Block) => {
  const { bin } = useBinStore.getState();
  if (bin[block.type] === 0) return false;

  const nearbyBlocks = useProjectStore
    .getState()
    .structure.getBlocksInBounds(growBounds(block.bounds));

  return block.isValid(nearbyBlocks) && block.isConnected(nearbyBlocks);
};

export const ableToRemove = (block: Block) => {
  const resultingStructure = useProjectStore
    .getState()
    .structure.withBlockRemoved(block);

  return resultingStructure.isValid();
};
