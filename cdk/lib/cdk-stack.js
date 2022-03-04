"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
class CdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
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
    }
}
exports.CdkStack = CdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUFnRDtBQUVoRCx5Q0FBeUM7QUFFekMseURBQXlEO0FBQ3pELE1BQWEsUUFBUyxTQUFRLG1CQUFLO0lBQ2pDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsK0JBQStCO1FBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ2hELFVBQVUsRUFBRSxnQ0FBZ0M7WUFDNUMsaUZBQWlGO1lBQ2pGLG9CQUFvQixFQUFFLFlBQVk7WUFDbEMsNkRBQTZEO1lBQzdELG9CQUFvQixFQUFFLFlBQVk7U0FDbkMsQ0FBQyxDQUFDO1FBRUgsMkNBQTJDO1FBQzNDLG9EQUFvRDtRQUNwRCwrQkFBK0I7UUFDL0IsaUJBQWlCO1FBQ2pCLDhCQUE4QjtRQUM5QixPQUFPO1FBQ1AsMENBQTBDO1FBQzFDLEtBQUs7UUFFTCxzREFBc0Q7UUFDdEQsTUFBTSw4QkFBOEIsR0FBRyxJQUFJLFVBQVUsQ0FBQyxvQkFBb0IsQ0FDeEUsSUFBSSxFQUNKLFVBQVUsQ0FDWCxDQUFDO1FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVoRSwwQkFBMEI7UUFDMUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQzNELElBQUksRUFDSixVQUFVLEVBQ1Y7WUFDRSxhQUFhLEVBQUU7Z0JBQ2I7b0JBQ0UsY0FBYyxFQUFFO3dCQUNkLGNBQWMsRUFBRSxNQUFNO3dCQUN0QixvQkFBb0IsRUFBRSw4QkFBOEI7cUJBQ3JEO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQ3pDO2FBQ0Y7U0FDRixDQUNGLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUE5Q0QsNEJBOENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgKiBhcyBzMyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXMzXCI7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSBcImF3cy1jZGstbGliL2F3cy1jbG91ZGZyb250XCI7XG5leHBvcnQgY2xhc3MgQ2RrU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gUzMgYnVja2V0IGZvciBzdGF0aWMgaG9zdGluZ1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgXCJSZWFjdEJ1Y2tldFwiLCB7XG4gICAgICBidWNrZXROYW1lOiBcImNkay1kZXBsb3ktcmVhY3QtYXBwLWRlbW8tMjAyMlwiLFxuICAgICAgLy8gYmxvY2tQdWJsaWNBY2Nlc3M6IG5ldyBzMy5CbG9ja1B1YmxpY0FjY2Vzcyh7IHJlc3RyaWN0UHVibGljQnVja2V0czogZmFsc2UgfSksXG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogXCJpbmRleC5odG1sXCIsXG4gICAgICAvLyBOb3Qgc3BlY2l5aW5nIGVycm9yIGRvY3VtZW50IGNhbiBhZmZlY3QgUmVhY3QgUm91dGVyIHVzYWdlXG4gICAgICB3ZWJzaXRlRXJyb3JEb2N1bWVudDogXCJpbmRleC5odG1sXCIsXG4gICAgfSk7XG5cbiAgICAvLyAvLyBBbGxvdyBwdWJsaWMgYWNjZXNzIHRvIGJ1Y2tldCBvYmplY3RzXG4gICAgLy8gY29uc3QgYnVja2V0SWFtUG9saWN5ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgIC8vICAgYWN0aW9uczogWydzMzpHZXRPYmplY3QnXSxcbiAgICAvLyAgIHJlc291cmNlczogW1xuICAgIC8vICAgICBgJHtidWNrZXQuYnVja2V0QXJufS8qYFxuICAgIC8vICAgXSxcbiAgICAvLyAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICAvLyB9KVxuXG4gICAgLy8gUmVzdHJpY3QgYnVja2V0IGFjY2VzcyB0byBDbG91ZEZyb250IG9ubHkgdXNpbmcgT0FJXG4gICAgY29uc3QgY2xvdWRGcm9udE9yaWdpbkFjY2Vzc0lkZW50aXR5ID0gbmV3IGNsb3VkZnJvbnQuT3JpZ2luQWNjZXNzSWRlbnRpdHkoXG4gICAgICB0aGlzLFxuICAgICAgXCJSZWFjdE9BSVwiXG4gICAgKTtcbiAgICBidWNrZXQuZ3JhbnRSZWFkKGNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eS5ncmFudFByaW5jaXBhbCk7XG5cbiAgICAvLyBDcmVhdGUgQ0ROIGRpc3RyaWJ1dGlvblxuICAgIGNvbnN0IGRpc3RyaWJ1dGlvbiA9IG5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oXG4gICAgICB0aGlzLFxuICAgICAgXCJSZWFjdENETlwiLFxuICAgICAge1xuICAgICAgICBvcmlnaW5Db25maWdzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IGJ1Y2tldCxcbiAgICAgICAgICAgICAgb3JpZ2luQWNjZXNzSWRlbnRpdHk6IGNsb3VkRnJvbnRPcmlnaW5BY2Nlc3NJZGVudGl0eSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFt7IGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9XG4gICAgKTtcbiAgfVxufVxuIl19