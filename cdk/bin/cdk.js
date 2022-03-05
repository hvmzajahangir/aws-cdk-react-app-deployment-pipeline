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
        branch: "main",
        GithubTokenName: "GithubPersonalAccessToken",
    },
    env: { region: "eu-west-2" },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2RrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsZ0RBQTRDO0FBRTVDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksb0JBQVEsQ0FBQyxHQUFHLEVBQUUsVUFBVSxFQUFFO0lBQzVCLE1BQU0sRUFBRTtRQUNOLEtBQUssRUFBRSxlQUFlO1FBQ3RCLFVBQVUsRUFBRSxjQUFjO1FBQzFCLE1BQU0sRUFBRSxNQUFNO1FBQ2QsZUFBZSxFQUFFLDJCQUEyQjtLQUM3QztJQUNELEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7Q0FDN0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCI7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgeyBDZGtTdGFjayB9IGZyb20gXCIuLi9saWIvY2RrLXN0YWNrXCI7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgQ2RrU3RhY2soYXBwLCBcIkNka1N0YWNrXCIsIHtcbiAgZ2l0aHViOiB7XG4gICAgb3duZXI6IFwiaHZtemFqYWhhbmdpclwiLFxuICAgIHJlcG9zaXRvcnk6IFwibXktcmVhY3QtYXBwXCIsXG4gICAgYnJhbmNoOiBcIm1haW5cIixcbiAgICBHaXRodWJUb2tlbk5hbWU6IFwiR2l0aHViUGVyc29uYWxBY2Nlc3NUb2tlblwiLFxuICB9LFxuICBlbnY6IHsgcmVnaW9uOiBcImV1LXdlc3QtMlwiIH0sXG59KTtcbiJdfQ==