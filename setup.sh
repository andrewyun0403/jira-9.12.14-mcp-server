#!/bin/bash

# Exit on error
set -e

echo "Setting up Jira 9.12.14 MCP Server..."

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "Node.js version must be v16 or higher. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Copy .env.example to .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit the .env file to add your Jira credentials."
fi

echo "Setup complete! To run the server, use:"
echo "npm start"
echo ""
echo "Remember to configure your JIRA_API_URL and JIRA_AUTH_TOKEN in the .env file." 