import { BlockStructure, hashStructure } from '@big-yikes/lib';
import { isEqual } from 'lodash';
import { query } from '../db';

interface BigYikes {
  id: number;
  structure: BlockStructure;
  hash: string;
}

class BigYikesRepo {
  async get(structure: BlockStructure): Promise<BigYikes | null> {
    const hash = hashStructure(structure);
    const res = await query('SELECT * FROM big_yikes WHERE hash = $1', [hash]);

    for (const yikes of res) {
      const yikesStructure = new Set(JSON.parse(yikes.structure));
      if (isEqual(yikesStructure, structure))
        return { ...yikes, structure: yikesStructure } as BigYikes;
    }

    return null;
  }

  async add(structure: BlockStructure): Promise<number> {
    const res = await query(
      'INSERT INTO big_yikes (structure, hash) VALUES ($1, $2) RETURNING id',
      [JSON.stringify(Array.from(structure)), hashStructure(structure)]
    );

    return res[0].id;
  }
}

export const bigYikesRepo = new BigYikesRepo();
