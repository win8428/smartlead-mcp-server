/**
 * SmartLead MCP Server - Analytics Tools
 *
 * MCP tools for analytics and reporting operations.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SmartLeadClient } from '../client/index.js';
import { MCPToolResponse } from '../types/config.js';
import {
  AnalyticsCampaignListRequestSchema,
  AnalyticsClientListRequestSchema,
  AnalyticsClientMonthWiseCountRequestSchema,
  AnalyticsOverallStatsV2RequestSchema,
  AnalyticsDayWiseOverallStatsRequestSchema,
  AnalyticsMailboxNameWiseHealthMetricsRequestSchema,
  AnalyticsMailboxDomainWiseHealthMetricsRequestSchema,
  AnalyticsMailboxProviderWiseOverallPerformanceRequestSchema,
  AnalyticsCampaignOverallStatsRequestSchema,
  AnalyticsClientOverallStatsRequestSchema,
  AnalyticsTeamBoardOverallStatsRequestSchema,
  AnalyticsLeadOverallStatsRequestSchema,
  AnalyticsLeadCategoryWiseResponseRequestSchema,
  AnalyticsCampaignLeadsTakeForFirstReplyRequestSchema,
  AnalyticsCampaignFollowUpReplyRateRequestSchema,
  AnalyticsCampaignLeadToReplyTimeRequestSchema,
  AnalyticsCampaignResponseStatsRequestSchema,
  AnalyticsCampaignStatusStatsRequestSchema,
  AnalyticsMailboxOverallStatsRequestSchema,
} from '../types.js';

/**
 * Register all analytics tools
 */
export function registerAnalyticsTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data: any, summary?: string) => MCPToolResponse,
  handleError: (error: any) => MCPToolResponse
): void {
  // Analytics Campaign List Tool
  server.registerTool(
    'smartlead_analytics_campaign_list',
    {
      title: 'Analytics: Get Campaign List',
      description:
        'Get a list of campaigns for analytics purposes. Supports filtering by client IDs for focused analysis.',
      inputSchema: AnalyticsCampaignListRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsCampaignListRequestSchema.parse(params);
        const result = await client.getAnalyticsCampaignList(validatedParams);
        return formatSuccessResponse(
          'Campaign list fetched successfully for analytics',
          result,
          `Found ${result.data?.campaign_list?.length || 0} campaigns`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Client List Tool
  server.registerTool(
    'smartlead_analytics_client_list',
    {
      title: 'Analytics: Get Client List',
      description: 'Get a list of all clients for analytics and reporting purposes.',
      inputSchema: AnalyticsClientListRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsClientListRequestSchema.parse(params);
        const result = await client.getAnalyticsClientList(validatedParams);
        return formatSuccessResponse(
          'Client list fetched successfully for analytics',
          result,
          `Found ${result.data?.client_list?.length || 0} clients`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Monthly Client Count Tool
  server.registerTool(
    'smartlead_analytics_client_month_wise_count',
    {
      title: 'Analytics: Monthly Client Count',
      description: 'Get month-wise client count statistics for growth analysis.',
      inputSchema: AnalyticsClientMonthWiseCountRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsClientMonthWiseCountRequestSchema.parse(params);
        const result = await client.getAnalyticsClientMonthWiseCount(validatedParams);
        return formatSuccessResponse(
          'Monthly client count statistics fetched successfully',
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Overall Stats V2 Tool
  server.registerTool(
    'smartlead_analytics_overall_stats_v2',
    {
      title: 'Analytics: Overall Stats V2',
      description:
        'Get comprehensive overall analytics statistics including sent, opened, replied, bounced metrics with date range filtering.',
      inputSchema: AnalyticsOverallStatsV2RequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsOverallStatsV2RequestSchema.parse(params);
        const result = await client.getAnalyticsOverallStatsV2(validatedParams);
        const stats = result.data?.overall_stats;
        return formatSuccessResponse(
          'Overall analytics statistics fetched successfully',
          result,
          stats
            ? `Sent: ${stats.sent}, Opened: ${stats.opened}, Replied: ${stats.replied}, Open Rate: ${stats.open_rate}, Reply Rate: ${stats.reply_rate}`
            : undefined
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Day-wise Overall Stats Tool
  server.registerTool(
    'smartlead_analytics_day_wise_overall_stats',
    {
      title: 'Analytics: Day-wise Overall Stats',
      description: 'Get day-by-day breakdown of overall analytics statistics for trend analysis.',
      inputSchema: AnalyticsDayWiseOverallStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsDayWiseOverallStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsDayWiseOverallStats(validatedParams);
        return formatSuccessResponse(
          'Day-wise overall analytics statistics fetched successfully',
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Day-wise Positive Reply Stats Tool
  server.registerTool(
    'smartlead_analytics_day_wise_positive_reply_stats',
    {
      title: 'Analytics: Day-wise Positive Reply Stats',
      description:
        'Get day-by-day breakdown of positive reply statistics for detailed engagement analysis.',
      inputSchema: AnalyticsDayWiseOverallStatsRequestSchema.shape, // Same schema as day-wise overall stats
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsDayWiseOverallStatsRequestSchema.parse(params);
        const result = await client.analytics.getDayWisePositiveReplyStats(validatedParams);
        return formatSuccessResponse(
          'Day-wise positive reply stats fetched successfully',
          result,
          `Date range: ${validatedParams.start_date} to ${validatedParams.end_date}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Email Health Metrics Tool
  server.registerTool(
    'smartlead_analytics_mailbox_name_wise_health_metrics',
    {
      title: 'Analytics: Email Health Metrics',
      description:
        'Get health metrics for individual email accounts including deliverability and performance data.',
      inputSchema: AnalyticsMailboxNameWiseHealthMetricsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsMailboxNameWiseHealthMetricsRequestSchema.parse(params);
        const result = await client.getAnalyticsMailboxNameWiseHealthMetrics(validatedParams);
        return formatSuccessResponse('Email health metrics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Domain Health Metrics Tool
  server.registerTool(
    'smartlead_analytics_mailbox_domain_wise_health_metrics',
    {
      title: 'Analytics: Domain Health Metrics',
      description: 'Get health metrics grouped by domain for domain reputation analysis.',
      inputSchema: AnalyticsMailboxDomainWiseHealthMetricsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsMailboxDomainWiseHealthMetricsRequestSchema.parse(params);
        const result = await client.getAnalyticsMailboxDomainWiseHealthMetrics(validatedParams);
        return formatSuccessResponse('Domain health metrics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Email Provider Health Metrics Tool
  server.registerTool(
    'smartlead_analytics_mailbox_provider_wise_overall_performance',
    {
      title: 'Analytics: Email Provider Performance',
      description:
        'Get performance metrics grouped by email provider (Gmail, Outlook, etc.) for provider-specific analysis.',
      inputSchema: AnalyticsMailboxProviderWiseOverallPerformanceRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams =
          AnalyticsMailboxProviderWiseOverallPerformanceRequestSchema.parse(params);
        const result =
          await client.getAnalyticsMailboxProviderWiseOverallPerformance(validatedParams);
        return formatSuccessResponse(
          'Email provider performance metrics fetched successfully',
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Campaign Overall Stats Tool
  server.registerTool(
    'smartlead_analytics_campaign_overall_stats',
    {
      title: 'Analytics: Campaign Overall Stats',
      description:
        'Get overall performance statistics for campaigns with date range filtering and detailed metrics.',
      inputSchema: AnalyticsCampaignOverallStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsCampaignOverallStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsCampaignOverallStats(validatedParams);
        return formatSuccessResponse(
          'Campaign overall statistics fetched successfully',
          result,
          `Found ${result.data?.campaign_wise_performance?.length || 0} campaigns with performance data`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Client Overall Stats Tool
  server.registerTool(
    'smartlead_analytics_client_overall_stats',
    {
      title: 'Analytics: Client Overall Stats',
      description: 'Get overall performance statistics for clients with date range filtering.',
      inputSchema: AnalyticsClientOverallStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsClientOverallStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsClientOverallStats(validatedParams);
        return formatSuccessResponse('Client overall statistics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Team Board Stats Tool
  server.registerTool(
    'smartlead_analytics_team_board_overall_stats',
    {
      title: 'Analytics: Team Board Stats',
      description: 'Get team board performance statistics for team management and analysis.',
      inputSchema: AnalyticsTeamBoardOverallStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsTeamBoardOverallStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsTeamBoardOverallStats(validatedParams);
        return formatSuccessResponse('Team board statistics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Lead Overall Stats Tool
  server.registerTool(
    'smartlead_analytics_lead_overall_stats',
    {
      title: 'Analytics: Lead Overall Stats',
      description: 'Get overall lead performance statistics and metrics.',
      inputSchema: AnalyticsLeadOverallStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsLeadOverallStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsLeadOverallStats(validatedParams);
        return formatSuccessResponse('Lead overall statistics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Lead Category-wise Response Tool
  server.registerTool(
    'smartlead_analytics_lead_category_wise_response',
    {
      title: 'Analytics: Lead Category Response',
      description: 'Get lead response statistics grouped by category for detailed analysis.',
      inputSchema: AnalyticsLeadCategoryWiseResponseRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsLeadCategoryWiseResponseRequestSchema.parse(params);
        const result = await client.getAnalyticsLeadCategoryWiseResponse(validatedParams);
        return formatSuccessResponse(
          'Lead category-wise response statistics fetched successfully',
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Campaign Leads Take for First Reply Tool
  server.registerTool(
    'smartlead_analytics_campaign_leads_take_for_first_reply',
    {
      title: 'Analytics: Leads Take for First Reply',
      description: 'Get statistics on how long leads take to provide their first reply.',
      inputSchema: AnalyticsCampaignLeadsTakeForFirstReplyRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsCampaignLeadsTakeForFirstReplyRequestSchema.parse(params);
        const result = await client.getAnalyticsCampaignLeadsTakeForFirstReply(validatedParams);
        return formatSuccessResponse(
          'Lead first reply timing statistics fetched successfully',
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Campaign Follow-up Reply Rate Tool
  server.registerTool(
    'smartlead_analytics_campaign_follow_up_reply_rate',
    {
      title: 'Analytics: Follow-up Reply Rate',
      description: 'Get follow-up email reply rate statistics for campaign optimization.',
      inputSchema: AnalyticsCampaignFollowUpReplyRateRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsCampaignFollowUpReplyRateRequestSchema.parse(params);
        const result = await client.getAnalyticsCampaignFollowUpReplyRate(validatedParams);
        return formatSuccessResponse(
          'Follow-up reply rate statistics fetched successfully',
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Campaign Lead to Reply Time Tool
  server.registerTool(
    'smartlead_analytics_campaign_lead_to_reply_time',
    {
      title: 'Analytics: Lead to Reply Time',
      description: 'Get median time statistics for leads to reply to campaigns.',
      inputSchema: AnalyticsCampaignLeadToReplyTimeRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsCampaignLeadToReplyTimeRequestSchema.parse(params);
        const result = await client.getAnalyticsCampaignLeadToReplyTime(validatedParams);
        return formatSuccessResponse('Lead to reply time statistics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Campaign Response Stats Tool
  server.registerTool(
    'smartlead_analytics_campaign_response_stats',
    {
      title: 'Analytics: Campaign Response Stats',
      description: 'Get detailed campaign response statistics and performance metrics.',
      inputSchema: AnalyticsCampaignResponseStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsCampaignResponseStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsCampaignResponseStats(validatedParams);
        return formatSuccessResponse('Campaign response statistics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Campaign Status Stats Tool
  server.registerTool(
    'smartlead_analytics_campaign_status_stats',
    {
      title: 'Analytics: Campaign Status Stats',
      description: 'Get campaign statistics grouped by status for status-based analysis.',
      inputSchema: AnalyticsCampaignStatusStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsCampaignStatusStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsCampaignStatusStats(validatedParams);
        return formatSuccessResponse('Campaign status statistics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Analytics Mailbox Overall Stats Tool
  server.registerTool(
    'smartlead_analytics_mailbox_overall_stats',
    {
      title: 'Analytics: Mailbox Overall Stats',
      description: 'Get overall mailbox performance statistics and health metrics.',
      inputSchema: AnalyticsMailboxOverallStatsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AnalyticsMailboxOverallStatsRequestSchema.parse(params);
        const result = await client.getAnalyticsMailboxOverallStats(validatedParams);
        return formatSuccessResponse('Mailbox overall statistics fetched successfully', result);
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
