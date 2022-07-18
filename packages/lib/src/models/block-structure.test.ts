import { blockTypes } from '../test/data';
import { Block } from './block';
import { BlockStructure } from './block-structure';

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

const structure1 = new BlockStructure(blocks1);
const structure2 = new BlockStructure(blocks2);
const structure3 = new BlockStructure(blocks3);

describe('blockStructure', () => {
  it('converts block arrays to a unique set', () => {
    expect(structure1.fingerprintSet).toEqual(
      new Set([
        { type: blocks1[0].type.color, position: blocks1[0].position },
        { type: blocks1[1].type.color, position: blocks1[1].position },
      ])
    );
  });

  it('should have a toArray method that returns an array of blocks', () => {
    expect(new Set(structure1.blockArray)).toEqual(new Set(blocks1));
  });

  it('should have a method for checking equality with another structure', () => {
    expect(structure1.isEqual(structure2)).toEqual(true);
    expect(structure1.isEqual(structure3)).toEqual(false);
  });

  it('should compute a unique hash', () => {
    expect(structure1.hash).toMatch(/^[a-f0-9]*$/);
    expect(structure1.hash).toEqual(structure2.hash);
    expect(structure1.hash).not.toEqual(structure3.hash);
  });
});
