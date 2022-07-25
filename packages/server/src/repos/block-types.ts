import { BlockType } from '@big-yikes/lib';
import { query } from '../db';

export class BlockTypesRepo {
  static async add(blockType: Omit<BlockType, 'id'>) {
    let newBlockType: { id: number };
    try {
      newBlockType = (
        await query(
          'INSERT INTO block_types (coordinates, color) VALUES ($1, $2) RETURNING id',
          [JSON.stringify(blockType.coordinates), blockType.color]
        )
      )[0];
    } catch {
      console.warn(
        'tried to insert block type with color or coordinates that have already been used'
      );
      return null;
    }

    return newBlockType.id;
  }
}
