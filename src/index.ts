#!/usr/bin/env node
/**
 * SmartLead MCP Server - Main Entry Point
 *
 * This is the main entry point for the SmartLead MCP Server.
 * It initializes the server with the API key from environment variables
 * and starts the MCP server to handle requests from compatible clients.
 *
 * @author LeadMagic Team
 * @version 1.6.0
 */

import { config } from 'dotenv';
import { SmartLeadMCPServer } from './server.js';

// Load environment variables
config();

/**
 * Main function to start the SmartLead MCP Server
 */
async function main(): Promise<void> {
  try {
    // Get API key from environment variables
    const apiKey = process.env.SMARTLEAD_API_KEY;

    if (!apiKey) {
      console.error('❌ Error: SMARTLEAD_API_KEY environment variable is required');
      console.log('💡 Please set your SmartLead API key in the environment variables');
      console.log('   You can do this by creating a .env file with:');
      console.log('   SMARTLEAD_API_KEY=your_api_key_here');
      console.log('');
      console.log('📖 For more information, visit:');
      console.log('   https://github.com/LeadMagic/smartlead-mcp-server#setup');
      process.exit(1);
    }

    // Initialize and start the SmartLead MCP Server
    const server = new SmartLeadMCPServer(apiKey, {
      baseUrl: process.env.SMARTLEAD_BASE_URL,
      timeout: process.env.SMARTLEAD_TIMEOUT ? parseInt(process.env.SMARTLEAD_TIMEOUT) : undefined,
      maxRetries: process.env.SMARTLEAD_MAX_RETRIES
        ? parseInt(process.env.SMARTLEAD_MAX_RETRIES)
        : undefined,
      retryDelay: process.env.SMARTLEAD_RETRY_DELAY
        ? parseInt(process.env.SMARTLEAD_RETRY_DELAY)
        : undefined,
      rateLimit: process.env.SMARTLEAD_RATE_LIMIT
        ? parseInt(process.env.SMARTLEAD_RATE_LIMIT)
        : undefined,
    });

    // Start the server
    await server.connect();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      await server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Failed to start SmartLead MCP Server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  console.error('❌ Unhandled error in main:', error);
  process.exit(1);
}); 