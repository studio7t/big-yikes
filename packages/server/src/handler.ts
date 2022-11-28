import awsLambdaFastify from '@fastify/aws-lambda';
import { app } from './api';

const proxy = awsLambdaFastify(app);

exports.handler = proxy;
