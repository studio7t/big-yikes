import { intersectionWith, isEqual } from 'lodash';
import { Block } from '../models/block';
import { blockGraph, isConnected } from './block-graph';

export const areValidBlocks = (blocks: Block[]) => {
  if (!isConnected(blockGraph(blocks))) return false;

  for (let i = 0; i < blocks.length; i++) {
    if (
      !isValidBlock(blocks[i], [...blocks.slice(0, i), ...blocks.slice(i + 1)])
    )
      return false;
  }

  return true;
};

export const isValidBlock = (block: Block, others: Block[]) => {
  return !isOverlapping(block, others) && !isUnderground(block);
};

export const isOverlapping = (block: Block, others: Block[]) => {
  for (const other of others) {
    if (intersectionWith(other.coordinates, block.coordinates, isEqual).length)
      return true;
  }

  return false;
};

export const isUnderground = (block: Block) => {
  return !!block.coordinates.find((coord) => coord.y < 0);
};
