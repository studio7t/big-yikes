#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'BigYikesStack', {
  description: 'Stack for the Big Yikes project',
  env: {
    region: 'us-east-1',
  },
});
