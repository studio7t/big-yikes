import { Block, Structure } from '@big-yikes/lib';
import {
  beginTransaction,
  commitTransaction,
  query,
  rollbackTransaction,
} from '../db';
import { BlocksRepo } from './blocks';

export class StructuresRepo {
  static async getId(structure: Structure) {
    const structuresWithSameHash: { id: number }[] = await query(
      'SELECT id FROM structures WHERE hash = $1',
      [structure.hash]
    );

    if (!structuresWithSameHash.length) return null;

    for (const structureWithSameHash of structuresWithSameHash) {
      const blocks: {
        position_x: number;
        position_y: number;
        block_type_id: number;
        coordinates: string;
        color: string;
      }[] = await query(
        `SELECT position_x, position_y, block_type_id, coordinates, color FROM blocks
        JOIN block_types ON block_type_id = block_types.id
        WHERE structure_id = $1`,
        [structureWithSameHash.id.toString()]
      );

      const otherStructure = new Structure(
        blocks.map((b) => {
          return new Block(
            {
              id: b.block_type_id,
              coordinates: JSON.parse(b.coordinates),
              color: b.color,
            },
            { x: b.position_x, y: b.position_y }
          );
        })
      );

      if (structure.isEqual(otherStructure)) return structureWithSameHash.id;
    }

    return null;
  }

  static async add(structure: Structure) {
    await beginTransaction();

    const newStructure: { id: number } = (
      await query('INSERT INTO structures (hash) VALUES ($1) RETURNING id', [
        structure.hash,
      ])
    )[0];

    const structureId = newStructure.id;

    for (const block of structure.blocks) {
      const blockId = await BlocksRepo.add(block, structureId);
      if (blockId === null) {
        await rollbackTransaction();
        return null;
      }
    }

    await commitTransaction();

    return structureId;
  }
}
