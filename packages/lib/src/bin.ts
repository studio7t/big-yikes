import { BlockTypeSlug } from './block-types';

export type Bin = Record<BlockTypeSlug, number>;

export const defaultBin: Bin = {
  T: 100,
  '1x2': 100,
  L: 100,
  '1x1': 100,
  J: 100,
  'TR-corner': 100,
  'TL-corner': 100,
  '2x2': 100,
};
