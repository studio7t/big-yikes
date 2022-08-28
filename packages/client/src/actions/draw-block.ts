import { Block, blockTypes } from '@big-yikes/lib';
import p5Types from 'p5';

export const drawBlock = (p5: p5Types, block: Block) => {
  for (const coord of block.coordinates) {
    p5.fill(blockTypes[block.type].color);
    p5.rect(coord.x, coord.y, 1, 1);
  }
};
