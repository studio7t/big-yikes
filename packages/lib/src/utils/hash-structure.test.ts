import { Block } from '../models/block';
import { blockStructure } from '../models/block-structure';
import { blockTypes } from '../test/data';
import { hashStructure } from './hash-structure';

const structure1 = blockStructure([
  new Block(blockTypes['1x1'], { x: 0, y: 0 }),
  new Block(blockTypes['1x2'], { x: 1, y: 0 }),
]);

const structure2 = blockStructure([
  new Block(blockTypes['1x2'], { x: 1, y: 0 }),
  new Block(blockTypes['1x1'], { x: 0, y: 0 }),
]);

const structure3 = blockStructure([
  new Block(blockTypes['1x1'], { x: 0, y: 0 }),
  new Block(blockTypes['1x1'], { x: 1, y: 0 }),
  new Block(blockTypes['1x1'], { x: 1, y: 1 }),
]);

describe('hashBlocks', () => {
  it('hashing a block structure should return a hex string', () => {
    expect(hashStructure(structure1)).toMatch(/^[a-f0-9]*$/);
  });

  it('two identical structures should return the same hash', () => {
    expect(hashStructure(structure1)).toEqual(hashStructure(structure2));
  });

  it('different structures should get a different hash', () => {
    expect(hashStructure(structure1)).not.toEqual(hashStructure(structure3));
  });
});
