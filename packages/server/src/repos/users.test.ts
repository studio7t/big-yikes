import { query } from '../db';
import { UsersRepo } from './users';

describe('UsersRepo', () => {
  it('should add a user to the db', async () => {
    const userId = 'test-id';

    await UsersRepo.add({ id: userId });
    const allUsers = await query('SELECT * FROM users');
    expect(allUsers.length).toEqual(1);

    const addedUser = allUsers[0];
    expect(addedUser.id).toEqual(userId);
  });
});
