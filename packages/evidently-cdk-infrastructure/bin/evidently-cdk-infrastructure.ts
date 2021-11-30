#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { EvidentlyCdkInfrastructureStack } from '../lib/evidently-cdk-infrastructure-stack';

export const app = new cdk.App();
new EvidentlyCdkInfrastructureStack(app, 'EvidentlyCdkInfrastructureStack', {
    
});