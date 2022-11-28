// TODO: ZIPS

import { join } from 'path';

import * as cdk from 'aws-cdk-lib';
import * as cf from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3deployment from 'aws-cdk-lib/aws-s3-deployment';

import { ClientConstruct } from '@big-yikes/client/lib/client-stack';
import { ServerConstruct } from '@big-yikes/server/lib/server-stack';

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the API construct
    const api = new ServerConstruct(this, 'Server', {
      zipFile: join(process.cwd(), '../server/out/server.zip'),
    });

    // Create the client construct
    const client = new ClientConstruct(this, 'Client');

    // Create the Origin Access Identity
    const oai = new cf.OriginAccessIdentity(this, 'OAI');

    // Grant permissions on the bucket to the OAI
    client.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [client.bucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    // Create the redirect lambda
    const redirect = new cf.experimental.EdgeFunction(
      this,
      'RedirectFunction',
      {
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: 'redirect.handler',
        code: lambda.Code.fromAsset(join(process.cwd(), './out/redirect.zip')),
      }
    );

    // Create the CloudFront Origin for the client
    const bucketOrigin = new origins.S3Origin(client.bucket, {
      originAccessIdentity: oai,
    });

    // Create the CloudFront Origin for the API
    const apiOrigin = new origins.RestApiOrigin(api.gateway);

    // Create the CloudFront distribution
    const distribution = new cf.Distribution(this, 'Distribution', {
      comment: 'Big Yikes',
      defaultBehavior: {
        origin: bucketOrigin,
        allowedMethods: cf.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cf.CachePolicy.CACHING_OPTIMIZED,
        viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        edgeLambdas: [
          {
            functionVersion: redirect.currentVersion,
            eventType: cf.LambdaEdgeEventType.ORIGIN_REQUEST,
          },
        ],
      },
      additionalBehaviors: {
        '/api': {
          origin: apiOrigin,
          allowedMethods: cf.AllowedMethods.ALLOW_ALL,
          cachePolicy: cf.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        '/api/*': {
          origin: apiOrigin,
          allowedMethods: cf.AllowedMethods.ALLOW_ALL,
          cachePolicy: cf.CachePolicy.CACHING_DISABLED,
          viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      },
    });

    // Create the bucket deployment
    new s3deployment.BucketDeployment(this, 'ClientDeployment', {
      destinationBucket: client.bucket,
      sources: [
        s3deployment.Source.asset(
          join(process.cwd(), '../client/out/client.zip')
        ),
      ],
      distribution: distribution,
      distributionPaths: ['/*'],
    });
  }
}
