import { isEqual } from 'lodash';
import objectHash from 'object-hash';
import { Vector2D } from '../types';
import { Block } from './block';

export type BlockFingerprint = { type: string; position: Vector2D };
export type BlockFingerprintSet = Set<BlockFingerprint>;

export class BlockStructure {
  blocks: Block[];

  constructor(blocks: Block[]) {
    this.blocks = blocks;
  }

  get hash() {
    return objectHash(this.fingerprintSet);
  }

  get blockArray() {
    return this.blocks;
  }

  get fingerprintSet(): BlockFingerprintSet {
    return new Set(
      this.blocks.map((b) => {
        // TODO replace type identifier with something more reliable
        return { type: b.type.color, position: b.position };
      })
    );
  }

  // static fromFingerprints(fingerprints: BlockFingerprint[]) {
  //   return fingerprints.map((f) => {
  //     return
  //   })
  // }

  isEqual(other: BlockStructure) {
    return isEqual(this.fingerprintSet, other.fingerprintSet);
  }
}
