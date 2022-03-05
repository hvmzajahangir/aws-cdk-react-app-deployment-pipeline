import { Stack, StackProps, SecretValue, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as CodeBuild from "aws-cdk-lib/aws-codebuild";
import * as CodePipeline from "aws-cdk-lib/aws-codepipeline";
import * as CodePipelineAction from "aws-cdk-lib/aws-codepipeline-actions";
import * as SecretsManager from "aws-cdk-lib/aws-secretsmanager";

export interface PipelineProps extends StackProps {
  github: {
    owner: string;
    repository: string;
    branch: string;
    GithubTokenName: string;
  };
}
export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props: PipelineProps) {
    super(scope, id, props);

    // S3 bucket for static hosting
    const bucket = new s3.Bucket(this, "ReactBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html", // recommended to avoid bugs with React Routing etc.
    });

    // Restrict bucket access to CloudFront only using OAI
    const cloudFrontOriginAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "ReactOAI"
    );
    bucket.grantRead(cloudFrontOriginAccessIdentity.grantPrincipal);

    // Create CDN distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "ReactCDN",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: cloudFrontOriginAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    // Artifacts produced by CodeBuild
    const outputSources = new CodePipeline.Artifact();
    const outputApp = new CodePipeline.Artifact();

    // Pipeline
    const pipeline = new CodePipeline.Pipeline(this, "Pipeline", {
      pipelineName: "ReactApp",
      restartExecutionOnUpdate: true,
    });

    const githubPersonalAccessToken = SecretsManager.Secret.fromSecretNameV2(
      this,
      "GithubPersonalAccessToken",
      props.github.GithubTokenName
    );

    // Stage 1: clone sources from repo
    pipeline.addStage({
      stageName: "Source",
      actions: [
        new CodePipelineAction.GitHubSourceAction({
          actionName: "Checkout",
          repo: props.github.repository,
          owner: props.github.owner,
          oauthToken: githubPersonalAccessToken.secretValue,
          branch: props.github.branch,
          output: outputSources,
          trigger: CodePipelineAction.GitHubTrigger.WEBHOOK,
        }),
      ],
    });

    // Stage 2: Build React app and CDK resources
    pipeline.addStage({
      stageName: "Build",
      actions: [
        new CodePipelineAction.CodeBuildAction({
          actionName: "ReactApp",
          project: new CodeBuild.PipelineProject(this, "BuildReactApp", {
            projectName: "ReactApp",
            buildSpec:
              CodeBuild.BuildSpec.fromSourceFilename("./buildspec.yml"),
            environment: {
              buildImage: CodeBuild.LinuxBuildImage.STANDARD_5_0,
            },
          }),
          input: outputSources,
          outputs: [outputApp],
        }),
      ],
    });

    // Stage 3: deploy to S3
    pipeline.addStage({
      stageName: "Deploy",
      actions: [
        new CodePipelineAction.S3DeployAction({
          actionName: "ReactApp",
          input: outputApp,
          bucket: bucket,
        }),
      ],
    });

    new CfnOutput(this, "AppURL", {
      value: distribution.distributionDomainName,
      description: "Web app URL",
      exportName: "AppURL",
    });
  }
}
