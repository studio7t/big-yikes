import {
  DynamoDBClient,
  DynamoDBClientConfig,
  ListTablesCommand,
  CreateTableCommand,
  CreateTableCommandInput,
  UpdateTableCommand,
  DeleteTableCommand,
  ProjectionType,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const config: DynamoDBClientConfig = {};
if (process.env.NODE_ENV !== 'production') {
  config.region = 'localhost';
  config.credentials = {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  };
  config.endpoint = process.env.DDB_ENDPOINT || 'http://localhost:8000';
}

const DynamoDB = new DynamoDBClient(config);
export const DocumentDB = DynamoDBDocumentClient.from(DynamoDB, {
  marshallOptions: { removeUndefinedValues: true },
});

/**
 * DynamoDB Table options interface.
 */
interface TableOptions extends CreateTableCommandInput {
  TableName: string;
}

/**
 * Abstract DynamoDB Table definition class.
 */
abstract class Table {
  // Table creation options.
  abstract options: TableOptions;

  /**
   * Check whether or not the table exists.
   */
  private async exists(): Promise<boolean> {
    const name = this.options.TableName;
    const result = await DynamoDB.send(new ListTablesCommand({}));
    const tables = result.TableNames || [];
    if (tables.includes(name)) {
      return true;
    }
    return false;
  }

  /**
   * Sync DynamoDB Table options in development.
   */
  async sync() {
    // Exit if in production.
    // Never sync in production.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Unsafe sync in production.');
    }
    // Check if the DynamoDB Table exists.
    const exists = await this.exists();
    if (exists) {
      // If the DynamoDB Table exists, update it.
      await DynamoDB.send(new UpdateTableCommand(this.options));
    } else {
      // If the DynamoDB Table doesn't exist, create it.
      await DynamoDB.send(new CreateTableCommand(this.options));
    }
    console.log('Table synced.');
  }

  /**
   * Drop the DynamoDB table.
   */
  async drop() {
    // Exit if in production.
    // Never drop in production.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Unsafe drop in production.');
    }
    // Check if the DynamoDB exists.
    const exists = await this.exists();
    if (exists) {
      await DynamoDB.send(
        new DeleteTableCommand({
          TableName: this.options.TableName,
        })
      );
    }
    console.log('Table dropped.');
  }
}

/**
 * Base table definition.
 */
class BaseTableClass extends Table {
  options: TableOptions = {
    TableName: process.env.DDB_TABLE_NAME || 'BaseTable',
    AttributeDefinitions: [
      // PK is unique item id
      // Get one user or discovery by unique id
      { AttributeName: 'id', AttributeType: 'S' },
      // USER
      // PK is literal "discovery", SK is numDiscoveries
      // get the number of discoveries that each user has made (leaderboard)
      // DISCOVERY
      // PK is userId, SK is datetime
      // list all a discoveries that a specific user has made
      { AttributeName: 'gsi1_pk', AttributeType: 'S' },
      { AttributeName: 'gsi1_sk', AttributeType: 'N' },
      // PK is structureHash, SK is datetime
      // find all discoveries matching a certain structure
      { AttributeName: 'gsi2_pk', AttributeType: 'S' },
      { AttributeName: 'gsi2_sk', AttributeType: 'N' },
      // PK is userId, SK is structureHash
      // get users by id and structure hash to see if user
      // has already made a specific discovery
      { AttributeName: 'gsi3_pk', AttributeType: 'S' },
      { AttributeName: 'gsi3_sk', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'gsi1_pk', KeyType: 'HASH' },
          { AttributeName: 'gsi1_sk', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: ProjectionType.ALL },
      },
      {
        IndexName: 'GSI2',
        KeySchema: [
          { AttributeName: 'gsi2_pk', KeyType: 'HASH' },
          { AttributeName: 'gsi2_sk', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: ProjectionType.ALL },
      },
      {
        IndexName: 'GSI3',
        KeySchema: [
          { AttributeName: 'gsi3_pk', KeyType: 'HASH' },
          { AttributeName: 'gsi3_sk', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: ProjectionType.ALL },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  };
}

// Exports.
export const BaseTable = new BaseTableClass();
