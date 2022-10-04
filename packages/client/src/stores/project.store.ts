import { Block, growBounds, Structure } from '@big-yikes/lib';
import create from 'zustand';
import { useBinStore } from './bin.store';
import { HistoryAction } from './history';

interface ProjectState {
  structure: Structure;
  addBlock: (block: Block) => HistoryAction;
  removeBlock: (block: Block) => HistoryAction;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  structure: new Structure([]),
  addBlock: (block: Block) => {
    const forward = () =>
      set({ structure: get().structure.withBlockAdded(block) });

    const backward = () => get().removeBlock(block);

    forward();

    return { forward, backward };
  },
  removeBlock: (block: Block) => {
    const forward = () =>
      set({ structure: get().structure.withBlockRemoved(block) });

    const backward = () => get().addBlock(block);

    forward();

    return { forward, backward };
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
