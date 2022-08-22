import { isEqual } from 'lodash';
import objectHash from 'object-hash';
import { Vector2D } from '../types';
import { BlockGraph } from './block-graph';
import { Block } from './block';

export type BlockFingerprint = { type: string; position: Vector2D };
export type BlockFingerprintSet = Set<BlockFingerprint>;

export class Structure {
  blocks: Block[];

  constructor(blocks: Block[]) {
    this.blocks = blocks;
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

  isValid() {
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];

      const isValid = block.isValid([
        ...this.blocks.slice(0, i),
        ...this.blocks.slice(i + 1),
      ]);

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
