import { Block } from '@big-yikes/lib';
import { query } from '../db';

export class BlocksRepo {
  // expects the block type to already exist
  static async add(block: Block, structureId: number) {
    let newBlock: { id: number };
    try {
      newBlock = (
        await query(
          `INSERT INTO blocks (position_x, position_y, block_type_id, structure_id)
          VALUES ($1, $2, $3, $4) RETURNING id`,
          [
            block.position.x.toString(),
            block.position.y.toString(),
            block.type.id.toString(),
            structureId.toString(),
          ]
        )
      )[0];
    } catch {
      console.warn(
        'tried to insert block with invalid block type or structure'
      );
      return null;
    }

    return newBlock.id;
  }
}
