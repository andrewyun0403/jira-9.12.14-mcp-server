#!/usr/bin/env node
import fetch, { RequestInit as NodeFetchRequestInit } from 'node-fetch';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables from .env file
// Try to find .env file in current directory, and then in project root directory
const loadEnv = () => {
  // Try current working directory first
  if (fs.existsSync(join(process.cwd(), '.env'))) {
    config({ path: join(process.cwd(), '.env') });
    console.log('Loaded .env file from current directory');
  } 
  // Then try the directory where this file is located
  else {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const rootDir = join(__dirname, '..', '..');
    
    if (fs.existsSync(join(rootDir, '.env'))) {
      config({ path: join(rootDir, '.env') });
      console.log('Loaded .env file from project root directory');
    } else {
      console.log('No .env file found. Please create one with JIRA_API_URL and JIRA_AUTH_TOKEN');
    }
  }
};

loadEnv();

// Get Jira API configuration from environment variables
const JIRA_API_URL = process.env.JIRA_API_URL || '';
const JIRA_AUTH_TOKEN = process.env.JIRA_AUTH_TOKEN || '';

if (!JIRA_API_URL) {
  throw new Error('JIRA_API_URL environment variable is required. Create a .env file in your current directory.');
}

if (!JIRA_AUTH_TOKEN) {
  throw new Error('JIRA_AUTH_TOKEN environment variable is required. Create a .env file in your current directory.');
}

class JiraClient {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    body?: any, 
    additionalHeaders: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...additionalHeaders
    };

    const options: NodeFetchRequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Jira API error (${response.status}): ${errorText}`);
      }
      
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json() as T;
      } else {
        return {} as T;
      }
    } catch (error) {
      console.error(`Error making request to ${url}:`, error);
      throw error;
    }
  }

  // JQL search - Execute JQL queries to find issues
  async jqlSearch(jql: string, fields?: string[], maxResults?: number, startAt?: number, expand?: string): Promise<any> {
    const params = new URLSearchParams();
    
    if (jql) params.append('jql', jql);
    if (fields && fields.length > 0) params.append('fields', fields.join(','));
    if (maxResults !== undefined) params.append('maxResults', maxResults.toString());
    if (startAt !== undefined) params.append('startAt', startAt.toString());
    if (expand) params.append('expand', expand);
    
    const endpoint = `/rest/api/2/search?${params.toString()}`;
    return this.request<any>(endpoint);
  }

  // Get issue by ID or key
  async getIssue(issueIdOrKey: string, fields?: string[], expand?: string): Promise<any> {
    const params = new URLSearchParams();
    
    if (fields && fields.length > 0) params.append('fields', fields.join(','));
    if (expand) params.append('expand', expand);
    
    const endpoint = `/rest/api/2/issue/${issueIdOrKey}?${params.toString()}`;
    return this.request<any>(endpoint);
  }
}

// Export a singleton instance of the Jira client
export const jiraClient = new JiraClient(JIRA_API_URL, JIRA_AUTH_TOKEN); 