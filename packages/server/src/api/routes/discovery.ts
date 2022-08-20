import { FastifyInstance } from 'fastify';
import { db } from '../../db';
import { Static, Type } from '@sinclair/typebox';
import { Block, Structure } from '@big-yikes/lib';

const BASE_PATH = '/discovery';

const Vector2D = Type.Object({ x: Type.Number(), y: Type.Number() });

const BlockTypeSchema = Type.Object({
  slug: Type.String(),
  coordinates: Type.Array(Vector2D),
  color: Type.String(),
});

const BlockSchema = Type.Object({
  type: BlockTypeSchema,
  position: Vector2D,
});

const StructureSchema = Type.Object({
  blocks: Type.Array(BlockSchema),
});

type StructureType = Static<typeof StructureSchema>;

export const discoveryRoutes = async (fastify: FastifyInstance) => {
  fastify.post<{ Body: StructureType }>(
    BASE_PATH,
    { schema: { body: StructureSchema } },
    async (request, reply) => {
      const collection = db.collection('discoveries');

      const blocks = request.body.blocks.map(
        (b) => new Block(b.type, b.position)
      );
      const structure = new Structure(blocks);

      if (!structure.isValid()) {
        reply.status(400).send('Blocks are invalid');
        return;
      }

      const structureId = await insertStructureIfNotExists(structure);

      // TODO replace user ids with actual value

      const alreadyDiscovered = await collection.findOne({
        structure_id: structureId,
        user_id: 1,
      });
      if (alreadyDiscovered) {
        reply.status(400).send('Already discovered');
        return;
      }

      await collection.insertOne({
        structure_id: structureId,
        time: new Date().getUTCMilliseconds(),
        user_id: 1,
      });

      const allDiscoveries = await collection
        .find({ structure_id: structureId })
        .toArray();
      reply.status(200).send(allDiscoveries);
    }
  );
};

const insertStructureIfNotExists = async (structure: Structure) => {
  const collection = db.collection('structures');

  const dbStructuresWithSameHash = await collection
    .find({
      hash: structure.hash,
    })
    .toArray();

  for (const dbStructureWithSameHash of dbStructuresWithSameHash) {
    const structureWithSameHash = new Structure(
      dbStructureWithSameHash.blocks.map(
        (b: Static<typeof BlockSchema>) => new Block(b.type, b.position)
      )
    );

    if (structureWithSameHash.isEqual(structure)) {
      return dbStructureWithSameHash._id;
    }
  }

  const insertedStructure = await collection.insertOne({
    hash: structure.hash,
    blocks: structure.blocks,
  });

  return insertedStructure.insertedId;
};
