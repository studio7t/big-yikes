import { Block } from '../models/block';
import objectHash from 'object-hash';

export const hashBlocks = (blocks: Block[]) => {
  const blocksSet = new Set(
    blocks.map((b) => {
      // TODO replace type identifier with something more reliable
      return { type: b.type.color, position: b.position };
    })
  );

  return objectHash(blocksSet);
};
