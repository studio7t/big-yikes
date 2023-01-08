import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import {
  Block,
  BlockTypeSlugSchema,
  Discovery,
  Structure,
  Vector2DSchema,
} from '@big-yikes/lib';
import { Static, Type } from '@sinclair/typebox';
import { FastifyInstance } from 'fastify';
import { nanoid } from 'nanoid';
import { BaseTable, DocumentDB } from '../../db';

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

      const { sub: userId, username } = request.user as {
        sub: string;
        username: string;
      };

      // check if user has already made this discovery
      const { Items: discoveriesWithSameUserAndHash } = await DocumentDB.send(
        new QueryCommand({
          TableName: BaseTable.options.TableName,
          IndexName: 'GSI3',
          ExpressionAttributeNames: {
            '#userId': 'gsi3_pk',
            '#hash': 'gsi3_sk',
          },
          ExpressionAttributeValues: {
            ':userId': userId,
            ':hash': structure.hash,
          },
          KeyConditionExpression: '#userId = :userId AND #hash = :hash',
        })
      );
      const duplicateDiscoveries =
        discoveriesWithSameUserAndHash?.filter((discovery) =>
          Structure.fromFingerprints(discovery.structure).isEqual(structure)
        ) || [];

      const isDuplicateDiscovery = duplicateDiscoveries.length;

      // if the discovery does not exist, add it to db
      if (!isDuplicateDiscovery) {
        const time = Date.now();
        await DocumentDB.send(
          new PutCommand({
            TableName: BaseTable.options.TableName,
            Item: {
              userId,
              username,
              id: nanoid(),
              structure: Array.from(structure.fingerprintSet),
              structureHash: structure.hash,
              datetime: time,
              gsi1_pk: userId,
              gsi1_sk: time,
              gsi2_pk: structure.hash,
              gsi2_sk: time,
              gsi3_pk: userId,
              gsi3_sk: structure.hash,
            },
          })
        );
      }

      // get all discoveries matching structure hash sorted by time, then
      // filter ones that match structure in code
      const allDiscoveriesForStructure = await (async () => {
        const response = await DocumentDB.send(
          new QueryCommand({
            TableName: BaseTable.options.TableName,
            IndexName: 'GSI2',
            ExpressionAttributeNames: {
              '#hash': 'gsi2_pk',
              // Additional properties to retrieve..
              '#time': 'datetime',
              '#uname': 'username',
            },
            ExpressionAttributeValues: {
              ':hash': structure.hash,
            },
            KeyConditionExpression: '#hash = :hash',
            ScanIndexForward: false,
            ProjectionExpression: '#time, #uname',
          })
        );
        return response.Items || [];
      })();

      // format the response, and send it back to user
      const formattedDiscoveries: Discovery[] = allDiscoveriesForStructure
        .map((discovery) => ({
          time: discovery.datetime,
          username: discovery.username,
        }))
        .sort((a, b) => b.time - a.time);
      reply.status(200).send(formattedDiscoveries);
    }
  );
};
