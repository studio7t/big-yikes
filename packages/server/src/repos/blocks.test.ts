import { Block } from '@big-yikes/lib';
import { query } from '../db';
import { blockTypes } from '../test/data';
import { BlockTypesRepo } from './block-types';
import { BlocksRepo } from './blocks';

describe('BlocksRepo', () => {
  let structureId: number;

  beforeAll(async () => {
    const blockTypeId = await BlockTypesRepo.add(blockTypes['1x1']);

    // The id should equal 1 since it's the first entry in a serial table
    expect(blockTypeId).toEqual(blockTypes['1x1'].id);

    structureId = (
      await query('INSERT INTO structures (hash) VALUES ($1) RETURNING id', [
        'test-hash',
      ])
    )[0].id;
  });

  it('should add a block to the db', async () => {
    const addedBlockId = await BlocksRepo.add(
      new Block(blockTypes['1x1'], { x: 0, y: 0 }),
      structureId
    );
    expect(addedBlockId).not.toBeNull();

    const allBlocks = await query('SELECT * FROM blocks');
    expect(allBlocks.length).toEqual(1);

    const addedBlock = allBlocks[0];
    expect(addedBlock.block_type_id).toEqual(blockTypes['1x1'].id);
    expect(addedBlock.position_x).toEqual(0);
    expect(addedBlock.position_y).toEqual(0);
    expect(addedBlock.structure_id).toEqual(structureId);
  });
});
