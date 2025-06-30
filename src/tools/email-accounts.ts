/**
 * SmartLead MCP Server - Email Account Management Tools
 *
 * MCP tools for email account management API endpoints.
 * Provides tools for managing email accounts, warmup settings, and campaign assignments.
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

const ListEmailAccountsPerCampaignSchema = z.object({
  campaign_id: z.number().int().positive(),
});

const AddEmailAccountToCampaignSchema = z.object({
  campaign_id: z.number().int().positive(),
  email_account_id: z.number().int().positive(),
});

const RemoveEmailAccountFromCampaignSchema = z.object({
  campaign_id: z.number().int().positive(),
  email_account_id: z.number().int().positive(),
});

const CreateEmailAccountSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  smtp_host: z.string(),
  smtp_port: z.number().int().positive(),
  imap_host: z.string(),
  imap_port: z.number().int().positive(),
  name: z.string().optional(),
});

const UpdateEmailAccountSchema = z.object({
  email_account_id: z.number().int().positive(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  smtp_host: z.string().optional(),
  smtp_port: z.number().int().positive().optional(),
  imap_host: z.string().optional(),
  imap_port: z.number().int().positive().optional(),
  name: z.string().optional(),
});

const GetEmailAccountByIdSchema = z.object({
  email_account_id: z.number().int().positive(),
});

const UpdateEmailAccountWarmupSchema = z.object({
  email_account_id: z.number().int().positive(),
  warmup_enabled: z.boolean(),
  warmup_reputation: z.number().min(0).max(100).optional(),
  daily_ramp_up: z.number().int().positive().optional(),
  reply_rate_percentage: z.number().min(0).max(100).optional(),
});

const ReconnectFailedEmailAccountsSchema = z.object({
  email_account_ids: z.array(z.number().int().positive()),
});

const UpdateEmailAccountTagSchema = z.object({
  email_account_id: z.number().int().positive(),
  tag: z.string(),
});

// ================================
// TOOL REGISTRATION
// ================================

/**
 * Register email account management tools with the MCP server
 */
export function registerEmailAccountTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data?: unknown, summary?: string) => MCPToolResponse,
  handleError: (error: unknown) => MCPToolResponse
): void {
  // List all email accounts per campaign
  server.registerTool(
    'smartlead_list_email_accounts_per_campaign',
    {
      title: 'List Email Accounts per Campaign',
      description: 'Retrieve all email accounts associated with a specific campaign.',
      inputSchema: ListEmailAccountsPerCampaignSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ListEmailAccountsPerCampaignSchema.parse(params);
        const result = await client.emailAccounts.listEmailAccountsPerCampaign(
          validatedParams.campaign_id
        );
        return formatSuccessResponse(
          `Retrieved email accounts for campaign ${validatedParams.campaign_id}`,
          result,
          `Found ${result.length || 0} email accounts`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Add Email Account to a Campaign
  server.registerTool(
    'smartlead_add_email_account_to_campaign',
    {
      title: 'Add Email Account to Campaign',
      description: 'Add an email account to a specific campaign for sending emails.',
      inputSchema: AddEmailAccountToCampaignSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = AddEmailAccountToCampaignSchema.parse(params);
        const result = await client.emailAccounts.addEmailAccountToCampaign(
          validatedParams.campaign_id,
          { email_account_id: validatedParams.email_account_id }
        );
        return formatSuccessResponse(
          `Added email account ${validatedParams.email_account_id} to campaign ${validatedParams.campaign_id}`,
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Remove Email Account from a Campaign
  server.registerTool(
    'smartlead_remove_email_account_from_campaign',
    {
      title: 'Remove Email Account from Campaign',
      description: 'Remove an email account from a specific campaign.',
      inputSchema: RemoveEmailAccountFromCampaignSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = RemoveEmailAccountFromCampaignSchema.parse(params);
        const result = await client.emailAccounts.removeEmailAccountFromCampaign(
          validatedParams.campaign_id,
          validatedParams.email_account_id
        );
        return formatSuccessResponse(
          `Removed email account ${validatedParams.email_account_id} from campaign ${validatedParams.campaign_id}`,
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch all email accounts associated to a user
  server.registerTool(
    'smartlead_get_all_email_accounts',
    {
      title: 'Get All Email Accounts',
      description: 'Retrieve all email accounts associated with the current user.',
      inputSchema: z.object({}).shape,
    },
    async (params) => {
      try {
        const result = await client.emailAccounts.getAllEmailAccounts();
        return formatSuccessResponse(
          'Retrieved all email accounts',
          result,
          `Found ${result.length || 0} email accounts`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Create an Email Account
  server.registerTool(
    'smartlead_create_email_account',
    {
      title: 'Create Email Account',
      description: 'Create a new email account with SMTP and IMAP configuration.',
      inputSchema: CreateEmailAccountSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = CreateEmailAccountSchema.parse(params);
        const result = await client.emailAccounts.createEmailAccount(validatedParams);
        return formatSuccessResponse(
          `Created email account for ${validatedParams.email}`,
          result,
          `Email account ID: ${result.id || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Update Email Account
  server.registerTool(
    'smartlead_update_email_account',
    {
      title: 'Update Email Account',
      description: 'Update an existing email account configuration.',
      inputSchema: UpdateEmailAccountSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateEmailAccountSchema.parse(params);
        const { email_account_id, ...updateParams } = validatedParams;
        const result = await client.emailAccounts.updateEmailAccount(
          email_account_id,
          updateParams
        );
        return formatSuccessResponse(`Updated email account ${email_account_id}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Fetch Email Account By ID
  server.registerTool(
    'smartlead_get_email_account_by_id',
    {
      title: 'Get Email Account by ID',
      description: 'Retrieve detailed information about a specific email account.',
      inputSchema: GetEmailAccountByIdSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetEmailAccountByIdSchema.parse(params);
        const result = await client.emailAccounts.getEmailAccountById(
          validatedParams.email_account_id
        );
        return formatSuccessResponse(
          `Retrieved email account ${validatedParams.email_account_id}`,
          result,
          `Email: ${result.email || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Add/Update Warmup To Email Account
  server.registerTool(
    'smartlead_update_email_account_warmup',
    {
      title: 'Update Email Account Warmup',
      description: 'Configure warmup settings for an email account to improve deliverability.',
      inputSchema: UpdateEmailAccountWarmupSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateEmailAccountWarmupSchema.parse(params);
        const { email_account_id, ...warmupParams } = validatedParams;
        const result = await client.emailAccounts.updateEmailAccountWarmup(
          email_account_id,
          warmupParams
        );
        return formatSuccessResponse(
          `Updated warmup settings for email account ${email_account_id}`,
          result,
          `Warmup enabled: ${warmupParams.warmup_enabled}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Reconnect failed email accounts
  server.registerTool(
    'smartlead_reconnect_failed_email_accounts',
    {
      title: 'Reconnect Failed Email Accounts',
      description: 'Attempt to reconnect email accounts that have failed authentication.',
      inputSchema: ReconnectFailedEmailAccountsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ReconnectFailedEmailAccountsSchema.parse(params);
        const result = await client.emailAccounts.reconnectFailedEmailAccounts(validatedParams);
        return formatSuccessResponse(
          `Attempted to reconnect ${validatedParams.email_account_ids.length} email accounts`,
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Update Email Account Tag
  server.registerTool(
    'smartlead_update_email_account_tag',
    {
      title: 'Update Email Account Tag',
      description: 'Update the tag/label for an email account for better organization.',
      inputSchema: UpdateEmailAccountTagSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = UpdateEmailAccountTagSchema.parse(params);
        const { email_account_id, tag } = validatedParams;
        const result = await client.emailAccounts.updateEmailAccountTag(email_account_id, { tag });
        return formatSuccessResponse(
          `Updated tag for email account ${email_account_id}`,
          result,
          `New tag: ${tag}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
