import { Block, growBounds, Structure } from '@big-yikes/lib';
import create from 'zustand';
import { useBinStore } from './bin.store';
import { HistoryAction } from './history';

interface ProjectState {
  structure: Structure;
  /** setStructure should only be called with an empty undo/redo stack */
  setStructure: (structure: Structure) => void;
  addBlock: (block: Block) => HistoryAction;
  removeBlock: (block: Block) => HistoryAction;
  clear: () => HistoryAction;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  structure: new Structure([]),
  setStructure: (structure: Structure) => set({ structure }),
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
  clear: () => {
    const forward = () => set({ structure: new Structure([]) });

    const beforeClear = get().structure;
    const backward = () =>
      set({ structure: new Structure(beforeClear.blocks) });

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
