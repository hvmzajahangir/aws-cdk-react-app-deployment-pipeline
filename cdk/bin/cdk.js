#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const cdk_stack_1 = require("../lib/cdk-stack");
const app = new cdk.App();
new cdk_stack_1.CdkStack(app, "CdkStack", {
    github: {
        owner: "hvmzajahangir",
        repository: "my-react-app",
    },
    env: { region: "eu-west-2" },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsZ0RBQTRDO0FBRTVDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksb0JBQVEsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFO0lBQzVCLE1BQU0sRUFBRTtRQUNOLEtBQUssRUFBRSxlQUFlO1FBQ3RCLFVBQVUsRUFBRSxjQUFjO0tBQzNCO0lBQ0QsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtDQUM3QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgXCJzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXJcIjtcbmltcG9ydCAqIGFzIGNkayBmcm9tIFwiYXdzLWNkay1saWJcIjtcbmltcG9ydCB7IENka1N0YWNrIH0gZnJvbSBcIi4uL2xpYi9jZGstc3RhY2tcIjtcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBDZGtTdGFjayhhcHAsIFwiQ2RrU3RhY2tcIiwge1xuICBnaXRodWI6IHtcbiAgICBvd25lcjogXCJodm16YWphaGFuZ2lyXCIsXG4gICAgcmVwb3NpdG9yeTogXCJteS1yZWFjdC1hcHBcIixcbiAgfSxcbiAgZW52OiB7IHJlZ2lvbjogXCJldS13ZXN0LTJcIiB9LFxufSk7XG4iXX0=