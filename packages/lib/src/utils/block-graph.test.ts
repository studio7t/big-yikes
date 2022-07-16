import { Block } from '../models/block';
import { blocks, blockTypes, floatingBoys } from '../test/data';
import {
  adjacent,
  blockGraph,
  GROUND,
  isConnected,
  isOnTheGround,
} from './block-graph';

describe('adjacent', () => {
  it('should return true when two blocks are adjacent', () => {
    expect(adjacent(blocks[0], blocks[1])).toEqual(true);
  });

  it('should return false when two blocks are not adjacent', () => {
    expect(adjacent(blocks[0], blocks[2])).toEqual(false);
  });
});

describe('blockGraph', () => {
  it('should return an adjacency list graph representation of blocks', () => {
    const result = {
      [blocks[0].id]: new Set([blocks[1].id, GROUND]),
      [blocks[1].id]: new Set([blocks[0].id]),
      [blocks[2].id]: new Set([GROUND]),
      [GROUND]: new Set([blocks[0].id, blocks[2].id]),
    };
    expect(blockGraph(blocks.slice(0, 3))).toEqual(result);
  });
});

describe('isConnected', () => {
  it('should return true when all blocks have a path back to the ground', () => {
    expect(isConnected(blockGraph(blocks.slice(0, 4)))).toEqual(true);
    expect(
      isConnected(
        blockGraph([
          ...blocks.slice(0, 2),
          new Block(blockTypes['1x1'], { x: 2, y: 1 }),
        ])
      )
    ).toEqual(true);
  });

  it('should return false when one or more blocks do not have a path to ground', () => {
    expect(isConnected(blockGraph([...floatingBoys]))).toEqual(false);
  });
});

describe('isOnTheGround', () => {
  it('should return if a block is directly contacting the ground', () => {
    expect(isOnTheGround(new Block(blockTypes['1x1'], { x: 0, y: 0 }))).toEqual(
      true
    );
    expect(isOnTheGround(new Block(blockTypes['1x1'], { x: 0, y: 1 }))).toEqual(
      false
    );
  });
});
