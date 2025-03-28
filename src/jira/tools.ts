import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// JQL search schema and tool definition
export const jqlSearchSchema = z.object({
  jql: z.string().describe("JQL query string"),
  fields: z.array(z.string()).optional().describe("List of fields to return for each issue"),
  maxResults: z.number().optional().describe("Maximum results to fetch"),
  startAt: z.number().optional().describe("Starting index of the first issue to return"),
  expand: z.string().optional().describe("Additional info to include in the response")
});

export type JQLSearchArgs = z.infer<typeof jqlSearchSchema>;

export const jqlSearchTool: Tool = {
  name: "mcp_jira_jql_search",
  description: "Perform enhanced JQL search in Jira",
  inputSchema: {
    type: "object",
    required: ["jql"],
    properties: {
      jql: {
        type: "string",
        description: "JQL query string"
      },
      fields: {
        type: "array",
        items: {
          type: "string"
        },
        description: "List of fields to return for each issue"
      },
      maxResults: {
        type: "integer",
        description: "Maximum results to fetch"
      },
      nextPageToken: {
        type: "string",
        description: "Token for next page"
      },
      expand: {
        type: "string",
        description: "Additional info to include in the response"
      }
    }
  }
};

// Get issue schema and tool definition
export const getIssueSchema = z.object({
  issueIdOrKey: z.string().describe("ID or key of the issue"),
  fields: z.array(z.string()).optional().describe("Fields to include in the response"),
  expand: z.string().optional().describe("Additional information to include in the response"),
  properties: z.array(z.string()).optional().describe("Properties to include in the response"),
  failFast: z.boolean().default(false).describe("Fail quickly on errors")
});

export type GetIssueArgs = z.infer<typeof getIssueSchema>;

export const getIssueTool: Tool = {
  name: "mcp_jira_get_issue",
  description: "Retrieve details about an issue by its ID or key.",
  inputSchema: {
    type: "object",
    required: ["issueIdOrKey"],
    properties: {
      issueIdOrKey: {
        type: "string",
        description: "ID or key of the issue"
      },
      fields: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Fields to include in the response"
      },
      expand: {
        type: "string",
        description: "Additional information to include in the response"
      },
      properties: {
        type: "array",
        items: {
          type: "string"
        },
        description: "Properties to include in the response"
      },
      failFast: {
        type: "boolean",
        description: "Fail quickly on errors",
        default: false
      }
    }
  }
}; 