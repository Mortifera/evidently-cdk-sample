import { Construct } from 'constructs';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/lib/custom-resources';
import { Stack } from 'aws-cdk-lib';
import { EvidentlyProjectCreateProjectProps, EvidentlyProjectDataDelivery, EvidentlyProjectDeleteProjectProps, EvidentlyProjectUpdateProjectProps } from './models';
import { assert } from 'console';
import { PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/lib/aws-iam';

export interface EvidentlyProjectProps {
    name: string;
    description?: string;
    dataDelivery?: EvidentlyProjectDataDelivery;
}


export class EvidentlyProject extends Construct {
    public readonly projectName: string;

    constructor(scope: Construct, id: string, props: EvidentlyProjectProps) {
        super(scope, id);

        this.projectName = props.name;

        assert(new RegExp('[a-z\-\_]+').test(props.name));

        const projectArn = this.getArn();

        const createProjectProps: EvidentlyProjectCreateProjectProps = {
            name: props.name,
            description: props.description,
            dataDelivery: props.dataDelivery ? {
                s3Destination: props.dataDelivery.s3Destination ? {
                    bucket: props.dataDelivery.s3Destination.bucket?.bucketName,
                    prefix: props.dataDelivery.s3Destination.prefix
                } : undefined,
                cloudWatchLogs: props.dataDelivery.cloudWatchLogs ? {
                    logGroup: props.dataDelivery.cloudWatchLogs.logGroup.logGroupName
                } : undefined
            } : undefined
        };
        const updateProjectProps: EvidentlyProjectUpdateProjectProps = {
            description: props.description
        };
        const deleteProjectProps: EvidentlyProjectDeleteProjectProps = {
            project: props.name
        };

        assert(xor(createProjectProps.dataDelivery?.cloudWatchLogs, createProjectProps.dataDelivery?.s3Destination));

        const physicalResourceId = PhysicalResourceId.of(`${id}-${props.name}`);

        const customResource = new AwsCustomResource(this, "ProjectCustomResource", {
            onCreate: {
                service: 'Evidently',
                action: 'createProject',
                physicalResourceId: physicalResourceId,
                parameters: createProjectProps
            },
            onUpdate: {
                service: 'Evidently',
                action: 'updateProject',
                physicalResourceId: physicalResourceId,
                parameters: updateProjectProps
            },
            onDelete: {
                service: 'Evidently',
                action: 'deleteProject',
                physicalResourceId: physicalResourceId,
                parameters: deleteProjectProps
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: [projectArn] })
        });

        props.dataDelivery?.s3Destination?.bucket?.addToResourcePolicy(new PolicyStatement({
            principals: [ new ServicePrincipal("evidently.amazonaws.com")],
            actions: [
                "s3:*",
                "s3:*"
            ],
            resources: [ props.dataDelivery?.s3Destination?.bucket?.arnForObjects(props.dataDelivery?.s3Destination?.prefix + "*") ]
        }));
        props.dataDelivery?.s3Destination?.bucket?.addToResourcePolicy(new PolicyStatement({
            principals: [ new ServicePrincipal("evidently.amazonaws.com")],
            actions: [ "s3:*" ],
            resources: [ props.dataDelivery?.s3Destination?.bucket?.bucketArn ]
        }));
    }

    public getArn(): string {
        return `arn:aws:evidently:${Stack.of(this).region}:${Stack.of(this).account}:project/${this.projectName}`;
    }
}

function xor(a?: any, b?:any) {
    return ( a || b ) && !( a && b );
}