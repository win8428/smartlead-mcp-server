/**
 * SmartLead MCP Server - Campaign Tools
 *
 * MCP tools for campaign management operations.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SmartLeadClient } from '../client/index.js';
import { MCPToolResponse } from '../types/config.js';
import {
  CreateCampaignRequestSchema,
  UpdateCampaignScheduleRequestSchema,
  UpdateCampaignSettingsRequestSchema,
  UpdateCampaignStatusRequestSchema,
  GetCampaignRequestSchema,
  ListCampaignsRequestSchema,
  SaveCampaignSequenceRequestSchema,
  GetCampaignSequenceRequestSchema,
  GetCampaignsWithAnalyticsRequestSchema,
  DeleteCampaignRequestSchema,
  ExportCampaignDataRequestSchema,
  FetchCampaignAnalyticsByDateRangeRequestSchema,
  GetCampaignSequenceAnalyticsRequestSchema,
  FetchAllCampaignsUsingLeadIdRequestSchema,
} from '../types.js';

/**
 * Register all campaign management tools
 */
export function registerCampaignTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data: any, summary?: string) => MCPToolResponse,
  handleError: (error: any) => MCPToolResponse
): void {
  // Create Campaign Tool
  server.registerTool(
    'smartlead_create_campaign',
    {
      title: 'Create Campaign',
      description:
        'Create a new SmartLead campaign with specified name and optional client assignment.',
      inputSchema: CreateCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = CreateCampaignRequestSchema.parse(params);
        const result = await client.createCampaign(validatedParams);
        return formatSuccessResponse(
          'Campaign created successfully',
          result,
          `Campaign "${validatedParams.name}" created with ID: ${result.data?.id || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Update Campaign Schedule Tool
  server.registerTool(
    'smartlead_update_campaign_schedule',
    {
      title: 'Update Campaign Schedule',
      description:
        'Update the sending schedule for a specific campaign including timing, frequency, and delivery windows.',
      inputSchema: UpdateCampaignScheduleRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateCampaignScheduleRequestSchema.parse(params);
        const { campaign_id, ...scheduleData } = validatedParams;
        const result = await client.updateCampaignSchedule(campaign_id, scheduleData);
        return formatSuccessResponse(
          'Campaign schedule updated successfully',
          result,
          `Schedule updated for campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Update Campaign Settings Tool
  server.registerTool(
    'smartlead_update_campaign_settings',
    {
      title: 'Update Campaign Settings',
      description:
        'Update various campaign settings including tracking, personalization, and delivery options.',
      inputSchema: UpdateCampaignSettingsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateCampaignSettingsRequestSchema.parse(params);
        const { campaign_id, ...settingsData } = validatedParams;
        const result = await client.updateCampaignSettings(campaign_id, settingsData);
        return formatSuccessResponse(
          'Campaign settings updated successfully',
          result,
          `Settings updated for campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Update Campaign Status Tool
  server.registerTool(
    'smartlead_update_campaign_status',
    {
      title: 'Update Campaign Status',
      description: 'Update the status of a campaign (e.g., start, pause, stop, archive).',
      inputSchema: UpdateCampaignStatusRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateCampaignStatusRequestSchema.parse(params);
        const result = await client.updateCampaignStatus(
          validatedParams.campaign_id,
          validatedParams.status
        );
        return formatSuccessResponse(
          'Campaign status updated successfully',
          result,
          `Campaign ID ${validatedParams.campaign_id} status changed to: ${validatedParams.status}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Campaign Tool
  server.registerTool(
    'smartlead_get_campaign',
    {
      title: 'Get Campaign Details',
      description:
        'Retrieve detailed information about a specific campaign including settings, statistics, and configuration.',
      inputSchema: GetCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignRequestSchema.parse(params);
        const result = await client.getCampaign(validatedParams.campaign_id);
        return formatSuccessResponse(
          'Campaign details retrieved successfully',
          result,
          `Retrieved details for campaign: ${result.data?.name || `ID ${validatedParams.campaign_id}`}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // List Campaigns Tool
  server.registerTool(
    'smartlead_list_campaigns',
    {
      title: 'List Campaigns',
      description:
        'Retrieve a list of all campaigns with optional filtering by status, client, or other criteria.',
      inputSchema: ListCampaignsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ListCampaignsRequestSchema.parse(params);
        const result = await client.listCampaigns(validatedParams);
        return formatSuccessResponse(
          'Campaigns list retrieved successfully',
          result,
          `Found ${result.data?.campaigns?.length || 0} campaigns`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Save Campaign Sequence Tool
  server.registerTool(
    'smartlead_save_campaign_sequence',
    {
      title: 'Save Campaign Sequence',
      description:
        'Save or update the email sequence for a campaign including follow-up emails and timing.',
      inputSchema: SaveCampaignSequenceRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = SaveCampaignSequenceRequestSchema.parse(params);
        const { campaign_id, ...sequenceData } = validatedParams;
        const result = await client.saveCampaignSequence(campaign_id, sequenceData);
        return formatSuccessResponse(
          'Campaign sequence saved successfully',
          result,
          `Sequence saved for campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Campaign Sequence Tool
  server.registerTool(
    'smartlead_get_campaign_sequence',
    {
      title: 'Get Campaign Sequence',
      description: 'Retrieve the email sequence configuration for a specific campaign.',
      inputSchema: GetCampaignSequenceRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignSequenceRequestSchema.parse(params);
        const result = await client.getCampaignSequence(validatedParams.campaign_id);
        return formatSuccessResponse(
          'Campaign sequence retrieved successfully',
          result,
          `Retrieved sequence for campaign ID: ${validatedParams.campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Campaigns with Analytics Tool
  server.registerTool(
    'smartlead_get_campaigns_with_analytics',
    {
      title: 'Get Campaigns with Analytics',
      description: 'Retrieve campaigns list with embedded analytics data for performance overview.',
      inputSchema: GetCampaignsWithAnalyticsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignsWithAnalyticsRequestSchema.parse(params);
        const result = await client.getCampaignsWithAnalytics(validatedParams);
        return formatSuccessResponse(
          'Campaigns with analytics retrieved successfully',
          result,
          `Retrieved ${result.data?.campaigns?.length || 0} campaigns with analytics data`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Delete Campaign Tool
  server.registerTool(
    'smartlead_delete_campaign',
    {
      title: 'Delete Campaign',
      description:
        'Permanently delete a campaign and all associated data. This action cannot be undone.',
      inputSchema: DeleteCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = DeleteCampaignRequestSchema.parse(params);
        const result = await client.deleteCampaign(validatedParams.campaign_id);
        return formatSuccessResponse(
          'Campaign deleted successfully',
          result,
          `Campaign ID ${validatedParams.campaign_id} has been permanently deleted`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Export Campaign Data Tool
  server.registerTool(
    'smartlead_export_campaign_data',
    {
      title: 'Export Campaign Data',
      description:
        'Export campaign data in various formats (CSV, Excel, JSON) for analysis or backup purposes.',
      inputSchema: ExportCampaignDataRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ExportCampaignDataRequestSchema.parse(params);
        const { campaign_id, ...exportParams } = validatedParams;
        const result = await client.exportCampaignData(campaign_id, exportParams);
        return formatSuccessResponse(
          'Campaign data export initiated successfully',
          result,
          `Export started for campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Campaign Analytics by Date Range Tool
  server.registerTool(
    'smartlead_fetch_campaign_analytics_by_date_range',
    {
      title: 'Fetch Campaign Analytics by Date Range',
      description: 'Retrieve detailed analytics for a campaign within a specific date range.',
      inputSchema: FetchCampaignAnalyticsByDateRangeRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = FetchCampaignAnalyticsByDateRangeRequestSchema.parse(params);
        const { campaign_id, ...analyticsParams } = validatedParams;
        const result = await client.fetchCampaignAnalyticsByDateRange(campaign_id, analyticsParams);
        return formatSuccessResponse(
          'Campaign analytics retrieved successfully',
          result,
          `Analytics retrieved for campaign ID: ${campaign_id} from ${analyticsParams.start_date} to ${analyticsParams.end_date}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Campaign Sequence Analytics Tool
  server.registerTool(
    'smartlead_get_campaign_sequence_analytics',
    {
      title: 'Get Campaign Sequence Analytics',
      description:
        'Retrieve analytics data for each step in a campaign sequence to optimize performance.',
      inputSchema: GetCampaignSequenceAnalyticsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetCampaignSequenceAnalyticsRequestSchema.parse(params);
        const { campaign_id, ...analyticsParams } = validatedParams;
        const result = await client.getCampaignSequenceAnalytics(campaign_id, analyticsParams);
        return formatSuccessResponse(
          'Campaign sequence analytics retrieved successfully',
          result,
          `Sequence analytics retrieved for campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch All Campaigns Using Lead ID Tool
  server.registerTool(
    'smartlead_fetch_all_campaigns_using_lead_id',
    {
      title: 'Fetch Campaigns by Lead ID',
      description:
        'Retrieve all campaigns that contain a specific lead for cross-campaign analysis.',
      inputSchema: FetchAllCampaignsUsingLeadIdRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = FetchAllCampaignsUsingLeadIdRequestSchema.parse(params);
        const result = await client.fetchAllCampaignsUsingLeadId(validatedParams.lead_id);
        return formatSuccessResponse(
          'Campaigns retrieved successfully by lead ID',
          result,
          `Found ${result.data?.campaigns?.length || 0} campaigns containing lead ID: ${validatedParams.lead_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
