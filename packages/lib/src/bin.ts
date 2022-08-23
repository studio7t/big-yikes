import { BlockTypeSlug } from './block-types';

export type Bin = Record<BlockTypeSlug, number>;

export const defaultBin: Bin = {
  '1x1': 20,
  '1x2': 10,
};
