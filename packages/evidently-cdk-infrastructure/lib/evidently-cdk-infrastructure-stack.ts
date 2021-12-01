import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EvidentlyProject } from './constructs/evidently-project';

export class EvidentlyCdkInfrastructureStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        new EvidentlyProject(this, "Project", {
            name: "test-name"
        });
    }
}
