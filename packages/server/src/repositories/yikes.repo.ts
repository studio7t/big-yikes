import db from '../db';

export interface WriteYikes {
  content: string;
}

export interface ReadYikes {
  id: number;
  content: string;
  date: Date;
}

class YikesRepo {
  async getAll(limit = 50): Promise<ReadYikes[]> {
    const res = await db.query('SELECT * FROM yikes LIMIT $1', [
      limit.toString(),
    ]);
    return res.rows;
  }

  async createOne({ content }: WriteYikes): Promise<Partial<ReadYikes>> {
    const res = await db.query(
      'INSERT INTO yikes(content, date) VALUES ($1, $2) RETURNING id, date',
      [content, new Date().toISOString()]
    );

    return res.rows[0];
  }
}

const yikesRepo = new YikesRepo();
export default yikesRepo;
