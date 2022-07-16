import { Block } from '../models/block';
import { blocks, blockTypes, floatingBoys } from '../test/data';
import {
  isOverlapping,
  isUnderground,
  isValidBlock,
  isValidStructure,
} from './validation';

describe('isOverlapping', () => {
  it('should return true when the provided block overlaps with another', () => {
    expect(
      isOverlapping(new Block(blockTypes['1x2'], { x: 1, y: 0 }), blocks)
    ).toEqual(true);
    expect(
      isOverlapping(new Block(blockTypes['1x1'], { x: 1, y: 1 }), blocks)
    ).toEqual(true);
  });

  it('should return false when the provided block does not overlap another', () => {
    expect(
      isOverlapping(new Block(blockTypes['1x1'], { x: 1, y: 0 }), blocks)
    ).toEqual(false);
    expect(
      isOverlapping(new Block(blockTypes['1x2'], { x: 4, y: 2 }), blocks)
    ).toEqual(false);
  });
});

describe('isUnderground', () => {
  it('should return if a block is partially or completely underground', () => {
    expect(
      isUnderground(new Block(blockTypes['1x2'], { x: 0, y: -1 }))
    ).toEqual(true);
    expect(isUnderground(new Block(blockTypes['1x2'], { x: 0, y: 0 }))).toEqual(
      false
    );
  });
});

describe('isValidBlock', () => {
  it('should return true when the block is valid', () => {
    expect(
      isValidBlock(new Block(blockTypes['1x1'], { x: 1, y: 0 }), blocks)
    ).toEqual(true);
    expect(
      isValidBlock(new Block(blockTypes['1x2'], { x: 2, y: 0 }), blocks)
    ).toEqual(true);
  });

  it('should return true if a block is valid despite floating', () => {
    expect(
      isValidBlock(new Block(blockTypes['1x1'], { x: 0, y: 4 }), blocks)
    ).toEqual(true);
  });

  it('should return false when the block is overlapping with another', () => {
    expect(
      isValidBlock(new Block(blockTypes['1x1'], { x: 0, y: 0 }), blocks)
    ).toEqual(false);
  });

  it('should return false when the block is underground', () => {
    expect(
      isValidBlock(new Block(blockTypes['1x2'], { x: 0, y: -1 }), blocks)
    ).toEqual(false);
  });
});

describe('isValidStructure', () => {
  it('should return whether a structure of blocks is valid', () => {
    expect(isValidStructure([...blocks.slice(0, 2)])).toEqual(true); // A,B
    expect(isValidStructure([...blocks.slice(0, 4)])).toEqual(true); // A,B,C,D
    expect(isValidStructure(blocks)).toEqual(false); // A,B,C,D,E
    expect(isValidStructure(floatingBoys)).toEqual(false); // A,B... but hovering 1 unit off the ground
  });
});
