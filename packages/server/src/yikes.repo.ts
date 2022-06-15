import db from './db';

export interface Yikes {
  author: string;
  content: string;
  date: number;
}

class YikesRepo {
  async getAll(limit = 50) {
    return await db.query('SELECT * FROM yikes LIMIT $1', [limit.toString()]);
  }

  async createOne({ author, content, date }: Yikes) {
    await db.query('INSERT INTO yikes(author, content, date)', [
      author,
      content,
      date.toString(),
    ]);
  }
}

const yikesRepo = new YikesRepo();
export default yikesRepo;
