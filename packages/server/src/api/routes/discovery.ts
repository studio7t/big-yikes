import {
  Block,
  BlockTypeSlugSchema,
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
      const collection = db.collection('discoveries');

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

      const { sub: userId } = request.user as { sub: string };

      const alreadyDiscovered = await collection.findOne({
        structure_id: structureId,
        user_id: userId,
      });
      if (!alreadyDiscovered) {
        await collection.insertOne({
          structure_id: structureId,
          time: Date.now(),
          user_id: userId,
        });
      }

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
