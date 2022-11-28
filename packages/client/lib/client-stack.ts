import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deployment from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class ClientConstruct extends Construct {
  bucket: s3.Bucket;
  deployment: s3deployment.BucketDeployment;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create the bucket
    this.bucket = new s3.Bucket(this, 'ClientBucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
  }
}
