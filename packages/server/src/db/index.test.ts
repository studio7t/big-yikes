import { query } from '.';

describe('db', () => {
  beforeAll(async () => {
    await query('INSERT INTO big_yikes (structure, hash) VALUES ($1, $2)', [
      'test-structure',
      'test-hash',
    ]);
  });

  it('should allow queries to the database', async () => {
    const res = await query('SELECT * FROM big_yikes');
    expect(res.length).toEqual(1);
  });
});
