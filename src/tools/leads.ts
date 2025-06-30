/**
 * SmartLead MCP Server - Lead Tools
 *
 * MCP tools for lead management operations.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SmartLeadClient } from '../client/index.js';
import { MCPToolResponse } from '../types/config.js';
import {
  ListLeadsByCampaignRequestSchema,
  FetchLeadCategoriesRequestSchema,
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
} from '../types.js';

/**
 * Register all lead management tools
 */
export function registerLeadTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data: any, summary?: string) => MCPToolResponse,
  handleError: (error: any) => MCPToolResponse
): void {
  // List Leads by Campaign Tool
  server.registerTool(
    'smartlead_list_leads_by_campaign',
    {
      title: 'List Leads by Campaign',
      description:
        'Retrieve all leads associated with a specific campaign, with optional filtering and pagination.',
      inputSchema: ListLeadsByCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ListLeadsByCampaignRequestSchema.parse(params);
        const { campaign_id, ...queryParams } = validatedParams;
        const result = await client.listLeadsByCampaign(campaign_id, queryParams);
        return formatSuccessResponse(
          'Leads retrieved successfully',
          result,
          `Found ${result.data?.leads?.length || 0} leads in campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Lead Categories Tool
  server.registerTool(
    'smartlead_fetch_lead_categories',
    {
      title: 'Fetch Lead Categories',
      description:
        'Retrieve all available lead categories for classification and filtering purposes.',
      inputSchema: FetchLeadCategoriesRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = FetchLeadCategoriesRequestSchema.parse(params);
        const result = await client.fetchLeadCategories();
        return formatSuccessResponse(
          'Lead categories retrieved successfully',
          result,
          `Found ${result.data?.categories?.length || 0} lead categories`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Lead by Email Tool
  server.registerTool(
    'smartlead_fetch_lead_by_email',
    {
      title: 'Fetch Lead by Email',
      description: 'Find and retrieve lead information using their email address.',
      inputSchema: FetchLeadByEmailRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = FetchLeadByEmailRequestSchema.parse(params);
        const result = await client.fetchLeadByEmail(validatedParams.email);
        return formatSuccessResponse(
          'Lead retrieved successfully by email',
          result,
          `Found lead: ${validatedParams.email}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Add Leads to Campaign Tool
  server.registerTool(
    'smartlead_add_leads_to_campaign',
    {
      title: 'Add Leads to Campaign',
      description:
        'Add one or more leads to a specific campaign with validation and duplicate checking.',
      inputSchema: AddLeadsToCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AddLeadsToCampaignRequestSchema.parse(params);
        const { campaign_id, leads } = validatedParams;
        const result = await client.addLeadsToCampaign(campaign_id, leads);
        return formatSuccessResponse(
          'Leads added to campaign successfully',
          result,
          `Added ${leads.length} leads to campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Resume Lead by Campaign Tool
  server.registerTool(
    'smartlead_resume_lead_by_campaign',
    {
      title: 'Resume Lead in Campaign',
      description: 'Resume email sending to a paused lead within a specific campaign.',
      inputSchema: ResumeLeadByCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ResumeLeadByCampaignRequestSchema.parse(params);
        const result = await client.resumeLeadByCampaign(
          validatedParams.campaign_id,
          validatedParams.lead_id
        );
        return formatSuccessResponse(
          'Lead resumed successfully',
          result,
          `Lead ID ${validatedParams.lead_id} resumed in campaign ID: ${validatedParams.campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Pause Lead by Campaign Tool
  server.registerTool(
    'smartlead_pause_lead_by_campaign',
    {
      title: 'Pause Lead in Campaign',
      description:
        'Pause email sending to a lead within a specific campaign without removing them.',
      inputSchema: PauseLeadByCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = PauseLeadByCampaignRequestSchema.parse(params);
        const result = await client.pauseLeadByCampaign(
          validatedParams.campaign_id,
          validatedParams.lead_id
        );
        return formatSuccessResponse(
          'Lead paused successfully',
          result,
          `Lead ID ${validatedParams.lead_id} paused in campaign ID: ${validatedParams.campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Delete Lead by Campaign Tool
  server.registerTool(
    'smartlead_delete_lead_by_campaign',
    {
      title: 'Delete Lead from Campaign',
      description: 'Remove a lead from a specific campaign permanently.',
      inputSchema: DeleteLeadByCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = DeleteLeadByCampaignRequestSchema.parse(params);
        const result = await client.deleteLeadByCampaign(
          validatedParams.campaign_id,
          validatedParams.lead_id
        );
        return formatSuccessResponse(
          'Lead deleted from campaign successfully',
          result,
          `Lead ID ${validatedParams.lead_id} removed from campaign ID: ${validatedParams.campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Unsubscribe Lead from Campaign Tool
  server.registerTool(
    'smartlead_unsubscribe_lead_from_campaign',
    {
      title: 'Unsubscribe Lead from Campaign',
      description: 'Unsubscribe a lead from a specific campaign, stopping all future emails.',
      inputSchema: UnsubscribeLeadFromCampaignRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UnsubscribeLeadFromCampaignRequestSchema.parse(params);
        const result = await client.unsubscribeLeadFromCampaign(
          validatedParams.campaign_id,
          validatedParams.lead_id
        );
        return formatSuccessResponse(
          'Lead unsubscribed from campaign successfully',
          result,
          `Lead ID ${validatedParams.lead_id} unsubscribed from campaign ID: ${validatedParams.campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Unsubscribe Lead from All Campaigns Tool
  server.registerTool(
    'smartlead_unsubscribe_lead_from_all_campaigns',
    {
      title: 'Unsubscribe Lead from All Campaigns',
      description: 'Unsubscribe a lead from all campaigns across the entire account.',
      inputSchema: UnsubscribeLeadFromAllCampaignsRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UnsubscribeLeadFromAllCampaignsRequestSchema.parse(params);
        const result = await client.unsubscribeLeadFromAllCampaigns(validatedParams.lead_id);
        return formatSuccessResponse(
          'Lead unsubscribed from all campaigns successfully',
          result,
          `Lead ID ${validatedParams.lead_id} unsubscribed from all campaigns`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Add Lead to Global Blocklist Tool
  server.registerTool(
    'smartlead_add_lead_to_global_blocklist',
    {
      title: 'Add Lead to Global Blocklist',
      description: 'Add a lead or domain to the global blocklist to prevent future contact.',
      inputSchema: AddLeadToGlobalBlocklistRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AddLeadToGlobalBlocklistRequestSchema.parse(params);
        const result = await client.addLeadToGlobalBlocklist(validatedParams.email);
        return formatSuccessResponse(
          'Lead added to global blocklist successfully',
          result,
          `Email ${validatedParams.email} added to global blocklist`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch All Leads from Account Tool
  server.registerTool(
    'smartlead_fetch_all_leads_from_account',
    {
      title: 'Fetch All Leads from Account',
      description:
        'Retrieve all leads from the entire account with optional filtering and pagination.',
      inputSchema: FetchAllLeadsFromAccountRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = FetchAllLeadsFromAccountRequestSchema.parse(params);
        const result = await client.fetchAllLeadsFromAccount(validatedParams);
        return formatSuccessResponse(
          'All leads retrieved successfully',
          result,
          `Found ${result.data?.leads?.length || 0} leads in account`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Leads from Global Blocklist Tool
  server.registerTool(
    'smartlead_fetch_leads_from_global_blocklist',
    {
      title: 'Fetch Leads from Global Blocklist',
      description: 'Retrieve all leads and domains currently on the global blocklist.',
      inputSchema: FetchLeadsFromGlobalBlocklistRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = FetchLeadsFromGlobalBlocklistRequestSchema.parse(params);
        const result = await client.fetchLeadsFromGlobalBlocklist(validatedParams);
        return formatSuccessResponse(
          'Global blocklist retrieved successfully',
          result,
          `Found ${result.data?.blocked_leads?.length || 0} entries in global blocklist`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Update Lead by ID Tool
  server.registerTool(
    'smartlead_update_lead_by_id',
    {
      title: 'Update Lead by ID',
      description:
        'Update lead information using the lead ID, including contact details and custom fields.',
      inputSchema: UpdateLeadByIdRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateLeadByIdRequestSchema.parse(params);
        const { lead_id, ...leadData } = validatedParams;
        const result = await client.updateLeadById(lead_id, leadData);
        return formatSuccessResponse(
          'Lead updated successfully',
          result,
          `Lead ID ${lead_id} updated successfully`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Update Lead Category Tool
  server.registerTool(
    'smartlead_update_lead_category',
    {
      title: 'Update Lead Category',
      description: 'Update the category classification of a lead within a specific campaign.',
      inputSchema: UpdateLeadCategoryRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateLeadCategoryRequestSchema.parse(params);
        const result = await client.updateLeadCategory(
          validatedParams.campaign_id,
          validatedParams.lead_id,
          validatedParams.category
        );
        return formatSuccessResponse(
          'Lead category updated successfully',
          result,
          `Lead ID ${validatedParams.lead_id} category changed to: ${validatedParams.category}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Lead Message History Tool
  server.registerTool(
    'smartlead_fetch_lead_message_history',
    {
      title: 'Fetch Lead Message History',
      description: 'Retrieve the complete message history for a lead within a specific campaign.',
      inputSchema: FetchLeadMessageHistoryRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = FetchLeadMessageHistoryRequestSchema.parse(params);
        const result = await client.fetchLeadMessageHistory(
          validatedParams.campaign_id,
          validatedParams.lead_id
        );
        return formatSuccessResponse(
          'Lead message history retrieved successfully',
          result,
          `Retrieved message history for lead ID ${validatedParams.lead_id} in campaign ID: ${validatedParams.campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Reply to Lead from Master Inbox Tool
  server.registerTool(
    'smartlead_reply_to_lead_from_master_inbox',
    {
      title: 'Reply to Lead from Master Inbox',
      description:
        'Send a reply to a lead from the master inbox with tracking and personalization.',
      inputSchema: ReplyToLeadFromMasterInboxRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ReplyToLeadFromMasterInboxRequestSchema.parse(params);
        const { campaign_id, lead_id, ...messageData } = validatedParams;
        const result = await client.replyToLeadFromMasterInbox(campaign_id, lead_id, messageData);
        return formatSuccessResponse(
          'Reply sent successfully from master inbox',
          result,
          `Reply sent to lead ID ${lead_id} in campaign ID: ${campaign_id}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Forward Reply Tool
  server.registerTool(
    'smartlead_forward_reply',
    {
      title: 'Forward Reply',
      description: 'Forward a lead reply to another email address or team member.',
      inputSchema: ForwardReplyRequestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ForwardReplyRequestSchema.parse(params);
        const { campaign_id, lead_id, ...forwardData } = validatedParams;
        const result = await client.forwardReply(campaign_id, lead_id, forwardData);
        return formatSuccessResponse(
          'Reply forwarded successfully',
          result,
          `Reply from lead ID ${lead_id} forwarded successfully`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
