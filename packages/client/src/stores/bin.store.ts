import { Bin, BlockTypeSlug, defaultBin } from '@big-yikes/lib';
import create from 'zustand';
import { HistoryAction } from './history';

interface BinState {
  bin: Bin;
  addToBin: (blockType: BlockTypeSlug, count?: number) => HistoryAction;
  removeFromBin: (blockType: BlockTypeSlug, count?: number) => HistoryAction;
}

export const useBinStore = create<BinState>((set, get) => ({
  bin: defaultBin,
  addToBin: (blockType: BlockTypeSlug, count = 1) => {
    const forward = () => {
      const { bin } = get();
      set({ bin: { ...bin, [blockType]: bin[blockType] + count } });
    };

    const backward = () => {
      get().removeFromBin(blockType, count);
    };

    forward();

    return { forward, backward };
  },
  removeFromBin: (blockType: BlockTypeSlug, count = 1) => {
    const forward = () => {
      const { bin } = get();
      set({
        bin: { ...bin, [blockType]: Math.max(bin[blockType] - count, 0) },
      });
    };

    const backward = () => {
      get().addToBin(blockType, count);
    };

    forward();

    return { forward, backward };
  },
}));
