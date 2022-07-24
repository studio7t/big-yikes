import { BlockType } from '@big-yikes/lib';
import { query } from '../db';

export class BlockTypesRepo {
  static async getId(blockType: Omit<BlockType, 'id'>) {
    const matchingBlockTypes: { id: number }[] = await query(
      'SELECT id FROM block_types WHERE coordinates = $1 and color = $2',
      [JSON.stringify(blockType.coordinates), blockType.color]
    );

    if (!matchingBlockTypes.length) return null;

    return matchingBlockTypes[0].id;
  }

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
