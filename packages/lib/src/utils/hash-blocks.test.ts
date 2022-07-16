import { Block } from '../models/block';
import { blockTypes } from '../test/data';
import { hashBlocks } from './hash-blocks';

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
