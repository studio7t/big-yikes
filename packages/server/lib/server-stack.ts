import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';

import {
  AttributeDefinition,
  GlobalSecondaryIndex,
  LocalSecondaryIndex,
  KeySchemaElement,
} from '@aws-sdk/client-dynamodb';

import { Construct } from 'constructs';

import { BaseTable } from '../src/db';

interface ServerConstructProps {
  zipFile: string;
}
export class ServerConstruct extends Construct {
  lambda: lambda.Function;
  gateway: apigw.LambdaRestApi;
  table: ddb.Table;
  constructor(scope: Construct, id: string, { zipFile }: ServerConstructProps) {
    super(scope, id);

    // Create the API lambda
    this.lambda = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset(zipFile),
    });

    // Create the API gateway
    this.gateway = new apigw.LambdaRestApi(this, 'ApiGateway', {
      handler: this.lambda,
    });

    // Create the DynamoDB table
    this.table = new ddb.Table(this, 'BaseTable', {
      partitionKey: sdkToCdk({
        attributeDefinitions: BaseTable.options.AttributeDefinitions,
        keySchema: BaseTable.options.KeySchema,
        type: 'HASH',
      }),
      sortKey: sdkToCdk({
        attributeDefinitions: BaseTable.options.AttributeDefinitions,
        keySchema: BaseTable.options.KeySchema,
        type: 'RANGE',
      }),
      billingMode:
        BaseTable.options.BillingMode === 'PROVISIONED'
          ? ddb.BillingMode.PROVISIONED
          : ddb.BillingMode.PAY_PER_REQUEST,
      readCapacity: BaseTable.options.ProvisionedThroughput?.ReadCapacityUnits,
      writeCapacity:
        BaseTable.options.ProvisionedThroughput?.WriteCapacityUnits,
    });

    // Add all Global Secondary Indexes.
    for (const gsi of sdkGlobalSecondaryIndexesToCdk({
      attributeDefinitions: BaseTable.options.AttributeDefinitions,
      indexes: BaseTable.options.GlobalSecondaryIndexes,
    })) {
      this.table.addGlobalSecondaryIndex(gsi);
    }

    // Add all Local Secondary Indexes.
    for (const lsi of sdkLocalSecondaryIndexesToCdk({
      attributeDefinitions: BaseTable.options.AttributeDefinitions,
      indexes: BaseTable.options.LocalSecondaryIndexes,
    })) {
      this.table.addLocalSecondaryIndex(lsi);
    }

    // Give the Lambda full access to the table.
    this.table.grantFullAccess(this.lambda);
  }
}

/**
 * Convert an SDK DynamoDB key to a CDK DynamoDB key.
 */
function sdkToCdk(input: {
  attributeDefinitions?: AttributeDefinition[];
  keySchema?: KeySchemaElement[];
  type: 'HASH';
}): ddb.Attribute;
function sdkToCdk(input: {
  attributeDefinitions?: AttributeDefinition[];
  keySchema?: KeySchemaElement[];
  type: 'RANGE';
}): ddb.Attribute | undefined;
function sdkToCdk(input: {
  attributeDefinitions?: AttributeDefinition[];
  keySchema?: KeySchemaElement[];
  type: 'HASH' | 'RANGE';
}): ddb.Attribute | undefined {
  const name = input.keySchema?.find(
    (x) => x.KeyType === input.type
  )?.AttributeName;
  const keyTypeString = input.attributeDefinitions?.find(
    (x) => x.AttributeName === name
  )?.AttributeType;
  let keyType: ddb.AttributeType | undefined;
  if (keyTypeString === 'S') {
    keyType = ddb.AttributeType.STRING;
  } else if (keyTypeString === 'N') {
    keyType = ddb.AttributeType.NUMBER;
  } else if (keyTypeString === 'B') {
    keyType = ddb.AttributeType.BINARY;
  }
  if (input.type === 'HASH') {
    if (!name || !keyType) {
      throw new Error('Missing key in table definition.');
    }
    return { name, type: keyType };
  } else {
    if (!name || !keyType) {
      return undefined;
    }
    return { name, type: keyType };
  }
}

/**
 * List SDK Global Secondary Indexes in a CDK format.
 */
function sdkGlobalSecondaryIndexesToCdk(input: {
  attributeDefinitions?: AttributeDefinition[];
  indexes?: GlobalSecondaryIndex[];
}): ddb.GlobalSecondaryIndexProps[] {
  const results: ddb.GlobalSecondaryIndexProps[] = [];
  for (const index of input.indexes || []) {
    const indexName = index.IndexName;
    if (!indexName) continue;
    const projectionTypeString = index.Projection?.ProjectionType;
    let projectionType: ddb.ProjectionType;
    if (projectionTypeString === 'ALL') {
      projectionType = ddb.ProjectionType.ALL;
    } else if (projectionTypeString === 'KEYS_ONLY') {
      projectionType = ddb.ProjectionType.KEYS_ONLY;
    } else if (projectionTypeString === 'INCLUDE') {
      projectionType = ddb.ProjectionType.INCLUDE;
    } else {
      continue;
    }
    results.push({
      indexName,
      partitionKey: sdkToCdk({
        attributeDefinitions: input.attributeDefinitions,
        keySchema: index.KeySchema,
        type: 'HASH',
      }),
      sortKey: sdkToCdk({
        attributeDefinitions: input.attributeDefinitions,
        keySchema: index.KeySchema,
        type: 'RANGE',
      }),
      projectionType,
      nonKeyAttributes: index.Projection?.NonKeyAttributes,
      readCapacity: index.ProvisionedThroughput?.ReadCapacityUnits,
      writeCapacity: index.ProvisionedThroughput?.WriteCapacityUnits,
    });
  }
  return results;
}

/**
 * List SDK Local Secondary Indexes in a CDK format.
 */
function sdkLocalSecondaryIndexesToCdk(input: {
  attributeDefinitions?: AttributeDefinition[];
  indexes?: LocalSecondaryIndex[];
}): ddb.LocalSecondaryIndexProps[] {
  const results: ddb.LocalSecondaryIndexProps[] = [];
  for (const index of input.indexes || []) {
    const indexName = index.IndexName;
    if (!indexName) continue;
    const projectionTypeString = index.Projection?.ProjectionType;
    let projectionType: ddb.ProjectionType;
    if (projectionTypeString === 'ALL') {
      projectionType = ddb.ProjectionType.ALL;
    } else if (projectionTypeString === 'KEYS_ONLY') {
      projectionType = ddb.ProjectionType.KEYS_ONLY;
    } else if (projectionTypeString === 'INCLUDE') {
      projectionType = ddb.ProjectionType.INCLUDE;
    } else {
      continue;
    }
    const sortKey = sdkToCdk({
      attributeDefinitions: input.attributeDefinitions,
      keySchema: index.KeySchema,
      type: 'RANGE',
    });
    if (!sortKey) continue;
    results.push({
      indexName,
      sortKey,
      projectionType,
      nonKeyAttributes: index.Projection?.NonKeyAttributes,
    });
  }
  return results;
}
