import { query } from '../db';
import { blockTypes } from '../test/data';
import { BlockTypesRepo } from './block-types';

describe('BlockTypesRepo', () => {
  beforeEach(async () => {
    await query('DELETE FROM block_types');
    await BlockTypesRepo.add(blockTypes['1x1']);
  });

  it('should add a block type to the db', async () => {
    const allBlockTypes = await query('SELECT * FROM block_types');
    expect(allBlockTypes.length).toEqual(1);

    const addedBlockType = allBlockTypes[0];
    expect(addedBlockType.color).toEqual(blockTypes['1x1'].color);
    expect(JSON.parse(addedBlockType.coordinates)).toEqual(
      blockTypes['1x1'].coordinates
    );
  });

  it('should fail to add a block using pre-existing coordinates', async () => {
    const blockTypeId = await BlockTypesRepo.add({
      coordinates: blockTypes['1x1'].coordinates,
      color: 'new-color',
    });
    expect(blockTypeId).toBeNull();

    const allBlockTypes = await query('SELECT * FROM block_types');
    expect(allBlockTypes.length).toEqual(1);
  });

  it('should fail to add a block using pre-existing color', async () => {
    const blockTypeId = await BlockTypesRepo.add({
      coordinates: [{ x: 100, y: 100 }],
      color: blockTypes['1x1'].color,
    });
    expect(blockTypeId).toBeNull();

    const allBlockTypes = await query('SELECT * FROM block_types');
    expect(allBlockTypes.length).toEqual(1);
  });

  it('should get the id of block type', async () => {
    const blockTypeId = await BlockTypesRepo.getId(blockTypes['1x1']);
    expect(blockTypeId).not.toBeNull();

    const blockType = (
      await query('SELECT * FROM block_types WHERE id = $1', [
        (blockTypeId as number).toString(),
      ])
    )[0];
    expect(blockType.color).toEqual(blockTypes['1x1'].color);
    expect(JSON.parse(blockType.coordinates)).toEqual(
      blockTypes['1x1'].coordinates
    );
  });
});
