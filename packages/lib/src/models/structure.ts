import isEqual from 'lodash.isequal';
import objectHash from 'object-hash';
import RBush from 'rbush';
import { Bounds, Vector2D } from '../types';
import { isEqual as vectorIsEqual } from '../utils';
import { Block, BlockBounds, BlockFingerprint } from './block';
import { BlockGraph } from './block-graph';

export class Structure {
  blocks: Block[];
  tree: RBush<BlockBounds>;

  constructor(blocks: Block[] = []) {
    this.blocks = blocks;

    this.tree = new RBush();
    this.tree.load(blocks.map((b) => b.bounds));
  }

  get hash() {
    return objectHash(this.fingerprintSet);
  }

  get fingerprintSet(): Set<BlockFingerprint> {
    return new Set(this.blocks.map((b) => b.fingerprint));
  }

  withBlockAdded(block: Block): Structure {
    return new Structure([...this.blocks, block]);
  }

  withBlockRemoved(block: Block): Structure {
    return new Structure(this.blocks.filter((b) => b !== block));
  }

  getBlocksInBounds(bounds: Bounds) {
    return this.tree.search(bounds).map((blockBounds) => blockBounds.block);
  }

  getBlockAtCoords({ x, y }: Vector2D): Block | undefined {
    const blocksInBounds = this.getBlocksInBounds({
      minX: x,
      minY: y,
      maxX: x,
      maxY: y,
    });
    for (const block of blocksInBounds) {
      if (block.coordinates.find((coord) => vectorIsEqual(coord, { x, y })))
        return block;
    }
  }

  isValid() {
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];

      const nearbyBlocks = this.getBlocksInBounds(block.bounds);
      const isValid = block.isValid(nearbyBlocks);

      if (!isValid) return false;
    }

    const graph = new BlockGraph(this.blocks);
    if (!graph.isConnected()) return false;

    return true;
  }

  isDiscovery() {
    return this.hash.match(/^0[0-7]/) !== null;
  }

  isEqual(other: Structure) {
    return isEqual(this.fingerprintSet, other.fingerprintSet);
  }
}
