import { Bin, BlockTypeSlug, defaultBin } from '@big-yikes/lib';
import create from 'zustand';

interface BinState {
  bin: Bin;
  addToBin: (blockType: BlockTypeSlug, count?: number) => void;
  removeFromBin: (blockType: BlockTypeSlug, count?: number) => void;
}

export const useBinStore = create<BinState>((set, get) => ({
  bin: defaultBin,
  addToBin: (blockType: BlockTypeSlug, count = 1) => {
    const { bin } = get();
    set({ bin: { ...bin, [blockType]: bin[blockType] + count } });
  },
  removeFromBin: (blockType: BlockTypeSlug, count = 1) => {
    const { bin } = get();
    set({ bin: { ...bin, [blockType]: Math.max(bin[blockType] - count, 0) } });
  },
}));
