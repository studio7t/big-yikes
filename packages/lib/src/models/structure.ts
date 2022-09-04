import isEqual from 'lodash.isequal';
import objectHash from 'object-hash';
import RBush from 'rbush';
import { Bounds, Vector2D } from '../types';
import { Block, BlockBounds } from './block';
import { BlockGraph } from './block-graph';

export type BlockFingerprint = { type: string; position: Vector2D };
export type BlockFingerprintSet = Set<BlockFingerprint>;

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

  get fingerprintSet(): BlockFingerprintSet {
    return new Set(
      this.blocks.map((b) => {
        return { type: b.type, position: b.position };
      })
    );
  }

  getBlocksInBounds(bounds: Bounds) {
    return this.tree.search(bounds).map((blockBounds) => blockBounds.block);
  }

  getBlockAtCoords({ x, y }: Vector2D): Block | undefined {
    return this.getBlocksInBounds({ minX: x, minY: y, maxX: x, maxY: y })[0];
  }

  getBlocksWithout(block: Block) {
    return this.blocks.filter((b) => b !== block);
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
