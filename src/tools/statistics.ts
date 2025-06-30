/**
 * SmartLead MCP Server - Statistics Tools
 *
 * MCP tools for campaign statistics API endpoints.
 * Provides tools for campaign analytics, warmup stats, and performance metrics.
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

const GetCampaignStatisticsSchema = z.object({
  campaign_id: z.number().int().positive(),
});

const GetCampaignStatisticsByDateRangeSchema = z.object({
  campaign_id: z.number().int().positive(),
  start_date: z.string(),
  end_date: z.string(),
  timezone: z.string().optional().default('Etc/GMT'),
});

const GetWarmupStatsByEmailAccountIdSchema = z.object({
  email_account_id: z.number().int().positive(),
});

const GetCampaignTopLevelAnalyticsSchema = z.object({
  campaign_id: z.number().int().positive(),
});

const GetCampaignTopLevelAnalyticsByDateRangeSchema = z.object({
  campaign_id: z.number().int().positive(),
  start_date: z.string(),
  end_date: z.string(),
  timezone: z.string().optional().default('Etc/GMT'),
});

const GetCampaignLeadStatisticsSchema = z.object({
  campaign_id: z.number().int().positive(),
});

const GetCampaignMailboxStatisticsSchema = z.object({
  campaign_id: z.number().int().positive(),
});

// ================================
// TOOL REGISTRATION
// ================================

/**
 * Register statistics tools with the MCP server
 */
export function registerStatisticsTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data?: unknown, summary?: string) => MCPToolResponse,
  handleError: (error: unknown) => MCPToolResponse
): void {
  // Fetch Campaign Statistics By Campaign ID
  server.registerTool(
    'smartlead_get_campaign_statistics',
    {
      title: 'Get Campaign Statistics',
      description: 'Retrieve comprehensive statistics for a specific campaign.',
      inputSchema: GetCampaignStatisticsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignStatisticsSchema.parse(params);
        const result = await client.statistics.getCampaignStatistics(validatedParams.campaign_id);
        return formatSuccessResponse(
          `Retrieved statistics for campaign ${validatedParams.campaign_id}`,
          result,
          `Campaign performance metrics available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Campaign Statistics By Campaign Id And Date Range
  server.registerTool(
    'smartlead_get_campaign_statistics_by_date_range',
    {
      title: 'Get Campaign Statistics by Date Range',
      description: 'Retrieve campaign statistics for a specific date range.',
      inputSchema: GetCampaignStatisticsByDateRangeSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignStatisticsByDateRangeSchema.parse(params);
        const { campaign_id, ...dateParams } = validatedParams;
        const result = await client.statistics.getCampaignStatisticsByDateRange(
          campaign_id,
          dateParams
        );
        return formatSuccessResponse(
          `Retrieved statistics for campaign ${campaign_id} from ${dateParams.start_date} to ${dateParams.end_date}`,
          result,
          `Date range: ${dateParams.start_date} - ${dateParams.end_date}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Warmup Stats By Email Account ID
  server.registerTool(
    'smartlead_get_warmup_stats_by_email_account_id',
    {
      title: 'Get Warmup Stats by Email Account ID',
      description: 'Retrieve warmup statistics for a specific email account.',
      inputSchema: GetWarmupStatsByEmailAccountIdSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetWarmupStatsByEmailAccountIdSchema.parse(params);
        const result = await client.statistics.getWarmupStatsByEmailAccountId(
          validatedParams.email_account_id
        );
        return formatSuccessResponse(
          `Retrieved warmup stats for email account ${validatedParams.email_account_id}`,
          result,
          `Warmup performance metrics available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch campaign top level analytics
  server.registerTool(
    'smartlead_get_campaign_top_level_analytics',
    {
      title: 'Get Campaign Top Level Analytics',
      description: 'Retrieve high-level analytics overview for a campaign.',
      inputSchema: GetCampaignTopLevelAnalyticsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignTopLevelAnalyticsSchema.parse(params);
        const result = await client.statistics.getCampaignTopLevelAnalytics(
          validatedParams.campaign_id
        );
        return formatSuccessResponse(
          `Retrieved top-level analytics for campaign ${validatedParams.campaign_id}`,
          result,
          `High-level performance overview available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Campaign Top Level Analytics By Date Range
  server.registerTool(
    'smartlead_get_campaign_top_level_analytics_by_date_range',
    {
      title: 'Get Campaign Top Level Analytics by Date Range',
      description: 'Retrieve high-level analytics for a campaign within a specific date range.',
      inputSchema: GetCampaignTopLevelAnalyticsByDateRangeSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignTopLevelAnalyticsByDateRangeSchema.parse(params);
        const { campaign_id, ...dateParams } = validatedParams;
        const result = await client.statistics.getCampaignTopLevelAnalyticsByDateRange(
          campaign_id,
          dateParams
        );
        return formatSuccessResponse(
          `Retrieved top-level analytics for campaign ${campaign_id} from ${dateParams.start_date} to ${dateParams.end_date}`,
          result,
          `Date range: ${dateParams.start_date} - ${dateParams.end_date}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Campaign Lead Statistics
  server.registerTool(
    'smartlead_get_campaign_lead_statistics',
    {
      title: 'Get Campaign Lead Statistics',
      description: 'Retrieve detailed lead statistics for a campaign.',
      inputSchema: GetCampaignLeadStatisticsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignLeadStatisticsSchema.parse(params);
        const result = await client.statistics.getCampaignLeadStatistics(
          validatedParams.campaign_id
        );
        return formatSuccessResponse(
          `Retrieved lead statistics for campaign ${validatedParams.campaign_id}`,
          result,
          `Lead performance metrics available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Campaign Mailbox Statistics
  server.registerTool(
    'smartlead_get_campaign_mailbox_statistics',
    {
      title: 'Get Campaign Mailbox Statistics',
      description: 'Retrieve mailbox performance statistics for a campaign.',
      inputSchema: GetCampaignMailboxStatisticsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignMailboxStatisticsSchema.parse(params);
        const result = await client.statistics.getCampaignMailboxStatistics(
          validatedParams.campaign_id
        );
        return formatSuccessResponse(
          `Retrieved mailbox statistics for campaign ${validatedParams.campaign_id}`,
          result,
          `Mailbox performance metrics available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
