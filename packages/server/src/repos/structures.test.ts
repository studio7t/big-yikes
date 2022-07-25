import { Block, Structure } from '@big-yikes/lib';
import { query } from '../db';
import { blockTypes } from '../test/data';
import { BlockTypesRepo } from './block-types';
import { StructuresRepo } from './structures';

const blocks1 = [new Block(blockTypes['1x1'], { x: 0, y: 0 })];
const structure1 = new Structure(blocks1);

describe('StructuresRepo', () => {
  beforeAll(async () => {
    await BlockTypesRepo.add(blockTypes['1x1']);
  });

  beforeEach(async () => {
    await query('DELETE FROM blocks');
    await query('DELETE FROM structures');

    await StructuresRepo.add(structure1);
  });

  it('should add a structure to the db', async () => {
    const allStructures = await query('SELECT * FROM structures');
    expect(allStructures.length).toEqual(1);

    const addedStructure = allStructures[0];
    expect(addedStructure.hash).toEqual(structure1.hash);
  });

  it('should check if an identical structure exists', async () => {
    const structureId = await StructuresRepo.getId(structure1);
    expect(structureId).not.toBeNull();

    const structure = (
      await query('SELECT * FROM structures WHERE id = $1', [
        (structureId as number).toString(),
      ])
    )[0];
    expect(structure.hash).toEqual(structure1.hash);
  });
});
