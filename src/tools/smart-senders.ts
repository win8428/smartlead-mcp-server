/**
 * SmartLead MCP Server - Smart Senders Tools
 *
 * MCP tools for smart senders API endpoints.
 * Provides tools for domain management, vendor integration, and mailbox automation.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SmartLeadClient } from '../client/index.js';
import type { MCPToolResponse } from '../types/config.js';

// ================================
// SCHEMAS
// ================================

const SearchDomainSchema = z.object({
  domain: z.string(),
});

const AutoGenerateMailboxesSchema = z.object({
  domain: z.string(),
  count: z.number().int().positive(),
  vendor_id: z.number().int().positive(),
  naming_pattern: z.string().optional(),
});

const PlaceOrderForMailboxesSchema = z.object({
  domain: z.string(),
  mailboxes: z.array(
    z.object({
      email: z.string().email(),
      password: z.string(),
    })
  ),
  vendor_id: z.number().int().positive(),
});

// ================================
// TOOL REGISTRATION
// ================================

/**
 * Register smart senders tools with the MCP server
 */
export function registerSmartSendersTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data?: unknown, summary?: string) => MCPToolResponse,
  handleError: (error: unknown) => MCPToolResponse
): void {
  // Search Domain
  server.registerTool(
    'smartlead_search_domain',
    {
      title: 'Search Domain',
      description: 'Search for domain availability and information for smart senders setup.',
      inputSchema: SearchDomainSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = SearchDomainSchema.parse(params);
        const result = await client.smartSenders.searchDomain(validatedParams);
        return formatSuccessResponse(
          `Searched domain: ${validatedParams.domain}`,
          result,
          `Domain status: ${(result.data as any)?.status || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Vendors
  server.registerTool(
    'smartlead_get_vendors',
    {
      title: 'Get Vendors',
      description: 'Retrieve a list of available vendors for smart senders integration.',
      inputSchema: z.object({}).shape,
    },
    async (params) => {
      try {
        const result = await client.smartSenders.getVendors();
        return formatSuccessResponse(
          'Retrieved available vendors',
          result,
          `Found ${(result.data as any)?.length || 0} vendors`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Auto-generate-mailboxes
  server.registerTool(
    'smartlead_auto_generate_mailboxes',
    {
      title: 'Auto Generate Mailboxes',
      description:
        'Automatically generate mailboxes for a domain with specified count and naming pattern.',
      inputSchema: AutoGenerateMailboxesSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AutoGenerateMailboxesSchema.parse(params);
        const result = await client.smartSenders.autoGenerateMailboxes(validatedParams);
        return formatSuccessResponse(
          `Generated ${validatedParams.count} mailboxes for domain ${validatedParams.domain}`,
          result,
          `Vendor ID: ${validatedParams.vendor_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Place order for mailboxes
  server.registerTool(
    'smartlead_place_order_for_mailboxes',
    {
      title: 'Place Order for Mailboxes',
      description: 'Place an order for specific mailboxes with a vendor.',
      inputSchema: PlaceOrderForMailboxesSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = PlaceOrderForMailboxesSchema.parse(params);
        const result = await client.smartSenders.placeOrderForMailboxes(validatedParams);
        return formatSuccessResponse(
          `Placed order for ${validatedParams.mailboxes.length} mailboxes on domain ${validatedParams.domain}`,
          result,
          `Vendor ID: ${validatedParams.vendor_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Domain List
  server.registerTool(
    'smartlead_get_domain_list',
    {
      title: 'Get Domain List',
      description: 'Retrieve a list of all domains configured for smart senders.',
      inputSchema: z.object({}).shape,
    },
    async (params) => {
      try {
        const result = await client.smartSenders.getDomainList();
        return formatSuccessResponse(
          'Retrieved domain list',
          result,
          `Found ${(result.data as any)?.length || 0} domains`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
