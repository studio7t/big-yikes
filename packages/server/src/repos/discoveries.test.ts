import { Block, Structure } from '@big-yikes/lib';
import { query } from '../db';
import { blockTypes } from '../test/data';
import { BlockTypesRepo } from './block-types';
import { DiscoveriesRepo } from './discoveries';
import { StructuresRepo } from './structures';
import { UsersRepo } from './users';

const blocks1 = [new Block(blockTypes['1x1'], { x: 0, y: 0 })];
const structure1 = new Structure(blocks1);

describe('DiscoveriesRepo', () => {
  let structureId: number;
  let userId: string;

  beforeAll(async () => {
    await BlockTypesRepo.add(blockTypes['1x1']);
    structureId = await StructuresRepo.add(structure1);

    userId = (await UsersRepo.add({ id: 'test-id' })) as string;
  });

  beforeEach(async () => {
    await query('DELETE FROM discoveries');
    await DiscoveriesRepo.add({ structureId, userId });
  });

  it('should add a new discovery to the db', async () => {
    const allDiscoveries = await query('SELECT * FROM discoveries');
    expect(allDiscoveries.length).toEqual(1);

    const addedDiscovery = allDiscoveries[0];
    expect(addedDiscovery.structure_id).toEqual(structureId);
    expect(addedDiscovery.user_id).toEqual(userId);
    expect(addedDiscovery.time).toBeDefined();
  });

  it('should get the id of a discovery by structure and user id', async () => {
    const discoveryId = await DiscoveriesRepo.getId({ structureId, userId });
    expect(discoveryId).not.toBeNull();

    const discovery = (
      await query('SELECT * FROM discoveries WHERE id = $1', [
        (discoveryId as number).toString(),
      ])
    )[0];
    expect(discovery.structure_id).toEqual(structureId);
    expect(discovery.user_id).toEqual(userId);
  });
});
