import { Block, blockStructure, hashStructure } from '@big-yikes/lib';
import { query } from '../db';
import { bigYikesRepo } from './big-yikes';

const blockTypes = {
  '1x1': { coordinates: [{ x: 0, y: 0 }], color: '#FF0000' },
};
const structure1 = blockStructure([
  new Block(blockTypes['1x1'], { x: 0, y: 0 }),
  new Block(blockTypes['1x1'], { x: 0, y: 1 }),
]);

const structure2 = blockStructure([
  new Block(blockTypes['1x1'], { x: 2, y: 0 }),
]);

const structure3 = blockStructure([
  new Block(blockTypes['1x1'], { x: 4, y: 0 }),
]);

const structure4 = blockStructure([
  new Block(blockTypes['1x1'], { x: 5, y: 5 }),
]);

describe('bigYikes', () => {
  beforeEach(async () => {
    await query('DELETE FROM big_yikes');

    const insertQuery =
      'INSERT INTO big_yikes (structure, hash) VALUES ($1, $2)';

    // insert two different structures that have the same hash
    await query(insertQuery, [
      JSON.stringify(Array.from(structure1)),
      hashStructure(structure1),
    ]);
    await query(insertQuery, [
      JSON.stringify(Array.from(structure2)),
      hashStructure(structure1), // pretend it has the same hash as structure1
    ]);

    await query(insertQuery, [
      JSON.stringify(Array.from(structure4)),
      hashStructure(structure3),
    ]);
  });

  it('should return a big_yikes given a structure, if it exists', async () => {
    const yikes = await bigYikesRepo.get(structure1);
    if (yikes) {
      expect(yikes.structure).toEqual(structure1);
      expect(yikes.hash).toEqual(hashStructure(structure1));
    } else expect(false).toEqual(true); // fail if yikes is null
  });

  it('should return null when trying to get a non-existent big_yikes', async () => {
    let yikes = await bigYikesRepo.get(structure3);
    expect(yikes).toBeNull();

    yikes = await bigYikesRepo.get(structure4);
    expect(yikes).toBeNull();
  });

  it('should be able to add big_yikes by structure', async () => {
    const id = await bigYikesRepo.add(structure3);
    expect(id).toBeDefined();

    const yikes = await bigYikesRepo.get(structure3);
    expect(yikes).toBeDefined();
  });
});
