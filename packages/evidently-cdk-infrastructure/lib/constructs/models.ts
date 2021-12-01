import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export interface EvidentlyProjectDataDelivery {
    cloudWatchLogs?: {
        "logGroup": logs.ILogGroup;
    };
    s3Destination?: {
        bucket: s3.IBucket;
        prefix: string;
    };
}

export interface EvidentlyProjectCreateProjectProps {
    "name": string,
    "dataDelivery"?: {
        cloudWatchLogs?: {
            "logGroup": string;
        };
        s3Destination?: {
            bucket: string;
            prefix: string;
        };
    };

    "description"?: string,
    "tags"?: Record<string, string>;
};


export interface EvidentlyProjectUpdateProjectProps {
    "description"?: string;
};

export interface EvidentlyProjectDeleteProjectProps {
    project: string;
};