#!/usr/bin/env node

console.log('');
console.log('🚀 Thank you for installing the Jira 9.12.14 MCP Server! 🚀');
console.log('');
console.log('⚠️  IMPORTANT: You MUST create a .env file with your Jira credentials! ⚠️');
console.log('');
console.log('1. Create a .env file in the directory where you will run the server:');
console.log('');
console.log('   # Create .env file with your credentials');
console.log('   cat > .env << EOL');
console.log('   JIRA_API_URL=https://your-domain.atlassian.net');
console.log('   JIRA_AUTH_TOKEN=your-jira-token');
console.log('   EOL');
console.log('');
console.log('2. Run the server using:');
console.log('');
console.log('   npx @andrewyun/jira-9-12-14-mcp-server');
console.log('');
console.log('3. To use with Claude for Desktop, add to your claude_desktop_config.json:');
console.log('');
console.log('   {');
console.log('     "mcpServers": {');
console.log('       "jira": {');
console.log('         "command": "npx",');
console.log('         "args": [');
console.log('           "-y",');
console.log('           "@andrewyun/jira-9-12-14-mcp-server"');
console.log('         ]');
console.log('       }');
console.log('     }');
console.log('   }');
console.log('');
console.log('   Make sure you create a .env file in your home directory too!');
console.log('');
console.log('For more information, see the README.md or visit:');
console.log('https://github.com/your-repo/jira-9.12.14-mcp-server');
console.log(''); 