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

const DownloadCampaignDataSchema = z.object({
  campaign_id: z.number().int().positive(),
  download_type: z.enum(['analytics', 'leads', 'sequences', 'full', 'summary']),
  format: z.enum(['json', 'csv']).optional().default('json'),
  user_id: z.string().optional(),
});

const ViewDownloadStatisticsSchema = z.object({
  time_period: z.string().optional().describe('Time period filter (e.g., "last_7_days", "last_30_days", "last_quarter")'),
  group_by: z.string().optional().describe('Grouping criteria (e.g., "campaign", "user", "date", "type")'),
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
        // Validate parameters with detailed error messages
        let validatedParams;
        try {
          validatedParams = DownloadCampaignDataSchema.parse(params);
        } catch (zodError: any) {
          // Handle Zod validation errors with user-friendly messages
          const issues = zodError.issues || [];
          const errorMessages = issues.map((issue: any) => {
            if (issue.path.includes('campaign_id')) {
              return 'Campaign ID must be a positive integer';
            }
            if (issue.path.includes('format')) {
              return 'Format must be either "json" or "csv"';
            }
            if (issue.path.includes('download_type')) {
              return 'Download type is required';
            }
            return `${issue.path.join('.')}: ${issue.message}`;
          }).join(', ');
          
          return handleError(new Error(`Invalid parameters: ${errorMessages}`));
        }
        
        // Validate download_type values
        const validDownloadTypes = ['leads', 'analytics', 'sequences', 'full', 'summary'];
        if (!validDownloadTypes.includes(validatedParams.download_type)) {
          return handleError(new Error(
            `Invalid download_type: "${validatedParams.download_type}". ` +
            `Must be one of: ${validDownloadTypes.join(', ')}`
          ));
        }
        
        // Call the downloadCampaignData method from the statistics module
        let result;
        try {
          result = await client.statistics.downloadCampaignData(
            validatedParams.campaign_id,
            validatedParams.download_type,
            validatedParams.format,
            validatedParams.user_id
          );
        } catch (apiError: any) {
          // Handle specific API errors
          if (apiError.status === 404 || apiError.code === 'HTTP_404') {
            return handleError(new Error(
              `Campaign ${validatedParams.campaign_id} not found. Please verify the campaign ID.`
            ));
          }
          if (apiError.status === 401 || apiError.code === 'HTTP_401') {
            return handleError(new Error(
              'Authentication failed. Please check your API key.'
            ));
          }
          if (apiError.status === 403 || apiError.code === 'HTTP_403') {
            return handleError(new Error(
              `Access denied. You don't have permission to download data for campaign ${validatedParams.campaign_id}.`
            ));
          }
          if (apiError.status === 429 || apiError.code === 'HTTP_429') {
            return handleError(new Error(
              'Rate limit exceeded. Please try again later.'
            ));
          }
          if (apiError.isNetworkError?.() || apiError.code === 'NETWORK_ERROR') {
            return handleError(new Error(
              'Network error occurred. Please check your internet connection and try again.'
            ));
          }
          if (apiError.code === 'TIMEOUT_ERROR') {
            return handleError(new Error(
              'Request timeout. The download might be too large. Try downloading with a more specific download_type.'
            ));
          }
          
          // Re-throw other errors to be handled by the general error handler
          throw apiError;
        }
        
        // Handle different response formats
        if (validatedParams.format === 'csv') {
          // For CSV format, check if we got the expected structure
          if (result && typeof result === 'object' && result.format === 'csv' && result.data) {
            // Result is already properly formatted by downloadCampaignData
            return formatSuccessResponse(
              `Downloaded ${validatedParams.download_type} data for campaign ${validatedParams.campaign_id} in CSV format`,
              result,
              `CSV data ready for download (${(result.size / 1024).toFixed(2)} KB)`
            );
          } else {
            // CSV format requested but didn't get proper format
            return handleError(new Error(
              'Failed to generate CSV format. Try using JSON format instead.'
            ));
          }
        }
        
        // For JSON format, validate that we got actual data
        if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
          return formatSuccessResponse(
            `No data available for campaign ${validatedParams.campaign_id} with download type "${validatedParams.download_type}"`,
            { data: result, empty: true },
            'No data to download'
          );
        }
        
        // Return JSON format data
        return formatSuccessResponse(
          `Downloaded ${validatedParams.download_type} data for campaign ${validatedParams.campaign_id} in ${validatedParams.format} format`,
          result,
          `Format: ${validatedParams.format.toUpperCase()}`
        );
        
      } catch (error: any) {
        // Handle any unexpected errors
        if (error.message && !error.message.includes('SmartLead')) {
          // Add context to generic error messages
          return handleError(new Error(
            `Failed to download campaign data: ${error.message}`
          ));
        }
        return handleError(error);
      }
    }
  );

  // View Download Statistics
  server.registerTool(
    'smartlead_view_download_statistics',
    {
      title: 'View Download Statistics',
      description: 'View download statistics with optional filtering by time period and grouping criteria.',
      inputSchema: ViewDownloadStatisticsSchema.shape,
    },
    async (params) => {
      try {
        // Validate parameters with detailed error messages
        let validatedParams;
        try {
          validatedParams = ViewDownloadStatisticsSchema.parse(params);
        } catch (zodError: any) {
          // Handle Zod validation errors with user-friendly messages
          const issues = zodError.issues || [];
          const errorMessages = issues.map((issue: any) => {
            if (issue.path.includes('time_period')) {
              return 'Time period must be a valid string (e.g., "last_7_days", "last_30_days")';
            }
            if (issue.path.includes('group_by')) {
              return 'Group by must be a valid string (e.g., "campaign", "user", "date")';
            }
            return `${issue.path.join('.')}: ${issue.message}`;
          }).join(', ');
          
          return handleError(new Error(`Invalid parameters: ${errorMessages}`));
        }
        
        // Call the viewDownloadStatistics method
        let result;
        try {
          result = await client.statistics.viewDownloadStatistics(
            validatedParams.time_period,
            validatedParams.group_by
          );
        } catch (apiError: any) {
          // Handle specific API errors
          if (apiError.status === 404 || apiError.code === 'HTTP_404') {
            return handleError(new Error(
              'Download statistics endpoint not found. This feature may not be available in your SmartLead plan.'
            ));
          }
          if (apiError.status === 401 || apiError.code === 'HTTP_401') {
            return handleError(new Error(
              'Authentication failed. Please check your API key.'
            ));
          }
          if (apiError.status === 403 || apiError.code === 'HTTP_403') {
            return handleError(new Error(
              'Access denied. You don\'t have permission to view download statistics.'
            ));
          }
          if (apiError.status === 400 || apiError.code === 'HTTP_400') {
            const message = apiError.message || 'Invalid request';
            return handleError(new Error(
              `Invalid request: ${message}. Please check your time_period and group_by parameters.`
            ));
          }
          if (apiError.status === 429 || apiError.code === 'HTTP_429') {
            return handleError(new Error(
              'Rate limit exceeded. Please try again later.'
            ));
          }
          if (apiError.isNetworkError?.() || apiError.code === 'NETWORK_ERROR') {
            return handleError(new Error(
              'Network error occurred. Please check your internet connection and try again.'
            ));
          }
          if (apiError.code === 'TIMEOUT_ERROR') {
            return handleError(new Error(
              'Request timeout. The statistics data might be too large. Try using more specific filters.'
            ));
          }
          
          // Re-throw other errors to be handled by the general error handler
          throw apiError;
        }
        
        // Validate that we got actual data
        if (!result || (typeof result === 'object' && Object.keys(result).length === 0)) {
          return formatSuccessResponse(
            'No download statistics available',
            { data: result, empty: true },
            'No statistics to display'
          );
        }
        
        // Construct a meaningful summary based on the parameters and results
        let summary = 'Download statistics retrieved';
        if (validatedParams.time_period) {
          summary += ` for ${validatedParams.time_period}`;
        }
        if (validatedParams.group_by) {
          summary += `, grouped by ${validatedParams.group_by}`;
        }
        
        // Add record count if available
        if (result.total_records !== undefined) {
          summary += ` (${result.total_records} records)`;
        } else if (Array.isArray(result.data)) {
          summary += ` (${result.data.length} records)`;
        }
        
        return formatSuccessResponse(
          'Retrieved download statistics successfully',
          result,
          summary
        );
        
      } catch (error: any) {
        // Handle any unexpected errors
        if (error.message && !error.message.includes('SmartLead')) {
          // Add context to generic error messages
          return handleError(new Error(
            `Failed to retrieve download statistics: ${error.message}`
          ));
        }
        return handleError(error);
      }
    }
  );
}
