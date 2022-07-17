import { Block } from '../models/block';
import { blockTypes } from '../test/data';
import { blocksSet, hashBlocks } from './hash-blocks';

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

describe('blocksSet', () => {
  it('converts block arrays to a unique set', () => {
    expect(blocksSet(blocks1)).toEqual(
      new Set([
        { type: blocks1[0].type.color, position: blocks1[0].position },
        { type: blocks1[1].type.color, position: blocks1[1].position },
      ])
    );
    expect(blocksSet(blocks1)).toEqual(blocksSet(blocks2));
    expect(blocksSet(blocks1)).not.toEqual(blocksSet(blocks3));
  });
});

describe('hashBlocks', () => {
  it('hashing an array of blocks should return a hex string', () => {
    expect(hashBlocks(blocks1)).toMatch(/^[a-f0-9]*$/);
  });

  it('two identical structures should return the same hash', () => {
    expect(hashBlocks(blocks1)).toEqual(hashBlocks(blocks2));
  });

  it('different structures should get a different hash', () => {
    expect(hashBlocks(blocks1)).not.toEqual(hashBlocks(blocks3));
  });
});
