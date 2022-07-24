import { query } from '.';

describe('db', () => {
  it('should allow queries to the database', async () => {
    await query('INSERT INTO structures (hash) VALUES ($1)', ['test-hash']);
    const allStructures = await query('SELECT * FROM structures');
    expect(allStructures.length).toEqual(1);
  });
});
