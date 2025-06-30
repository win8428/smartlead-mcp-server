/**
 * SmartLead MCP Server - Webhooks Tools
 *
 * MCP tools for webhook management API endpoints.
 * Provides tools for managing webhooks, events, and webhook analytics.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SmartLeadClient } from '../client/index.js';
import { MCPToolResponse } from '../types/config.js';
import { z } from 'zod';

// ================================
// SCHEMAS
// ================================

const GetWebhooksByCampaignIdSchema = z.object({
  campaign_id: z.number().int().positive(),
});

const AddOrUpdateCampaignWebhookSchema = z.object({
  campaign_id: z.number().int().positive(),
  webhook_url: z.string().url(),
  events: z.array(z.string()),
  is_active: z.boolean().optional().default(true),
});

const DeleteCampaignWebhookSchema = z.object({
  campaign_id: z.number().int().positive(),
  webhook_id: z.number().int().positive(),
});

const GetWebhooksPublishSummarySchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  campaign_id: z.number().int().positive().optional(),
});

const RetriggerFailedEventsSchema = z.object({
  webhook_id: z.number().int().positive().optional(),
  campaign_id: z.number().int().positive().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

// ================================
// TOOL REGISTRATION
// ================================

/**
 * Register webhook management tools with the MCP server
 */
export function registerWebhookTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data?: unknown, summary?: string) => MCPToolResponse,
  handleError: (error: unknown) => MCPToolResponse
): void {
  // Fetch Webhooks By Campaign ID
  server.registerTool(
    'smartlead_get_webhooks_by_campaign_id',
    {
      title: 'Get Webhooks by Campaign ID',
      description: 'Retrieve all webhooks configured for a specific campaign.',
      inputSchema: GetWebhooksByCampaignIdSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetWebhooksByCampaignIdSchema.parse(params);
        const result = await client.webhooks.getWebhooksByCampaignId(validatedParams.campaign_id);
        return formatSuccessResponse(
          `Retrieved webhooks for campaign ${validatedParams.campaign_id}`,
          result,
          `Found ${result.length || 0} webhooks`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Add / Update Campaign Webhook
  server.registerTool(
    'smartlead_add_or_update_campaign_webhook',
    {
      title: 'Add or Update Campaign Webhook',
      description: 'Add a new webhook or update an existing webhook for a campaign.',
      inputSchema: AddOrUpdateCampaignWebhookSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AddOrUpdateCampaignWebhookSchema.parse(params);
        const { campaign_id, ...webhookParams } = validatedParams;
        const result = await client.webhooks.addOrUpdateCampaignWebhook(campaign_id, webhookParams);
        return formatSuccessResponse(
          `Added/updated webhook for campaign ${campaign_id}`,
          result,
          `Webhook URL: ${webhookParams.webhook_url}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Delete Campaign Webhook
  server.registerTool(
    'smartlead_delete_campaign_webhook',
    {
      title: 'Delete Campaign Webhook',
      description: 'Delete a specific webhook from a campaign.',
      inputSchema: DeleteCampaignWebhookSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = DeleteCampaignWebhookSchema.parse(params);
        const result = await client.webhooks.deleteCampaignWebhook(
          validatedParams.campaign_id,
          validatedParams.webhook_id
        );
        return formatSuccessResponse(
          `Deleted webhook ${validatedParams.webhook_id} from campaign ${validatedParams.campaign_id}`,
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Webhooks Publish Summary
  server.registerTool(
    'smartlead_get_webhooks_publish_summary',
    {
      title: 'Get Webhooks Publish Summary',
      description: 'Retrieve a summary of webhook events and their delivery status.',
      inputSchema: GetWebhooksPublishSummarySchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetWebhooksPublishSummarySchema.parse(params);
        const result = await client.webhooks.getWebhooksPublishSummary(validatedParams);
        return formatSuccessResponse(
          'Retrieved webhooks publish summary',
          result,
          `Summary for ${validatedParams.campaign_id ? `campaign ${validatedParams.campaign_id}` : 'all campaigns'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Retrigger Failed Events
  server.registerTool(
    'smartlead_retrigger_failed_events',
    {
      title: 'Retrigger Failed Events',
      description: 'Retry delivery of failed webhook events for better reliability.',
      inputSchema: RetriggerFailedEventsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = RetriggerFailedEventsSchema.parse(params);
        const result = await client.webhooks.retriggerFailedEvents(validatedParams);
        return formatSuccessResponse(
          'Retriggered failed webhook events',
          result,
          `Processed events for ${validatedParams.webhook_id ? `webhook ${validatedParams.webhook_id}` : 'all webhooks'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
