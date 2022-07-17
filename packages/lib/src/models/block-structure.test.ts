import { blockTypes } from '../test/data';
import { Block } from './block';
import { blockStructure } from './block-structure';

const blocks1 = [
  new Block(blockTypes['1x1'], { x: 0, y: 0 }),
  new Block(blockTypes['1x2'], { x: 1, y: 0 }),
];

const blocks2 = [
  new Block(blockTypes['1x2'], { x: 1, y: 0 }),
  new Block(blockTypes['1x1'], { x: 0, y: 0 }),
];

const blocks3 = [
  new Block(blockTypes['1x1'], { x: 0, y: 0 }),
  new Block(blockTypes['1x1'], { x: 1, y: 0 }),
  new Block(blockTypes['1x1'], { x: 1, y: 1 }),
];

describe('blockStructure', () => {
  it('converts block arrays to a unique set', () => {
    expect(blockStructure(blocks1)).toEqual(
      new Set([
        { type: blocks1[0].type.color, position: blocks1[0].position },
        { type: blocks1[1].type.color, position: blocks1[1].position },
      ])
    );
    expect(blockStructure(blocks1)).toEqual(blockStructure(blocks2));
    expect(blockStructure(blocks1)).not.toEqual(blockStructure(blocks3));
  });
});
