#!/usr/bin/env node
/**
 * SmartLead MCP Server - Main Entry Point
 *
 * Handles both MCP server mode and interactive installer mode
 *
 * Usage:
 *   npx smartlead-mcp-by-leadmagic          # Start MCP server
 *   npx smartlead-mcp-by-leadmagic install  # Start installer
 *
 * @author LeadMagic Team
 * @version 1.6.1
 */

import { config } from 'dotenv';

// Load environment variables
try {
  config();
} catch (error) {
  console.warn('⚠️  Warning: Could not load .env file:', error);
}

/**
 * Main entry point - routes to installer or server based on arguments
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('install') || args.includes('--install') || args.includes('-i')) {
    // Check if running in install mode
    // Dynamic import to avoid loading React Ink unless needed
    const { render } = await import('ink');
    const React = await import('react');
    const { SmartLeadInstaller } = await import('./installer.js');
    render(React.createElement(SmartLeadInstaller));
    return;
  }

  // Otherwise start the MCP server
  const { SmartLeadMCPServer } = await import('./server.js');

  try {
    console.log('🚀 SmartLead MCP Server v1.6.1 - Starting...');
    console.log('📡 Built by LeadMagic in partnership with SmartLead');

    // Get and validate API key
    const apiKey = process.env.SMARTLEAD_API_KEY;

    if (!validateApiKey(apiKey)) {
      console.error('❌ Error: Invalid or missing SMARTLEAD_API_KEY environment variable');
      console.log('');
      console.log('💡 Setup Instructions:');
      console.log('   1. Get your API key from SmartLead account settings');
      console.log('   2. Set the environment variable:');
      console.log('      export SMARTLEAD_API_KEY=your_actual_api_key');
      console.log('   3. Or create a .env file with:');
      console.log('      SMARTLEAD_API_KEY=your_actual_api_key');
      console.log('');
      console.log('🔧 Or run the interactive installer:');
      console.log('   npx smartlead-mcp-by-leadmagic install');
      console.log('');
      process.exit(1);
    }

    // Parse optional configuration
    const serverConfig = {
      baseUrl: process.env.SMARTLEAD_BASE_URL,
      timeout: process.env.SMARTLEAD_TIMEOUT
        ? parseInt(process.env.SMARTLEAD_TIMEOUT, 10)
        : undefined,
      maxRetries: process.env.SMARTLEAD_MAX_RETRIES
        ? parseInt(process.env.SMARTLEAD_MAX_RETRIES, 10)
        : undefined,
      retryDelay: process.env.SMARTLEAD_RETRY_DELAY
        ? parseInt(process.env.SMARTLEAD_RETRY_DELAY, 10)
        : undefined,
      rateLimit: process.env.SMARTLEAD_RATE_LIMIT
        ? parseInt(process.env.SMARTLEAD_RATE_LIMIT, 10)
        : undefined,
    };

    // Initialize and start the server
    const server = new SmartLeadMCPServer(apiKey, serverConfig);

    // Set up graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
      try {
        await server.close();
        console.log('✅ SmartLead MCP Server shutdown complete');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // Handle errors
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

    // Start the server
    await server.connect();
  } catch (error) {
    console.error('❌ Failed to start SmartLead MCP Server:', error);

    if (error instanceof Error) {
      if (error.message.includes('ECONNREFUSED')) {
        console.log('🔧 Network connection failed. Please check your internet connection.');
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.log('🔧 Authentication failed. Please verify your SMARTLEAD_API_KEY is correct.');
      }
    }

    console.log('');
    console.log('💡 Try the interactive installer:');
    console.log('   npx smartlead-mcp-by-leadmagic install');
    console.log('');

    process.exit(1);
  }
}

/**
 * Validates the API key
 */
function validateApiKey(apiKey: string | undefined): apiKey is string {
  if (!apiKey) return false;
  if (apiKey.trim().length === 0) return false;
  if (apiKey === 'your_api_key_here' || apiKey === 'your_smartlead_api_key_here') return false;
  return true;
}

// Start the application
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
