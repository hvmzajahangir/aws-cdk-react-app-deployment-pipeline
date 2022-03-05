import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
export interface PipelineProps extends StackProps {
    github: {
        owner: string;
        repository: string;
    };
}
export declare class CdkStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineProps);
}
