#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";

const app = new cdk.App();
new CdkStack(app, "CdkStack", {
  github: {
    owner: "hvmzajahangir",
    repository: "my-react-app",
  },
  env: { region: "eu-west-2" },
});
