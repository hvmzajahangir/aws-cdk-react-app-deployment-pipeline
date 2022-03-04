import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3 bucket for static hosting
    const bucket = new s3.Bucket(this, "ReactBucket", {
      bucketName: "cdk-deploy-react-app-demo-2022",
      // blockPublicAccess: new s3.BlockPublicAccess({ restrictPublicBuckets: false }),
      websiteIndexDocument: "index.html",
      // Not speciying error document can affect React Router usage
      websiteErrorDocument: "index.html",
    });

    // // Allow public access to bucket objects
    // const bucketIamPolicy = new iam.PolicyStatement({
    //   actions: ['s3:GetObject'],
    //   resources: [
    //     `${bucket.bucketArn}/*`
    //   ],
    //   principals: [new iam.AnyPrincipal()],
    // })

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
  }
}
