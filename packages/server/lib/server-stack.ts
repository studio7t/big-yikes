import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

interface ServerConstructProps {
  zipFile: string;
}
export class ServerConstruct extends Construct {
  lambda: lambda.Function;
  gateway: apigw.LambdaRestApi;
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
  }
}
