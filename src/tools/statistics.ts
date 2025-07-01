/**
 * SmartLead MCP Server - Statistics Tools
 *
 * MCP tools for campaign statistics API endpoints.
 * Provides tools for campaign analytics, warmup stats, and performance metrics.
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

const DownloadCampaignDataSchema = z.object({
  campaign_id: z.number().int().positive(),
  download_type: z.enum(['analytics', 'leads', 'sequences', 'full', 'summary']),
  format: z.enum(['json', 'csv']).optional().default('json'),
  user_id: z.string().optional(),
});

const ViewDownloadStatisticsSchema = z.object({
  time_period: z
    .string()
    .optional()
    .describe('Time period filter (e.g., "last_7_days", "last_30_days", "last_quarter")'),
  group_by: z
    .string()
    .optional()
    .describe('Grouping criteria (e.g., "campaign", "user", "date", "type")'),
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
        const result = await client.statistics.getCampaignStatisticsByDateRange(
          validatedParams.campaign_id,
          validatedParams
        );
        return formatSuccessResponse(
          `Retrieved statistics for campaign ${validatedParams.campaign_id}`,
          result
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
        const result = await client.statistics.getCampaignTopLevelAnalyticsByDateRange(
          validatedParams.campaign_id,
          validatedParams
        );
        return formatSuccessResponse(
          `Retrieved top level analytics for campaign ${validatedParams.campaign_id}`,
          result
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

  // Download Campaign Data
  server.registerTool(
    'smartlead_download_campaign_data',
    {
      title: 'Download Campaign Data',
      description: 'Download campaign data in CSV or JSON format for analysis or backup.',
      inputSchema: DownloadCampaignDataSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = DownloadCampaignDataSchema.parse(params);
        const result = await client.statistics.downloadCampaignData(
          validatedParams.campaign_id,
          validatedParams.download_type,
          validatedParams.format,
          validatedParams.user_id
        );
        if (result.format === 'csv') {
          return formatSuccessResponse(
            'Campaign data exported to CSV successfully',
            result,
            `CSV data ready for download (${((result.size || 0) / 1024).toFixed(2)} KB)`
          );
        }
        return formatSuccessResponse('Campaign data exported to JSON successfully', result);
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
        return handleError(new Error('An unexpected error occurred'));
      }
    }
  );

  // View Download Statistics
  server.registerTool(
    'smartlead_view_download_statistics',
    {
      title: 'View Download Statistics',
      description:
        'View download statistics with optional filtering by time period and grouping criteria.',
      inputSchema: ViewDownloadStatisticsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ViewDownloadStatisticsSchema.parse(params);
        const result = await client.statistics.viewDownloadStatistics(
          validatedParams.time_period,
          validatedParams.group_by
        );
        let summary = 'Download statistics retrieved successfully';
        if ((result.data as any)?.total_records !== undefined) {
          summary += ` (${(result.data as any).total_records} records)`;
        }
        return formatSuccessResponse('Download statistics retrieved successfully', result, summary);
      } catch (error) {
        if (error instanceof Error) {
          return handleError(error);
        }
        return handleError(new Error('An unexpected error occurred'));
      }
    }
  );
}
