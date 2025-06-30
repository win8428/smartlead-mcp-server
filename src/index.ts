#!/usr/bin/env node
/**
 * SmartLead MCP Server - Main Entry Point
 *
 * The primary entry point for the SmartLead Model Context Protocol server.
 * This script handles command-line arguments, environment setup, server initialization,
 * and graceful shutdown procedures.
 *
 * Features:
 * - Command-line interface with help and version commands
 * - Interactive installer integration
 * - Environment variable configuration
 * - Graceful shutdown handling
 * - Production-ready error handling and logging
 * - Cross-platform compatibility
 *
 * Usage:
 * - `smartlead-mcp-server` - Start the MCP server
 * - `smartlead-mcp-server install` - Run interactive installer
 * - `smartlead-mcp-server --help` - Show help information
 * - `smartlead-mcp-server --version` - Show version information
 *
 * @author LeadMagic Team
 * @version 1.0.0
 */

import dotenv from 'dotenv';
import { SmartLeadMCPServer } from './server.js';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
dotenv.config();

// Get current file and directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments (excluding 'node' and script name)
const args = process.argv.slice(2);

// Application metadata
const APP_NAME = 'smartlead-mcp-server';
const APP_VERSION = '1.0.0';
const GITHUB_URL = 'https://github.com/LeadMagic/smartlead-mcp-server';
const SMARTLEAD_URL = 'https://app.smartlead.ai';

/**
 * Handles the interactive installer command
 *
 * Executes the TypeScript installer script that helps users configure
 * the MCP server with their preferred MCP client.
 */
async function handleInstallCommand(): Promise<void> {
  try {
    // Try to find the install file in different locations
    const possiblePaths = [
      join(__dirname, 'install.js'),
      join(__dirname, '..', 'src', 'install.tsx'),
      join(__dirname, 'install.tsx'),
    ];

    let installPath = '';
    for (const path of possiblePaths) {
      try {
        // Check if file exists
        await import('fs').then((fs) => fs.promises.access(path));
        installPath = path;
        break;
      } catch {
        // File doesn't exist, try next
        continue;
      }
    }

    if (!installPath) {
      throw new Error('Install script not found');
    }

    // Try TypeScript version first, fall back to JavaScript
    if (installPath.endsWith('.tsx') || installPath.endsWith('.ts')) {
      execSync(`npx tsx "${installPath}"`, { stdio: 'inherit' });
    } else {
      execSync(`node "${installPath}"`, { stdio: 'inherit' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Installation failed:', errorMessage);
    console.error('\n💡 Try running: npm install -g tsx');
    console.error('💡 Or visit:', GITHUB_URL);
    process.exit(1);
  }
}

/**
 * Displays comprehensive help information
 *
 * Shows usage examples, command options, environment variables,
 * and helpful links for getting started.
 */
function showHelp(): void {
  console.log(`
🚀 ${APP_NAME} v${APP_VERSION}

A production-ready Model Context Protocol server for SmartLead API.
Provides access to SmartLead's email marketing automation through MCP-compatible clients.

📖 USAGE:
  ${APP_NAME}                Start the MCP server
  ${APP_NAME} install        Run interactive installer
  ${APP_NAME} --help, -h     Show this help message
  ${APP_NAME} --version, -v  Show version information

🌍 ENVIRONMENT VARIABLES:
  SMARTLEAD_API_KEY          Your SmartLead API key (required)
  SMARTLEAD_API_URL          Custom API base URL (optional)
  SMARTLEAD_TIMEOUT          Request timeout in ms (optional)
  DEBUG                      Enable debug logging (optional)

💻 EXAMPLES:
  # Start server with environment variable
  SMARTLEAD_API_KEY=your-key ${APP_NAME}

  # Run via npx
  npx ${APP_NAME} install

  # Start server via npx
  SMARTLEAD_API_KEY=your-key npx ${APP_NAME}

🔑 GET API KEY:
  ${SMARTLEAD_URL}

📚 DOCUMENTATION:
  ${GITHUB_URL}

🛠️ SUPPORTED MCP CLIENTS:
  • Claude Desktop 🤖
  • Cursor (Cline) 🎯
  • Windsurf 🏄
  • Continue.dev 🔄
  • VS Code (Cline/Continue) 💻
  • Zed Editor ⚡
  • Any MCP-compatible client 🔗

🚀 QUICK START:
  1. Get your API key: ${SMARTLEAD_URL}
  2. Run installer: npx ${APP_NAME} install
  3. Start using SmartLead tools in your AI client!
`);
}

/**
 * Displays version information
 */
function showVersion(): void {
  console.log(`${APP_NAME} v${APP_VERSION}`);
}

/**
 * Validates and retrieves the SmartLead API key
 *
 * Checks for the API key in environment variables and provides
 * helpful error messages if not found or invalid.
 *
 * @returns The validated API key
 * @throws Exits process if API key is missing or invalid
 */
function getApiKey(): string {
  const apiKey = process.env.SMARTLEAD_API_KEY;

  if (!apiKey) {
    console.error(`
❌ SmartLead API key not found!

The SMARTLEAD_API_KEY environment variable is required to run the server.

🔧 QUICK FIX:
Please set your API key using one of these methods:

1️⃣ Environment variable:
   export SMARTLEAD_API_KEY=your-api-key-here

2️⃣ .env file:
   echo "SMARTLEAD_API_KEY=your-api-key-here" > .env

3️⃣ Interactive installer:
   npx ${APP_NAME} install

🔑 GET YOUR API KEY:
   ${SMARTLEAD_URL}

📚 NEED HELP?
   ${GITHUB_URL}
`);
    process.exit(1);
  }

  // Basic validation
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    console.error(`
❌ Invalid API key format!

The API key must be a non-empty string.

🔑 GET A VALID API KEY:
   ${SMARTLEAD_URL}
`);
    process.exit(1);
  }

  return apiKey.trim();
}

/**
 * Sets up graceful shutdown handlers
 *
 * Handles SIGINT (Ctrl+C) and SIGTERM signals to ensure the server
 * shuts down gracefully and releases all resources properly.
 *
 * @param server - The MCP server instance to shutdown
 */
function setupShutdownHandlers(server: { close(): Promise<void> }): void {
  // Handle Ctrl+C (SIGINT)
  process.on('SIGINT', async () => {
    console.error('\n🛑 Received SIGINT (Ctrl+C), shutting down gracefully...');
    try {
      await server.close();
      console.error('✅ Server shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('⚠️ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Handle termination signal (SIGTERM)
  process.on('SIGTERM', async () => {
    console.error('\n🛑 Received SIGTERM, shutting down gracefully...');
    try {
      await server.close();
      console.error('✅ Server shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('⚠️ Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error);
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
}

/**
 * Main application function
 *
 * Orchestrates the entire server startup process including argument parsing,
 * API key validation, server initialization, and connection establishment.
 */
async function main(): Promise<void> {
  try {
    // Handle command line arguments
    if (args.includes('install') || args.includes('--install')) {
      await handleInstallCommand();
      return;
    }

    if (args.includes('--help') || args.includes('-h')) {
      showHelp();
      return;
    }

    if (args.includes('--version') || args.includes('-v')) {
      showVersion();
      return;
    }

    // Validate API key
    const apiKey = getApiKey();

    // Create MCP server instance
    console.error('🚀 Initializing SmartLead MCP Server...');
    const server = new SmartLeadMCPServer(apiKey);

    // Setup graceful shutdown handlers
    setupShutdownHandlers(server);

    // Display startup information
    console.error(`🔑 API Key: ${apiKey.substring(0, 8)}...`);
    console.error(`📡 Server: ${APP_NAME} v${APP_VERSION}`);
    console.error('🛠️ Tools: SmartLead API endpoints available');
    console.error('✅ Server ready - waiting for MCP client connection...');

    // Start the server and connect to transport
    await server.connect();

    // This line should never be reached as the server runs indefinitely
    console.error('🛑 Server connection ended');
  } catch (error) {
    // Handle server startup errors
    console.error('💥 Failed to start server:');
    if (error instanceof Error) {
      console.error(` Error: ${error.message}`);

      // Provide specific guidance for common errors
      if (error.message.includes('API key')) {
        console.error(`\n🔧 Solution: Get your API key at ${SMARTLEAD_URL}`);
      } else if (error.message.includes('network') || error.message.includes('ENOTFOUND')) {
        console.error('\n🔧 Solution: Check your internet connection');
      } else if (error.message.includes('port') || error.message.includes('EADDRINUSE')) {
        console.error('\n🔧 Solution: Another server may already be running');
      }
    } else {
      console.error(' Unknown error occurred');
    }

    console.error(`\n💡 Need help? Visit: ${GITHUB_URL}/issues`);
    process.exit(1);
  }
}

/**
 * Application entry point
 *
 * Starts the main application and handles any uncaught errors
 * at the top level to ensure proper error reporting.
 */
main().catch((error) => {
  console.error('💥 Unexpected error during startup:');
  console.error(error);
  console.error(`\n💡 Please report this issue: ${GITHUB_URL}/issues`);
  process.exit(1);
});
