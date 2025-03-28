# Jira 9.12.14 MCP Server

This is a Model Context Protocol (MCP) server implementation for the Jira 9.12.14 API. It allows AI models like Claude to securely interact with Jira through well-defined tools.

## Features

- **JQL Search**: Execute JQL queries to find issues in Jira
- **Get Issue**: Retrieve detailed information about a specific issue by ID or key

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Jira instance
- Authentication credentials for Jira API

## Installation

### Option 1: Using npx (Recommended)

The easiest way to use this MCP server is with npx:

```bash
# Create a directory for your configuration
mkdir jira-mcp && cd jira-mcp

# Create .env file with your credentials
cat > .env << EOL
JIRA_API_URL=https://your-domain.atlassian.net
JIRA_AUTH_TOKEN=your-token-here
EOL

# Run the server directly
npx jira-9.12.14-mcp-server
```

### Option 2: Manual Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Configuration

### Environment Variables

The server reads configuration from a `.env` file in the current directory. Create a file named `.env` with the following settings:

```
JIRA_API_URL=https://your-domain.atlassian.net
JIRA_AUTH_TOKEN=your-jira-token
```

You must create this file in the directory where you run the server.

- `JIRA_API_URL`: The base URL of your Jira instance (e.g., `https://your-domain.atlassian.net`)
- `JIRA_AUTH_TOKEN`: Your Jira API token or Personal Access Token (PAT)

### Getting a Jira API Token

1. Log in to your Atlassian account
2. Go to Account Settings > Security > Create and manage API tokens
3. Click "Create API token"
4. Give it a name like "MCP Server"
5. Copy the generated token to your `.env` file

## Usage

### Running the server

```bash
npm start
```

### Integration with Claude for Desktop

1. Open your Claude for Desktop App configuration at `~/Library/Application Support/Claude/claude_desktop_config.json` (MacOS) or `%AppData%\Claude\claude_desktop_config.json` (Windows)
2. Add the server configuration:

```json
{
  "mcpServers": {
    "jira": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/jira-9.12.14-mcp-server/dist/index.js"
      ]
    }
  }
}
```

Replace `/ABSOLUTE/PATH/TO/` with the actual path to the server on your system.

#### Using With npx

If you installed via npx, your Claude configuration would look like:

```json
{
  "mcpServers": {
    "jira": {
      "command": "npx",
      "args": [
        "--yes",
        "jira-9.12.14-mcp-server"
      ]
    }
  }
}
```

**Important**: Make sure you have a `.env` file in your home directory or in the directory where Claude for Desktop is installed when using npx.

3. Restart Claude for Desktop

## Available Tools

### JQL Search (`mcp_jira_jql_search`)

Executes JQL queries to find issues in Jira.

**Parameters:**
- `jql` (required): JQL query string
- `fields` (optional): List of fields to return for each issue
- `maxResults` (optional): Maximum number of results to return
- `startAt` (optional): Index of the first result to return
- `expand` (optional): Additional information to include in the response

### Get Issue (`mcp_jira_get_issue`)

Retrieves detailed information about a specific issue by ID or key.

**Parameters:**
- `issueIdOrKey` (required): ID or key of the issue
- `fields` (optional): List of fields to include in the response
- `expand` (optional): Additional information to include in the response
- `properties` (optional): Properties to include in the response
- `failFast` (optional): Whether to fail quickly on errors (default: false)

## Troubleshooting

If you see errors like `JIRA_API_URL environment variable is required`, make sure you:

1. Have created a `.env` file in the directory where you're running the server
2. Have included both JIRA_API_URL and JIRA_AUTH_TOKEN in the file
MIT 