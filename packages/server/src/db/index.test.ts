import {
  beginTransaction,
  commitTransaction,
  query,
  rollbackTransaction,
} from '.';

describe('db', () => {
  beforeEach(async () => {
    await query('DELETE FROM structures');
  });

  it('should allow queries to the database', async () => {
    await query('INSERT INTO structures (hash) VALUES ($1)', ['test-hash']);
    const allStructures = await query('SELECT * FROM structures');
    expect(allStructures.length).toEqual(1);
  });

  it('should support transactions', async () => {
    await beginTransaction();
    await query('INSERT INTO structures (hash) VALUES ($1)', ['test-hash']);
    await rollbackTransaction();

    let allStructures = await query('SELECT * FROM structures');
    expect(allStructures.length).toEqual(0);

    await beginTransaction();
    await query('INSERT INTO structures (hash) VALUES ($1)', ['test-hash']);
    await commitTransaction();

    allStructures = await query('SELECT * FROM structures');
    expect(allStructures.length).toEqual(1);
  });
});
