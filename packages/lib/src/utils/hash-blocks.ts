import objectHash from 'object-hash';
import { Block } from '../models/block';

export const hashBlocks = (blocks: Block[]) => {
  return objectHash(blocksSet(blocks));
};

export const blocksSet = (blocks: Block[]) => {
  return new Set(
    blocks.map((b) => {
      // TODO replace type identifier with something more reliable
      return { type: b.type.color, position: b.position };
    })
  );
};
