import { query } from '../db';

// move to lib once this needs to be used elsewhere
interface Discovery {
  structureId: number;
  userId: string;
}

export class DiscoveriesRepo {
  static async getId({ structureId, userId }: Discovery) {
    const matchingDiscoveries: { id: number }[] = await query(
      'SELECT id FROM discoveries WHERE structure_id = $1 and user_id = $2',
      [structureId.toString(), userId]
    );

    if (!matchingDiscoveries.length) return null;

    return matchingDiscoveries[0].id;
  }

  static async add({ structureId, userId }: Discovery) {
    const newDiscovery: { id: number } = (
      await query(
        'INSERT INTO discoveries (structure_id, user_id) VALUES ($1, $2) RETURNING id',
        [structureId.toString(), userId]
      )
    )[0];

    return newDiscovery.id;
  }
}
