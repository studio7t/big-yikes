import {
  Block,
  BlockTypeSlugSchema,
  Discovery,
  Structure,
  Vector2DSchema,
} from '@big-yikes/lib';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { db } from '../../db';

const BASE_PATH = '/discovery';

const BlockSchema = Type.Object({
  type: BlockTypeSlugSchema,
  position: Vector2DSchema,
});

const StructureSchema = Type.Object({
  blocks: Type.Array(BlockSchema),
});

type StructureType = Static<typeof StructureSchema>;

export const discoveryRoutes = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: StructureType }>(
    BASE_PATH,
    {
      schema: { body: StructureSchema },
      preValidation: [fastify.authenticate],
    },
    async (request, reply) => {
      const blocks = request.body.blocks.map(
        (b) => new Block(b.type, b.position)
      );
      const structure = new Structure(blocks);

      if (!structure.isValid()) {
        reply.status(400).send('Blocks are invalid');
        return;
      }

      // TODO validate against bin

      const structureId = await insertStructureIfNotExists(structure);

      const { username } = request.user as { username: string };

      const isDuplicateDiscovery =
        (
          await db.query(
            'SELECT id FROM discoveries WHERE structure_id = $1 AND username = $2',
            [structureId, username]
          )
        ).rowCount > 0;
      if (!isDuplicateDiscovery) {
        await db.query(
          'INSERT INTO discoveries(structure_id, time, username) VALUES($1, $2, $3)',
          [structureId, Date.now(), username]
        );
      }

      const allDiscoveriesForStructure = (
        await db.query(
          'SELECT structure_id, time, username FROM discoveries WHERE structure_id = $1',
          [structureId]
        )
      ).rows;
      console.log(allDiscoveriesForStructure);
      const formattedDiscoveries: Discovery[] = allDiscoveriesForStructure
        .map((discovery) => ({
          structureId: discovery.structure_id,
          time: JSON.parse(discovery.time),
          username: discovery.username,
        }))
        .sort((a, b) => b.time - a.time);
      reply.status(200).send(formattedDiscoveries);
    }
  );
};

const insertStructureIfNotExists = async (
  structure: Structure
): Promise<number> => {
  const dbStructuresWithSameHash = (
    await db.query('SELECT id, blocks FROM structures WHERE hash = $1', [
      structure.hash,
    ])
  ).rows;

  for (const dbStructureWithSameHash of dbStructuresWithSameHash) {
    const structureWithSameHash = new Structure(
      dbStructureWithSameHash.blocks.map(
        (b: Static<typeof BlockSchema>) => new Block(b.type, b.position)
      )
    );

    if (structureWithSameHash.isEqual(structure)) {
      return dbStructureWithSameHash.id;
    }
  }

  const insertedStructure = (
    await db.query(
      'INSERT INTO structures(hash, blocks) VALUES($1, $2) RETURNING id',
      [structure.hash, JSON.stringify(Array.from(structure.fingerprintSet))]
    )
  ).rows[0];

  return insertedStructure.id;
};
