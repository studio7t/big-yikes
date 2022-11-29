import { PutCommand, QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { DocumentDB, BaseTable } from '../db';

export async function route() {
  // Create a settings entry.
  await DocumentDB.send(
    new PutCommand({
      TableName: BaseTable.options.TableName,
      Item: {
        userId: 'matootie',
        compoundId: 'settings',
        darkMode: true,
        theme: 'dark',
      },
    })
  );

  // Get the settings entry.
  await DocumentDB.send(
    new GetCommand({
      TableName: BaseTable.options.TableName,
      Key: {
        userId: 'matootie',
        compoundId: 'settings',
      },
    })
  );

  // Add a new discovery.
  await DocumentDB.send(
    new PutCommand({
      TableName: BaseTable.options.TableName,
      Item: {
        userId: 'matootie',
        compoundId: 'discovery|2022-11-28|1epndkc29859j3',
        details: 'something',
      },
    })
  );

  // Query all discoveries from 2022.
  await DocumentDB.send(
    new QueryCommand({
      TableName: BaseTable.options.TableName,
      KeyConditionExpression:
        'userId = matootie AND begins_with(compoundId, discovery|2022)',
    })
  );

  return {};
}
