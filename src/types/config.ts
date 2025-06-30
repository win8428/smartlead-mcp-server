/**
 * SmartLead MCP Server - Configuration Types
 *
 * Core configuration interfaces and types for the SmartLead MCP server.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

/**
 * Configuration interface for SmartLead API client
 */
export interface SmartLeadConfig {
  /** SmartLead API key (required) */
  apiKey: string;
  /** Custom API base URL (optional, defaults to https://server.smartlead.ai/api/v1) */
  baseUrl?: string;
  /** Request timeout in milliseconds (optional, defaults to 30000) */
  timeout?: number;
  /** Maximum retry attempts (optional, defaults to 3) */
  maxRetries?: number;
  /** Initial retry delay in milliseconds (optional, defaults to 1000) */
  retryDelay?: number;
  /** Rate limit in requests per minute (optional, defaults to 100) */
  rateLimit?: number;
}

/**
 * MCP Tool Response interface
 */
export interface MCPToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: 'text';
    text: string;
  }>;
}
