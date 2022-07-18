import { BlockType } from './block';

type BlockTypes = Record<string, BlockType>;
type BlockTypeCounts<T extends BlockTypes> = Record<keyof T, number>;

export class Bin<T extends BlockTypes> {
  blockTypes: T;
  counts: BlockTypeCounts<T>;

  constructor(blockTypes: T, counts: BlockTypeCounts<T>) {
    this.blockTypes = blockTypes;
    this.counts = counts;
  }

  add(blockTypeId: keyof T) {
    this.counts[blockTypeId]++;
  }

  remove(blockTypeId: keyof T) {
    this.counts[blockTypeId]--;
  }
}
