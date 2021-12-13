import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EvidentlyProject } from './constructs/evidently-project';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';

export class EvidentlyCdkInfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const customEventsBucketStore = new Bucket(this, "EventsStoreBucket", {
            encryption: BucketEncryption.S3_MANAGED,
            lifecycleRules: [ {
                expiration: Duration.days(30)
            }],
            removalPolicy: RemovalPolicy.DESTROY // Only for testing
        });

        new EvidentlyProject(this, "Project", {
            name: "test-name",
            dataDelivery: {
                s3Destination: {
                    bucket: customEventsBucketStore,
                    prefix: "events"
                }
            }
        });
    }
}
