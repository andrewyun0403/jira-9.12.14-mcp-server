#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { jiraClient } from "./jira/client.js";
import { 
  jqlSearchTool, 
  getIssueTool, 
  jqlSearchSchema, 
  getIssueSchema,
  JQLSearchArgs,
  GetIssueArgs
} from "./jira/tools.js";

// Create the MCP server
const server = new Server(
  {
    name: "jira-9.12.14-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [jqlSearchTool, getIssueTool],
  };
});

// Handle tool execution
server.setRequestHandler(
  CallToolRequestSchema,
  async (request: CallToolRequest) => {
    try {
      if (!request.params.arguments) {
        throw new Error("Arguments are required");
      }

      switch (request.params.name) {
        // Handle JQL search
        case "mcp_jira_jql_search": {
          const args = jqlSearchSchema.parse(request.params.arguments);
          
          // Call the Jira API
          const response = await jiraClient.jqlSearch(
            args.jql,
            args.fields,
            args.maxResults,
            args.startAt,
            args.expand
          );

          // Format the response in a readable way
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }
        
        // Handle get issue
        case "mcp_jira_get_issue": {
          const args = getIssueSchema.parse(request.params.arguments);
          
          // Call the Jira API
          const response = await jiraClient.getIssue(
            args.issueIdOrKey,
            args.fields,
            args.expand
          );

          // Format the response in a readable way
          return {
            content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
          };
        }

        default:
          throw new Error(`Unknown tool: ${request.params.name}`);
      }
    } catch (error) {
      console.error("Error executing tool:", error);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error instanceof Error ? error.message : String(error),
            }, null, 2),
          },
        ],
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Jira 9.12.14 MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
}); 