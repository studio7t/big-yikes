import { Block, blockTypes } from '@big-yikes/lib';
import p5Types from 'p5';
import { SCALE } from '../utils/dimensions';

export const drawBlock = (
  p5: p5Types,
  block: Block,
  options = { tentative: false }
) => {
  p5.strokeWeight(1 / SCALE);

  const color = p5.color(blockTypes[block.type].color);
  if (options.tentative) color.setAlpha(130);
  p5.fill(color);

  for (const coord of block.coordinates) {
    p5.rect(coord.x, coord.y, 1, 1);
  }
};
