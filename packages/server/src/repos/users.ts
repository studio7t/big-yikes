import { query } from '../db';

export class UsersRepo {
  static async add(user: { id: string }) {
    try {
      await query('INSERT INTO users (id) VALUES ($1)', [user.id]);
    } catch {
      console.warn('tried to insert user with duplicate id');
      return null;
    }

    return user.id;
  }
}
