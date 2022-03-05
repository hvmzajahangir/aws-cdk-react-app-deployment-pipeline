"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const CodeBuild = require("aws-cdk-lib/aws-codebuild");
const CodePipeline = require("aws-cdk-lib/aws-codepipeline");
const CodePipelineAction = require("aws-cdk-lib/aws-codepipeline-actions");
const SecretsManager = require("aws-cdk-lib/aws-secretsmanager");
class CdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // S3 bucket for static hosting
        const bucket = new s3.Bucket(this, "ReactBucket", {
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "index.html",
        });
        // Restrict bucket access to CloudFront only using OAI
        const cloudFrontOriginAccessIdentity = new cloudfront.OriginAccessIdentity(this, "ReactOAI");
        bucket.grantRead(cloudFrontOriginAccessIdentity.grantPrincipal);
        // Create CDN distribution
        const distribution = new cloudfront.CloudFrontWebDistribution(this, "ReactCDN", {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: bucket,
                        originAccessIdentity: cloudFrontOriginAccessIdentity,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
        });
        // Artifacts produced by CodeBuild
        const outputSources = new CodePipeline.Artifact();
        const outputApp = new CodePipeline.Artifact();
        // Pipeline
        const pipeline = new CodePipeline.Pipeline(this, "Pipeline", {
            pipelineName: "ReactApp",
            restartExecutionOnUpdate: true,
        });
        const githubPersonalAccessToken = SecretsManager.Secret.fromSecretNameV2(this, "GithubPersonalAccessToken", "GithubPersonalAccessToken");
        // Stage 1: clone sources from repo
        pipeline.addStage({
            stageName: "Source",
            actions: [
                new CodePipelineAction.GitHubSourceAction({
                    actionName: "Checkout",
                    repo: props.github.repository,
                    owner: props.github.owner,
                    oauthToken: githubPersonalAccessToken.secretValue,
                    branch: "main",
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
                        buildSpec: CodeBuild.BuildSpec.fromSourceFilename("./buildspec.yml"),
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
        new aws_cdk_lib_1.CfnOutput(this, "AppURL", {
            value: distribution.distributionDomainName,
            description: "Web app URL",
            exportName: "AppURL",
        });
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUF3RTtBQUV4RSx5Q0FBeUM7QUFDekMseURBQXlEO0FBQ3pELHVEQUF1RDtBQUN2RCw2REFBNkQ7QUFDN0QsMkVBQTJFO0FBQzNFLGlFQUFpRTtBQVFqRSxNQUFhLFFBQVMsU0FBUSxtQkFBSztJQUNqQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLCtCQUErQjtRQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNoRCxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLG9CQUFvQixFQUFFLFlBQVk7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsc0RBQXNEO1FBQ3RELE1BQU0sOEJBQThCLEdBQUcsSUFBSSxVQUFVLENBQUMsb0JBQW9CLENBQ3hFLElBQUksRUFDSixVQUFVLENBQ1gsQ0FBQztRQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFaEUsMEJBQTBCO1FBQzFCLE1BQU0sWUFBWSxHQUFHLElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUMzRCxJQUFJLEVBQ0osVUFBVSxFQUNWO1lBQ0UsYUFBYSxFQUFFO2dCQUNiO29CQUNFLGNBQWMsRUFBRTt3QkFDZCxjQUFjLEVBQUUsTUFBTTt3QkFDdEIsb0JBQW9CLEVBQUUsOEJBQThCO3FCQUNyRDtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxDQUFDO2lCQUN6QzthQUNGO1NBQ0YsQ0FDRixDQUFDO1FBRUYsa0NBQWtDO1FBQ2xDLE1BQU0sYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xELE1BQU0sU0FBUyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRTlDLFdBQVc7UUFDWCxNQUFNLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMzRCxZQUFZLEVBQUUsVUFBVTtZQUN4Qix3QkFBd0IsRUFBRSxJQUFJO1NBQy9CLENBQUMsQ0FBQztRQUVILE1BQU0seUJBQXlCLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FDdEUsSUFBSSxFQUNKLDJCQUEyQixFQUMzQiwyQkFBMkIsQ0FDNUIsQ0FBQztRQUVGLG1DQUFtQztRQUNuQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxJQUFJLGtCQUFrQixDQUFDLGtCQUFrQixDQUFDO29CQUN4QyxVQUFVLEVBQUUsVUFBVTtvQkFDdEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVTtvQkFDN0IsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztvQkFDekIsVUFBVSxFQUFFLHlCQUF5QixDQUFDLFdBQVc7b0JBQ2pELE1BQU0sRUFBRSxNQUFNO29CQUNkLE1BQU0sRUFBRSxhQUFhO29CQUNyQixPQUFPLEVBQUUsa0JBQWtCLENBQUMsYUFBYSxDQUFDLE9BQU87aUJBQ2xELENBQUM7YUFDSDtTQUNGLENBQUMsQ0FBQztRQUVILDZDQUE2QztRQUM3QyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2hCLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLGtCQUFrQixDQUFDLGVBQWUsQ0FBQztvQkFDckMsVUFBVSxFQUFFLFVBQVU7b0JBQ3RCLE9BQU8sRUFBRSxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTt3QkFDNUQsV0FBVyxFQUFFLFVBQVU7d0JBQ3ZCLFNBQVMsRUFDUCxTQUFTLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDO3dCQUMzRCxXQUFXLEVBQUU7NEJBQ1gsVUFBVSxFQUFFLFNBQVMsQ0FBQyxlQUFlLENBQUMsWUFBWTt5QkFDbkQ7cUJBQ0YsQ0FBQztvQkFDRixLQUFLLEVBQUUsYUFBYTtvQkFDcEIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUNyQixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCx3QkFBd0I7UUFDeEIsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUNoQixTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxrQkFBa0IsQ0FBQyxjQUFjLENBQUM7b0JBQ3BDLFVBQVUsRUFBRSxVQUFVO29CQUN0QixLQUFLLEVBQUUsU0FBUztvQkFDaEIsTUFBTSxFQUFFLE1BQU07aUJBQ2YsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDNUIsS0FBSyxFQUFFLFlBQVksQ0FBQyxzQkFBc0I7WUFDMUMsV0FBVyxFQUFFLGFBQWE7WUFDMUIsVUFBVSxFQUFFLFFBQVE7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBeEdELDRCQXdHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFja1Byb3BzLCBTZWNyZXRWYWx1ZSwgQ2ZuT3V0cHV0IH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tIFwiY29uc3RydWN0c1wiO1xuaW1wb3J0ICogYXMgczMgZnJvbSBcImF3cy1jZGstbGliL2F3cy1zM1wiO1xuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNsb3VkZnJvbnRcIjtcbmltcG9ydCAqIGFzIENvZGVCdWlsZCBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZFwiO1xuaW1wb3J0ICogYXMgQ29kZVBpcGVsaW5lIGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lXCI7XG5pbXBvcnQgKiBhcyBDb2RlUGlwZWxpbmVBY3Rpb24gZnJvbSBcImF3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9uc1wiO1xuaW1wb3J0ICogYXMgU2VjcmV0c01hbmFnZXIgZnJvbSBcImF3cy1jZGstbGliL2F3cy1zZWNyZXRzbWFuYWdlclwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpcGVsaW5lUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgZ2l0aHViOiB7XG4gICAgb3duZXI6IHN0cmluZztcbiAgICByZXBvc2l0b3J5OiBzdHJpbmc7XG4gIH07XG59XG5leHBvcnQgY2xhc3MgQ2RrU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBTMyBidWNrZXQgZm9yIHN0YXRpYyBob3N0aW5nXG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBcIlJlYWN0QnVja2V0XCIsIHtcbiAgICAgIHdlYnNpdGVJbmRleERvY3VtZW50OiBcImluZGV4Lmh0bWxcIixcbiAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiBcImluZGV4Lmh0bWxcIiwgLy8gcmVjb21tZW5kZWQgdG8gYXZvaWQgYnVncyB3aXRoIFJlYWN0IFJvdXRpbmcgZXRjLlxuICAgIH0pO1xuXG4gICAgLy8gUmVzdHJpY3QgYnVja2V0IGFjY2VzcyB0byBDbG91ZEZyb250IG9ubHkgdXNpbmcgT0FJXG4gICAgY29uc3QgY2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5ID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzSWRlbnRpdHkoXG4gICAgICB0aGlzLFxuICAgICAgXCJSZWFjdE9BSVwiXG4gICAgKTtcbiAgICBidWNrZXQuZ3JhbnRSZWFkKGNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eS5ncmFudFByaW5jaXBhbCk7XG5cbiAgICAvLyBDcmVhdGUgQ0ROIGRpc3RyaWJ1dGlvblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJSZWFjdENETlwiLFxuICAgICAge1xuICAgICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IGJ1Y2tldCxcbiAgICAgICAgICAgICAgb3JpZ2luQWNjZXNzSWRlbnRpdHk6IGNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8vIEFydGlmYWN0cyBwcm9kdWNlZCBieSBDb2RlQnVpbGRcbiAgICBjb25zdCBvdXRwdXRTb3VyY2VzID0gbmV3IENvZGVQaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IG91dHB1dEFwcCA9IG5ldyBDb2RlUGlwZWxpbmUuQXJ0aWZhY3QoKTtcblxuICAgIC8vIFBpcGVsaW5lXG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgQ29kZVBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsIFwiUGlwZWxpbmVcIiwge1xuICAgICAgcGlwZWxpbmVOYW1lOiBcIlJlYWN0QXBwXCIsXG4gICAgICByZXN0YXJ0RXhlY3V0aW9uT25VcGRhdGU6IHRydWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBnaXRodWJQZXJzb25hbEFjY2Vzc1Rva2VuID0gU2VjcmV0c01hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXROYW1lVjIoXG4gICAgICB0aGlzLFxuICAgICAgXCJHaXRodWJQZXJzb25hbEFjY2Vzc1Rva2VuXCIsXG4gICAgICBcIkdpdGh1YlBlcnNvbmFsQWNjZXNzVG9rZW5cIlxuICAgICk7XG5cbiAgICAvLyBTdGFnZSAxOiBjbG9uZSBzb3VyY2VzIGZyb20gcmVwb1xuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogXCJTb3VyY2VcIixcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IENvZGVQaXBlbGluZUFjdGlvbi5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6IFwiQ2hlY2tvdXRcIixcbiAgICAgICAgICByZXBvOiBwcm9wcy5naXRodWIucmVwb3NpdG9yeSxcbiAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0aHViLm93bmVyLFxuICAgICAgICAgIG9hdXRoVG9rZW46IGdpdGh1YlBlcnNvbmFsQWNjZXNzVG9rZW4uc2VjcmV0VmFsdWUsXG4gICAgICAgICAgYnJhbmNoOiBcIm1haW5cIixcbiAgICAgICAgICBvdXRwdXQ6IG91dHB1dFNvdXJjZXMsXG4gICAgICAgICAgdHJpZ2dlcjogQ29kZVBpcGVsaW5lQWN0aW9uLkdpdEh1YlRyaWdnZXIuV0VCSE9PSyxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gU3RhZ2UgMjogQnVpbGQgUmVhY3QgYXBwIGFuZCBDREsgcmVzb3VyY2VzXG4gICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgc3RhZ2VOYW1lOiBcIkJ1aWxkXCIsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBDb2RlUGlwZWxpbmVBY3Rpb24uQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiBcIlJlYWN0QXBwXCIsXG4gICAgICAgICAgcHJvamVjdDogbmV3IENvZGVCdWlsZC5QaXBlbGluZVByb2plY3QodGhpcywgXCJCdWlsZFJlYWN0QXBwXCIsIHtcbiAgICAgICAgICAgIHByb2plY3ROYW1lOiBcIlJlYWN0QXBwXCIsXG4gICAgICAgICAgICBidWlsZFNwZWM6XG4gICAgICAgICAgICAgIENvZGVCdWlsZC5CdWlsZFNwZWMuZnJvbVNvdXJjZUZpbGVuYW1lKFwiLi9idWlsZHNwZWMueW1sXCIpLFxuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICAgICAgYnVpbGRJbWFnZTogQ29kZUJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF81XzAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGlucHV0OiBvdXRwdXRTb3VyY2VzLFxuICAgICAgICAgIG91dHB1dHM6IFtvdXRwdXRBcHBdLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBTdGFnZSAzOiBkZXBsb3kgdG8gUzNcbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6IFwiRGVwbG95XCIsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBDb2RlUGlwZWxpbmVBY3Rpb24uUzNEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6IFwiUmVhY3RBcHBcIixcbiAgICAgICAgICBpbnB1dDogb3V0cHV0QXBwLFxuICAgICAgICAgIGJ1Y2tldDogYnVja2V0LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsIFwiQXBwVVJMXCIsIHtcbiAgICAgIHZhbHVlOiBkaXN0cmlidXRpb24uZGlzdHJpYnV0aW9uRG9tYWluTmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uOiBcIldlYiBhcHAgVVJMXCIsXG4gICAgICBleHBvcnROYW1lOiBcIkFwcFVSTFwiLFxuICAgIH0pO1xuICB9XG59XG4iXX0=