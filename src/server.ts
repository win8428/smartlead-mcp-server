/**
 * SmartLead MCP Server - Server Implementation
 * 
 * A comprehensive Model Context Protocol (MCP) server that exposes SmartLead API
 * endpoints as MCP tools. This server provides seamless integration with MCP-compatible
 * clients like Claude Desktop, Cursor, Windsurf, and others.
 * 
 * Architecture:
 * - Built on the official MCP SDK for maximum compatibility
 * - Comprehensive error handling and user-friendly responses
 * - Type-safe parameter validation using Zod schemas
 * - Professional logging and debugging capabilities
 * - Production-ready with graceful degradation
 * 
 * Tool Categories:
 * - Campaign Management (13 tools)
 * - Lead Management (8 tools)
 * - Statistics & Analytics (6 tools)
 * - Smart Delivery (4 tools)
 * - Webhooks (3 tools)
 * - Client Management (4 tools)
 * - Smart Senders (5 tools)
 * 
 * @author LeadMagic Team
 * @version 1.0.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SmartLeadClient, SmartLeadError } from './client.js';
import {
  CreateCampaignRequestSchema,
  UpdateCampaignScheduleRequestSchema,
  UpdateCampaignSettingsRequestSchema,
  UpdateCampaignStatusRequestSchema,
  GetCampaignRequestSchema,
  ListCampaignsRequestSchema,
  SaveCampaignSequenceRequestSchema,
  GetCampaignsWithAnalyticsRequestSchema,
  FetchLeadCategoriesRequestSchema,
  ListLeadsByCampaignRequestSchema,
  FetchLeadByEmailRequestSchema,
  AddLeadsToCampaignRequestSchema,
  ResumeLeadByCampaignRequestSchema,
  PauseLeadByCampaignRequestSchema,
  DeleteLeadByCampaignRequestSchema,
  UnsubscribeLeadFromCampaignRequestSchema,
  UnsubscribeLeadFromAllCampaignsRequestSchema,
  AddLeadToGlobalBlocklistRequestSchema,
  UpdateLeadByIdRequestSchema,
  UpdateLeadCategoryRequestSchema,
  FetchLeadMessageHistoryRequestSchema,
  ReplyToLeadFromMasterInboxRequestSchema,
  ForwardReplyRequestSchema,
  FetchAllLeadsFromAccountRequestSchema,
  FetchLeadsFromGlobalBlocklistRequestSchema,
} from './types.js';

/**
 * MCP Tool Response Structure
 * Standard response format for all MCP tools that matches MCP SDK expectations
 */
interface MCPToolResponse {
  content: Array<{ type: 'text'; text: string }>;
  [x: string]: unknown;
}

/**
 * SmartLead MCP Server Class
 * 
 * This class implements a complete MCP server that exposes all SmartLead API functionality
 * as MCP tools. It handles authentication, parameter validation, error management, and
 * response formatting according to MCP specifications.
 */
export class SmartLeadMCPServer {
  private server: McpServer;
  private client: SmartLeadClient;
  private readonly apiKey: string;

  /**
   * Creates a new SmartLead MCP server instance
   * 
   * @param apiKey - SmartLead API key for authentication
   * @throws {Error} If API key is invalid or missing
   */
  constructor(apiKey: string) {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      throw new Error('Valid SmartLead API key is required');
    }

    this.apiKey = apiKey.trim();

    // Initialize MCP server with metadata
    this.server = new McpServer({
      name: 'smartlead-mcp-server',
      version: '1.0.0',
    });

    // Initialize SmartLead API client
    this.client = new SmartLeadClient({
      apiKey: this.apiKey,
    });

    // Register all MCP tools
    this.setupTools();
  }

  /**
   * Registers all SmartLead API endpoints as MCP tools
   * 
   * This method sets up all SmartLead tools with proper schemas, descriptions,
   * and error handling. Each tool is carefully configured to provide the best
   * user experience in MCP clients.
   * 
   * @private
   */
  private setupTools(): void {
    this.setupCampaignTools();
    this.setupLeadTools();
    this.setupAnalyticsTools();
    this.setupSmartDeliveryTools();
    this.setupWebhookTools();
    this.setupClientManagementTools();
    this.setupSmartSendersTools();
  }

  // ================================
  // CAMPAIGN MANAGEMENT TOOLS
  // ================================

  /**
   * Sets up campaign management tools
   * @private
   */
  private setupCampaignTools(): void {
    // Comprehensive Campaign Analytics Tool - PRIORITY for large datasets
    this.server.registerTool(
      'smartlead_get_campaigns_with_analytics',
      {
        title: 'Get Campaigns with Analytics',
        description: 'Get campaigns with their analytics data in one efficient call. Supports filtering by client, status, and date range to handle large datasets efficiently. Use this for comprehensive campaign reporting.',
        inputSchema: GetCampaignsWithAnalyticsRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = GetCampaignsWithAnalyticsRequestSchema.parse(params);
          const result = await this.client.getCampaignsWithAnalytics(validatedParams);
          return this.formatSuccessResponse(
            `Retrieved ${result.campaigns.length} campaigns with analytics`,
            result,
            `Total campaigns: ${result.summary.total_campaigns}, Active: ${result.summary.active_campaigns}, Paused: ${result.summary.paused_campaigns}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Create Campaign Tool
    this.server.registerTool(
      'smartlead_create_campaign',
      {
        title: 'Create Campaign',
        description: 'Create a new email campaign in SmartLead. This tool allows you to set up a new campaign with a name and optional client assignment.',
        inputSchema: CreateCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = CreateCampaignRequestSchema.parse(params);
          const result = await this.client.createCampaign(validatedParams);
          return this.formatSuccessResponse(
            `Campaign "${validatedParams.name}" created successfully`,
            result,
            `Campaign ID: ${result.id || 'N/A'}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Update Campaign Schedule Tool
    this.server.registerTool(
      'smartlead_update_campaign_schedule',
      {
        title: 'Update Campaign Schedule',
        description: 'Update the sending schedule for a campaign including timezone, days of week, hours, and lead limits.',
        inputSchema: UpdateCampaignScheduleRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = UpdateCampaignScheduleRequestSchema.parse(params);
          const { campaign_id, ...scheduleParams } = validatedParams;
          const result = await this.client.updateCampaignSchedule(campaign_id, scheduleParams);
          return this.formatSuccessResponse(
            `Campaign schedule updated for campaign ${campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Update Campaign Settings Tool
    this.server.registerTool(
      'smartlead_update_campaign_settings',
      {
        title: 'Update Campaign Settings',
        description: 'Update general settings for a campaign including name, status, and other configuration options.',
        inputSchema: UpdateCampaignSettingsRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = UpdateCampaignSettingsRequestSchema.parse(params);
          const { campaign_id, ...settingsParams } = validatedParams;
          const result = await this.client.updateCampaignSettings(campaign_id, settingsParams);
          return this.formatSuccessResponse(
            `Campaign settings updated for campaign ${campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Update Campaign Status Tool
    this.server.registerTool(
      'smartlead_update_campaign_status',
      {
        title: 'Update Campaign Status',
        description: 'Change the status of a campaign (START, PAUSED, or STOPPED). Use this to control campaign execution.',
        inputSchema: UpdateCampaignStatusRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = UpdateCampaignStatusRequestSchema.parse(params);
          const result = await this.client.updateCampaignStatus(
            validatedParams.campaign_id,
            validatedParams.status
          );
          return this.formatSuccessResponse(
            `Campaign ${validatedParams.campaign_id} status updated to ${validatedParams.status}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Get Campaign Tool
    this.server.registerTool(
      'smartlead_get_campaign',
      {
        title: 'Get Campaign Details',
        description: 'Retrieve detailed information about a specific campaign including settings, statistics, and configuration.',
        inputSchema: GetCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = GetCampaignRequestSchema.parse(params);
          const result = await this.client.getCampaign(validatedParams.campaign_id);
          return this.formatSuccessResponse(
            `Campaign details retrieved for campaign ${validatedParams.campaign_id}`,
            result,
            `Campaign: ${result.name || 'N/A'}, Status: ${result.status || 'N/A'}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // List Campaigns Tool
    this.server.registerTool(
      'smartlead_list_campaigns',
      {
        title: 'List Campaigns',
        description: 'Get a list of all campaigns with optional filtering by status, limit, and offset for pagination.',
        inputSchema: ListCampaignsRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = ListCampaignsRequestSchema.parse(params);
          const result = await this.client.listCampaigns(validatedParams);
          const count = Array.isArray(result) ? result.length : result.total || 0;
          return this.formatSuccessResponse(
            `Retrieved ${count} campaigns`,
            result,
            `Total campaigns: ${count}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Save Campaign Sequence Tool
    this.server.registerTool(
      'smartlead_save_campaign_sequence',
      {
        title: 'Save Campaign Sequence',
        description: 'Save or update the email sequence for a campaign. Define multiple emails with delays, variants, and A/B testing configuration.',
        inputSchema: SaveCampaignSequenceRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = SaveCampaignSequenceRequestSchema.parse(params);
          const result = await this.client.saveCampaignSequence(
            validatedParams.campaign_id,
            validatedParams.sequence
          );
          return this.formatSuccessResponse(
            `Email sequence saved for campaign ${validatedParams.campaign_id}`,
            result,
            `Sequence steps: ${validatedParams.sequence.length}`
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Get Campaign Sequence Tool
    this.server.registerTool(
      'smartlead_get_campaign_sequence',
      {
        title: 'Get Campaign Sequence',
        description: 'Retrieve the email sequence configuration for a campaign including all steps, variants, and settings.',
        inputSchema: GetCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = GetCampaignRequestSchema.parse(params);
          const result = await this.client.getCampaignSequence(validatedParams.campaign_id);
          return this.formatSuccessResponse(
            `Email sequence retrieved for campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  // ================================
  // PLACEHOLDER METHODS FOR OTHER TOOL CATEGORIES
  // ================================

  /**
   * Sets up lead management tools
   * @private
   */
  private setupLeadTools(): void {
    // List leads by campaign
    this.server.registerTool(
      'smartlead_list_leads_by_campaign',
      {
        title: 'List Leads by Campaign',
        description: 'List all leads for a specific campaign with optional filtering and pagination.',
        inputSchema: ListLeadsByCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = ListLeadsByCampaignRequestSchema.parse(params);
          const result = await this.client.listLeadsByCampaign(validatedParams.campaign_id, validatedParams);
          return this.formatSuccessResponse(
            `Retrieved ${Array.isArray(result) ? result.length : 'unknown'} leads for campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Fetch lead categories
    this.server.registerTool(
      'smartlead_fetch_lead_categories',
      {
        title: 'Fetch Lead Categories',
        description: 'Get all available lead categories in the system.',
        inputSchema: FetchLeadCategoriesRequestSchema.shape,
      },
      async () => {
        try {
          const result = await this.client.fetchLeadCategories();
          return this.formatSuccessResponse('Retrieved lead categories', result);
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Fetch lead by email
    this.server.registerTool(
      'smartlead_fetch_lead_by_email',
      {
        title: 'Fetch Lead by Email',
        description: 'Find a lead by their email address.',
        inputSchema: FetchLeadByEmailRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = FetchLeadByEmailRequestSchema.parse(params);
          const result = await this.client.fetchLeadByEmail(validatedParams.email);
          return this.formatSuccessResponse(`Found lead with email ${validatedParams.email}`, result);
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Add leads to campaign
    this.server.registerTool(
      'smartlead_add_leads_to_campaign',
      {
        title: 'Add Leads to Campaign',
        description: 'Add one or more leads to a campaign.',
        inputSchema: AddLeadsToCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = AddLeadsToCampaignRequestSchema.parse(params);
          const result = await this.client.addLeadsToCampaign(validatedParams.campaign_id, validatedParams.leads);
          return this.formatSuccessResponse(
            `Added ${validatedParams.leads.length} leads to campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Resume lead by campaign
    this.server.registerTool(
      'smartlead_resume_lead_by_campaign',
      {
        title: 'Resume Lead by Campaign',
        description: 'Resume a paused lead in a specific campaign.',
        inputSchema: ResumeLeadByCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = ResumeLeadByCampaignRequestSchema.parse(params);
          const result = await this.client.resumeLeadByCampaign(validatedParams.campaign_id, validatedParams.lead_id);
          return this.formatSuccessResponse(
            `Resumed lead ${validatedParams.lead_id} in campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Pause lead by campaign
    this.server.registerTool(
      'smartlead_pause_lead_by_campaign',
      {
        title: 'Pause Lead by Campaign',
        description: 'Pause an active lead in a specific campaign.',
        inputSchema: PauseLeadByCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = PauseLeadByCampaignRequestSchema.parse(params);
          const result = await this.client.pauseLeadByCampaign(validatedParams.campaign_id, validatedParams.lead_id);
          return this.formatSuccessResponse(
            `Paused lead ${validatedParams.lead_id} in campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Delete lead by campaign
    this.server.registerTool(
      'smartlead_delete_lead_by_campaign',
      {
        title: 'Delete Lead by Campaign',
        description: 'Delete a lead from a specific campaign.',
        inputSchema: DeleteLeadByCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = DeleteLeadByCampaignRequestSchema.parse(params);
          const result = await this.client.deleteLeadByCampaign(validatedParams.campaign_id, validatedParams.lead_id);
          return this.formatSuccessResponse(
            `Deleted lead ${validatedParams.lead_id} from campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Unsubscribe lead from campaign
    this.server.registerTool(
      'smartlead_unsubscribe_lead_from_campaign',
      {
        title: 'Unsubscribe Lead from Campaign',
        description: 'Unsubscribe a lead from a specific campaign.',
        inputSchema: UnsubscribeLeadFromCampaignRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = UnsubscribeLeadFromCampaignRequestSchema.parse(params);
          const result = await this.client.unsubscribeLeadFromCampaign(validatedParams.campaign_id, validatedParams.lead_id);
          return this.formatSuccessResponse(
            `Unsubscribed lead ${validatedParams.lead_id} from campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Unsubscribe lead from all campaigns
    this.server.registerTool(
      'smartlead_unsubscribe_lead_from_all_campaigns',
      {
        title: 'Unsubscribe Lead from All Campaigns',
        description: 'Unsubscribe a lead from all campaigns globally.',
        inputSchema: UnsubscribeLeadFromAllCampaignsRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = UnsubscribeLeadFromAllCampaignsRequestSchema.parse(params);
          const result = await this.client.unsubscribeLeadFromAllCampaigns(validatedParams.lead_id);
          return this.formatSuccessResponse(
            `Unsubscribed lead ${validatedParams.lead_id} from all campaigns`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Add lead to global blocklist
    this.server.registerTool(
      'smartlead_add_lead_to_global_blocklist',
      {
        title: 'Add Lead to Global Blocklist',
        description: 'Add a lead email to the global blocklist.',
        inputSchema: AddLeadToGlobalBlocklistRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = AddLeadToGlobalBlocklistRequestSchema.parse(params);
          const result = await this.client.addLeadToGlobalBlocklist(validatedParams.email);
          return this.formatSuccessResponse(
            `Added ${validatedParams.email} to global blocklist`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Fetch all leads from account
    this.server.registerTool(
      'smartlead_fetch_all_leads_from_account',
      {
        title: 'Fetch All Leads from Account',
        description: 'Fetch all leads from the entire account with optional filtering.',
        inputSchema: FetchAllLeadsFromAccountRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.fetchAllLeadsFromAccount(params);
          return this.formatSuccessResponse('Retrieved all leads from account', result);
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Fetch leads from global blocklist
    this.server.registerTool(
      'smartlead_fetch_leads_from_global_blocklist',
      {
        title: 'Fetch Leads from Global Blocklist',
        description: 'Fetch all leads from the global blocklist.',
        inputSchema: FetchLeadsFromGlobalBlocklistRequestSchema.shape,
      },
      async (params) => {
        try {
          const result = await this.client.fetchLeadsFromGlobalBlocklist(params);
          return this.formatSuccessResponse('Retrieved leads from global blocklist', result);
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Update lead by ID
    this.server.registerTool(
      'smartlead_update_lead_by_id',
      {
        title: 'Update Lead by ID',
        description: 'Update lead information using the lead ID.',
        inputSchema: UpdateLeadByIdRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = UpdateLeadByIdRequestSchema.parse(params);
          const { lead_id, ...leadData } = validatedParams;
          const result = await this.client.updateLeadById(lead_id, leadData);
          return this.formatSuccessResponse(`Updated lead ${lead_id}`, result);
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Update lead category
    this.server.registerTool(
      'smartlead_update_lead_category',
      {
        title: 'Update Lead Category',
        description: 'Update a lead\'s category based on their campaign.',
        inputSchema: UpdateLeadCategoryRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = UpdateLeadCategoryRequestSchema.parse(params);
          const result = await this.client.updateLeadCategory(
            validatedParams.campaign_id,
            validatedParams.lead_id,
            validatedParams.category
          );
          return this.formatSuccessResponse(
            `Updated category for lead ${validatedParams.lead_id} in campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Fetch lead message history
    this.server.registerTool(
      'smartlead_fetch_lead_message_history',
      {
        title: 'Fetch Lead Message History',
        description: 'Fetch message history for a lead based on campaign.',
        inputSchema: FetchLeadMessageHistoryRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = FetchLeadMessageHistoryRequestSchema.parse(params);
          const result = await this.client.fetchLeadMessageHistory(validatedParams.campaign_id, validatedParams.lead_id);
          return this.formatSuccessResponse(
            `Retrieved message history for lead ${validatedParams.lead_id} in campaign ${validatedParams.campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Reply to lead from master inbox
    this.server.registerTool(
      'smartlead_reply_to_lead_from_master_inbox',
      {
        title: 'Reply to Lead from Master Inbox',
        description: 'Reply to a lead from the master inbox via API.',
        inputSchema: ReplyToLeadFromMasterInboxRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = ReplyToLeadFromMasterInboxRequestSchema.parse(params);
          const { campaign_id, lead_id, ...replyData } = validatedParams;
          const result = await this.client.replyToLeadFromMasterInbox(campaign_id, lead_id, replyData);
          return this.formatSuccessResponse(
            `Sent reply to lead ${lead_id} in campaign ${campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );

    // Forward reply
    this.server.registerTool(
      'smartlead_forward_reply',
      {
        title: 'Forward Reply',
        description: 'Forward a reply to another email address.',
        inputSchema: ForwardReplyRequestSchema.shape,
      },
      async (params) => {
        try {
          const validatedParams = ForwardReplyRequestSchema.parse(params);
          const { campaign_id, lead_id, ...forwardData } = validatedParams;
          const result = await this.client.forwardReply(campaign_id, lead_id, forwardData);
          return this.formatSuccessResponse(
            `Forwarded reply for lead ${lead_id} in campaign ${campaign_id}`,
            result
          );
        } catch (error) {
          return this.handleError(error);
        }
      }
    );
  }

  /**
   * Sets up analytics and statistics tools
   * @private
   */
  private setupAnalyticsTools(): void {
    // TODO: Implement analytics tools
  }

  /**
   * Sets up smart delivery tools
   * @private
   */
  private setupSmartDeliveryTools(): void {
    // TODO: Implement smart delivery tools
  }

  /**
   * Sets up webhook tools
   * @private
   */
  private setupWebhookTools(): void {
    // TODO: Implement webhook tools
  }

  /**
   * Sets up client management tools
   * @private
   */
  private setupClientManagementTools(): void {
    // TODO: Implement client management tools
  }

  /**
   * Sets up smart senders tools
   * @private
   */
  private setupSmartSendersTools(): void {
    // TODO: Implement smart senders tools
  }

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Formats successful API responses for MCP clients
   *
   * @param message - User-friendly message describing the operation
   * @param data - Raw API response data
   * @param summary - Optional summary for quick overview
   * @returns Formatted MCP tool response
   * @private
   */
  private formatSuccessResponse(
    message: string,
    data?: unknown,
    summary?: string
  ): MCPToolResponse {
    const responseText = [
      `✅ ${message}`,
      summary ? `\n📊 ${summary}` : '',
      data ? `\n\n📋 **Detailed Results:**\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`` : ''
    ].filter(Boolean).join('');

    return {
      content: [
        {
          type: 'text' as const,
          text: responseText,
        },
      ],
    };
  }

  /**
   * Handles and formats errors for MCP clients
   *
   * Provides comprehensive error information while maintaining user-friendly messaging.
   * Includes specific guidance for common error scenarios.
   *
   * @param error - The error that occurred
   * @returns Formatted MCP error response
   * @private
   */
  private handleError(error: unknown): MCPToolResponse {
    console.error('SmartLead API Error:', error);

    let errorMessage = '❌ An unexpected error occurred';
    let errorDetails = '';
    let troubleshooting = '';

    if (error instanceof SmartLeadError) {
      // Handle SmartLead-specific errors
      errorMessage = `❌ SmartLead API Error: ${error.message}`;
      errorDetails = `**Error Code:** ${error.code}\n**Status:** ${error.status}`;

      // Provide specific troubleshooting guidance
      if (error.isClientError()) {
        if (error.status === 401) {
          troubleshooting = '🔧 **Troubleshooting:** Please check your API key is valid and has sufficient permissions.';
        } else if (error.status === 429) {
          troubleshooting = '🔧 **Troubleshooting:** Rate limit exceeded. Please wait a moment before making more requests.';
        } else if (error.status === 400) {
          troubleshooting = '🔧 **Troubleshooting:** Please check that all required parameters are provided and valid.';
        } else {
          troubleshooting = '🔧 **Troubleshooting:** Please verify your request parameters and try again.';
        }
      } else if (error.isServerError()) {
        troubleshooting = '🔧 **Troubleshooting:** SmartLead server error. Please try again in a few moments.';
      } else if (error.isNetworkError()) {
        troubleshooting = '🔧 **Troubleshooting:** Network connectivity issue. Please check your internet connection.';
      }
    } else if (error instanceof Error) {
      // Handle generic JavaScript errors
      errorMessage = `❌ Error: ${error.message}`;
      errorDetails = `**Type:** ${error.name}`;
      troubleshooting = '🔧 **Troubleshooting:** Please check your input parameters and try again.';
    } else {
      // Handle unknown error types
      errorMessage = '❌ An unknown error occurred';
      errorDetails = '**Type:** Unknown';
      troubleshooting = '🔧 **Troubleshooting:** Please try again or contact support if the issue persists.';
    }

    const responseText = [
      errorMessage,
      errorDetails ? `\n${errorDetails}` : '',
      troubleshooting ? `\n\n${troubleshooting}` : '',
      '\n\n💡 **Need Help?** Visit: https://github.com/LeadMagic/smartlead-mcp-server/issues'
    ].filter(Boolean).join('');

    return {
      content: [
        {
          type: 'text' as const,
          text: responseText,
        },
      ],
    };
  }

  /**
   * Gets the underlying MCP server instance
   *
   * @returns The MCP server instance for external usage
   */
  public getServer(): McpServer {
    return this.server;
  }

  /**
   * Tests the SmartLead API connection
   *
   * @returns Promise resolving to connection test results
   */
  public async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const result = await this.client.testConnection();
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection test failed';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Gets server statistics and health information
   *
   * @returns Server health and configuration information
   */
  public getServerInfo(): {
    name: string;
    version: string;
    toolCount: number;
    apiKeyMasked: string;
    clientConfig: Partial<any>;
  } {
    return {
      name: 'smartlead-mcp-server',
      version: '1.0.0',
      toolCount: 8, // Current number of implemented tools
      apiKeyMasked: this.apiKey.substring(0, 8) + '...',
      clientConfig: this.client.getConfig()
    };
  }
}

/**
 * Factory function to create a new SmartLead MCP server instance
 *
 * This is the main entry point for creating MCP servers. It provides a clean
 * interface that abstracts the complexity of server initialization.
 *
 * @param apiKey - SmartLead API key for authentication
 * @returns Configured MCP server ready for use
 * @throws {Error} If API key is invalid
 *
 * @example
 * ```typescript
 * const server = createSmartLeadServer('your-api-key');
 * await server.connect(transport);
 * ```
 */
export function createSmartLeadServer(apiKey: string): McpServer {
  const mcpServer = new SmartLeadMCPServer(apiKey);
  return mcpServer.getServer();
}
