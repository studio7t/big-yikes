import { Handler, APIGatewayEvent } from 'aws-lambda';
import serverless, { Application } from 'serverless-http';
import { app } from './api';

const appHandler = serverless(app as unknown as Application, {
  basePath: '/api',
});

export const handler: Handler<APIGatewayEvent> = async (event, context) => {
  const result = await appHandler(event, context);
  return result;
};
