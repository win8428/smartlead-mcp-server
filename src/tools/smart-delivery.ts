/**
 * SmartLead MCP Server - Smart Delivery Tools
 *
 * MCP tools for smart delivery API endpoints.
 * Provides tools for placement tests, spam analysis, and delivery optimization.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SmartLeadClient } from '../client/index.js';
import type { MCPToolResponse } from '../types/config.js';
import { z } from 'zod';

// ================================
// SCHEMAS
// ================================

const CreateManualPlacementTestSchema = z.object({
  test_name: z.string(),
  email_content: z.string(),
  subject: z.string(),
  from_email: z.string().email(),
  to_emails: z.array(z.string().email()),
});

const CreateAutomatedPlacementTestSchema = z.object({
  test_name: z.string(),
  email_content: z.string(),
  subject: z.string(),
  from_email: z.string().email(),
  schedule: z.object({
    frequency: z.string(),
    time: z.string(),
  }),
});

const GetSpamTestDetailsSchema = z.object({
  test_id: z.number().int().positive(),
});

const DeleteTestsInBulkSchema = z.object({
  test_ids: z.array(z.number().int().positive()),
});

const StopAutomatedTestSchema = z.object({
  test_id: z.number().int().positive(),
});

const ListAllTestsSchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  status: z.string().optional(),
});

const GetProviderWiseReportSchema = z.object({
  test_id: z.number().int().positive(),
  date_range: z
    .object({
      start_date: z.string(),
      end_date: z.string(),
    })
    .optional(),
});

const GetGeoWiseReportSchema = z.object({
  test_id: z.number().int().positive(),
  date_range: z
    .object({
      start_date: z.string(),
      end_date: z.string(),
    })
    .optional(),
});

const GetSenderAccountWiseReportSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetSpamFilterReportSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetDkimDetailsSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetSpfDetailsSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetRdnsReportSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetSenderAccountListSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetBlacklistsSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetDomainBlacklistSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetSpamTestEmailContentSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetIpBlacklistCountSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetEmailReplyHeadersSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetScheduleHistorySchema = z.object({
  test_id: z.number().int().positive(),
});

const GetIpDetailsSchema = z.object({
  test_id: z.number().int().positive(),
});

const GetMailboxSummarySchema = z.object({
  test_id: z.number().int().positive(),
});

const GetMailboxCountSchema = z.object({
  test_id: z.number().int().positive(),
});

const CreateFolderSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const GetFolderByIdSchema = z.object({
  folder_id: z.number().int().positive(),
});

const DeleteFolderSchema = z.object({
  folder_id: z.number().int().positive(),
});

// ================================
// TOOL REGISTRATION
// ================================

/**
 * Register smart delivery tools with the MCP server
 */
export function registerSmartDeliveryTools(
  server: McpServer,
  client: SmartLeadClient,
  formatSuccessResponse: (message: string, data?: unknown, summary?: string) => MCPToolResponse,
  handleError: (error: unknown) => MCPToolResponse
): void {
  // Region wise Provider IDs
  server.registerTool(
    'smartlead_get_region_wise_provider_ids',
    {
      title: 'Get Region Wise Provider IDs',
      description:
        'Retrieve provider IDs organized by geographic regions for smart delivery optimization.',
      inputSchema: z.object({}).shape,
    },
    async (params) => {
      try {
        const result = await client.smartDelivery.getRegionWiseProviderIds();
        return formatSuccessResponse(
          'Retrieved region wise provider IDs',
          result,
          `Provider mapping available for delivery optimization`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Create a Manual Placement Test
  server.registerTool(
    'smartlead_create_manual_placement_test',
    {
      title: 'Create Manual Placement Test',
      description:
        'Create a manual placement test to check email deliverability across different providers.',
      inputSchema: CreateManualPlacementTestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = CreateManualPlacementTestSchema.parse(params);
        const result = await client.smartDelivery.createManualPlacementTest(validatedParams);
        return formatSuccessResponse(
          `Created manual placement test: ${validatedParams.test_name}`,
          result,
          `Testing ${validatedParams.to_emails.length} email addresses`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Create an Automated Placement Test
  server.registerTool(
    'smartlead_create_automated_placement_test',
    {
      title: 'Create Automated Placement Test',
      description:
        'Create an automated placement test that runs on a schedule for continuous monitoring.',
      inputSchema: CreateAutomatedPlacementTestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = CreateAutomatedPlacementTestSchema.parse(params);
        const result = await client.smartDelivery.createAutomatedPlacementTest(validatedParams);
        return formatSuccessResponse(
          `Created automated placement test: ${validatedParams.test_name}`,
          result,
          `Scheduled: ${validatedParams.schedule.frequency} at ${validatedParams.schedule.time}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Spam Test Details
  server.registerTool(
    'smartlead_get_spam_test_details',
    {
      title: 'Get Spam Test Details',
      description: 'Retrieve detailed results and analysis for a specific spam test.',
      inputSchema: GetSpamTestDetailsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetSpamTestDetailsSchema.parse(params);
        const result = await client.smartDelivery.getSpamTestDetails(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved spam test details for test ${validatedParams.test_id}`,
          result,
          `Spam analysis results available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Delete Smart Delivery Tests in Bulk
  server.registerTool(
    'smartlead_delete_tests_in_bulk',
    {
      title: 'Delete Tests in Bulk',
      description: 'Delete multiple smart delivery tests at once for cleanup purposes.',
      inputSchema: DeleteTestsInBulkSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = DeleteTestsInBulkSchema.parse(params);
        const result = await client.smartDelivery.deleteTestsInBulk(validatedParams);
        return formatSuccessResponse(
          `Deleted ${validatedParams.test_ids.length} tests in bulk`,
          result
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Stop an Automated Smart Delivery Test
  server.registerTool(
    'smartlead_stop_automated_test',
    {
      title: 'Stop Automated Test',
      description: 'Stop a running automated placement test.',
      inputSchema: StopAutomatedTestSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = StopAutomatedTestSchema.parse(params);
        const result = await client.smartDelivery.stopAutomatedTest(validatedParams.test_id);
        return formatSuccessResponse(`Stopped automated test ${validatedParams.test_id}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // List all Tests
  server.registerTool(
    'smartlead_list_all_tests',
    {
      title: 'List All Tests',
      description: 'Retrieve a list of all smart delivery tests with optional filtering.',
      inputSchema: ListAllTestsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = ListAllTestsSchema.parse(params);
        const result = await client.smartDelivery.listAllTests(validatedParams);
        return formatSuccessResponse(
          'Retrieved all smart delivery tests',
          result,
          `Page ${validatedParams.page || 1}, Status: ${validatedParams.status || 'all'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Provider wise report
  server.registerTool(
    'smartlead_get_provider_wise_report',
    {
      title: 'Get Provider Wise Report',
      description:
        'Retrieve a detailed report showing performance across different email providers.',
      inputSchema: GetProviderWiseReportSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetProviderWiseReportSchema.parse(params);
        const result = await client.smartDelivery.getProviderWiseReport(validatedParams);
        return formatSuccessResponse(
          `Retrieved provider wise report for test ${validatedParams.test_id}`,
          result,
          `Performance analysis by email provider`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Geo wise report
  server.registerTool(
    'smartlead_get_geo_wise_report',
    {
      title: 'Get Geo Wise Report',
      description:
        'Retrieve a detailed report showing performance across different geographic regions.',
      inputSchema: GetGeoWiseReportSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetGeoWiseReportSchema.parse(params);
        const result = await client.smartDelivery.getGeoWiseReport(validatedParams);
        return formatSuccessResponse(
          `Retrieved geo wise report for test ${validatedParams.test_id}`,
          result,
          `Performance analysis by geographic region`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Sender Account wise report
  server.registerTool(
    'smartlead_get_sender_account_wise_report',
    {
      title: 'Get Sender Account Wise Report',
      description: 'Retrieve a detailed report showing performance for different sender accounts.',
      inputSchema: GetSenderAccountWiseReportSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetSenderAccountWiseReportSchema.parse(params);
        const result = await client.smartDelivery.getSenderAccountWiseReport(
          validatedParams.test_id
        );
        return formatSuccessResponse(
          `Retrieved sender account wise report for test ${validatedParams.test_id}`,
          result,
          `Performance analysis by sender account`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Spam filter report
  server.registerTool(
    'smartlead_get_spam_filter_report',
    {
      title: 'Get Spam Filter Report',
      description: 'Retrieve a detailed spam filter analysis report for a test.',
      inputSchema: GetSpamFilterReportSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetSpamFilterReportSchema.parse(params);
        const result = await client.smartDelivery.getSpamFilterReport(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved spam filter report for test ${validatedParams.test_id}`,
          result,
          `Spam filter analysis available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // DKIM Details
  server.registerTool(
    'smartlead_get_dkim_details',
    {
      title: 'Get DKIM Details',
      description: 'Retrieve DKIM authentication details for a specific test.',
      inputSchema: GetDkimDetailsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetDkimDetailsSchema.parse(params);
        const result = await client.smartDelivery.getDkimDetails(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved DKIM details for test ${validatedParams.test_id}`,
          result,
          `DKIM authentication analysis available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // SPF Details
  server.registerTool(
    'smartlead_get_spf_details',
    {
      title: 'Get SPF Details',
      description: 'Retrieve SPF record details for a specific test.',
      inputSchema: GetSpfDetailsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetSpfDetailsSchema.parse(params);
        const result = await client.smartDelivery.getSpfDetails(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved SPF details for test ${validatedParams.test_id}`,
          result,
          `SPF record analysis available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // rDNS report
  server.registerTool(
    'smartlead_get_rdns_report',
    {
      title: 'Get rDNS Report',
      description: 'Retrieve reverse DNS lookup report for a specific test.',
      inputSchema: GetRdnsReportSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetRdnsReportSchema.parse(params);
        const result = await client.smartDelivery.getRdnsReport(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved rDNS report for test ${validatedParams.test_id}`,
          result,
          `Reverse DNS analysis available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Sender Account List
  server.registerTool(
    'smartlead_get_sender_account_list',
    {
      title: 'Get Sender Account List',
      description: 'Retrieve list of sender accounts used in a specific test.',
      inputSchema: GetSenderAccountListSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetSenderAccountListSchema.parse(params);
        const result = await client.smartDelivery.getSenderAccountList(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved sender account list for test ${validatedParams.test_id}`,
          result,
          `Sender account information available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Blacklists
  server.registerTool(
    'smartlead_get_blacklists',
    {
      title: 'Get Blacklists',
      description: 'Retrieve blacklist status for a specific test.',
      inputSchema: GetBlacklistsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetBlacklistsSchema.parse(params);
        const result = await client.smartDelivery.getBlacklists(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved blacklist status for test ${validatedParams.test_id}`,
          result,
          `Blacklist analysis available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Domain Blacklist
  server.registerTool(
    'smartlead_get_domain_blacklist',
    {
      title: 'Get Domain Blacklist',
      description: 'Retrieve domain blacklist status for a specific test.',
      inputSchema: GetDomainBlacklistSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetDomainBlacklistSchema.parse(params);
        const result = await client.smartDelivery.getDomainBlacklist(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved domain blacklist status for test ${validatedParams.test_id}`,
          result,
          `Domain blacklist analysis available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Spam Test Email Content
  server.registerTool(
    'smartlead_get_spam_test_email_content',
    {
      title: 'Get Spam Test Email Content',
      description: 'Retrieve the email content used in a specific spam test.',
      inputSchema: GetSpamTestEmailContentSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetSpamTestEmailContentSchema.parse(params);
        const result = await client.smartDelivery.getSpamTestEmailContent(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved email content for test ${validatedParams.test_id}`,
          result,
          `Test email content available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // IP Blacklist Count
  server.registerTool(
    'smartlead_get_ip_blacklist_count',
    {
      title: 'Get IP Blacklist Count',
      description: 'Retrieve IP blacklist count for a specific test.',
      inputSchema: GetIpBlacklistCountSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetIpBlacklistCountSchema.parse(params);
        const result = await client.smartDelivery.getIpBlacklistCount(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved IP blacklist count for test ${validatedParams.test_id}`,
          result,
          `IP blacklist count available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Email Reply Headers
  server.registerTool(
    'smartlead_get_email_reply_headers',
    {
      title: 'Get Email Reply Headers',
      description: 'Retrieve email reply headers for a specific test.',
      inputSchema: GetEmailReplyHeadersSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetEmailReplyHeadersSchema.parse(params);
        const result = await client.smartDelivery.getEmailReplyHeaders(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved email reply headers for test ${validatedParams.test_id}`,
          result,
          `Email headers analysis available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Schedule History
  server.registerTool(
    'smartlead_get_schedule_history',
    {
      title: 'Get Schedule History',
      description: 'Retrieve schedule history for automated tests.',
      inputSchema: GetScheduleHistorySchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetScheduleHistorySchema.parse(params);
        const result = await client.smartDelivery.getScheduleHistory(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved schedule history for test ${validatedParams.test_id}`,
          result,
          `Schedule history available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // IP Details
  server.registerTool(
    'smartlead_get_ip_details',
    {
      title: 'Get IP Details',
      description: 'Retrieve IP address details for a specific test.',
      inputSchema: GetIpDetailsSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetIpDetailsSchema.parse(params);
        const result = await client.smartDelivery.getIpDetails(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved IP details for test ${validatedParams.test_id}`,
          result,
          `IP address information available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Mailbox Summary
  server.registerTool(
    'smartlead_get_mailbox_summary',
    {
      title: 'Get Mailbox Summary',
      description: 'Retrieve mailbox summary for a specific test.',
      inputSchema: GetMailboxSummarySchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetMailboxSummarySchema.parse(params);
        const result = await client.smartDelivery.getMailboxSummary(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved mailbox summary for test ${validatedParams.test_id}`,
          result,
          `Mailbox summary available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Mailbox Count
  server.registerTool(
    'smartlead_get_mailbox_count',
    {
      title: 'Get Mailbox Count',
      description: 'Retrieve mailbox count for a specific test.',
      inputSchema: GetMailboxCountSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetMailboxCountSchema.parse(params);
        const result = await client.smartDelivery.getMailboxCount(validatedParams.test_id);
        return formatSuccessResponse(
          `Retrieved mailbox count for test ${validatedParams.test_id}`,
          result,
          `Mailbox count available`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get All Folders
  server.registerTool(
    'smartlead_get_all_folders',
    {
      title: 'Get All Folders',
      description: 'Retrieve all smart delivery folders.',
      inputSchema: z.object({}).shape,
    },
    async (params) => {
      try {
        const result = await client.smartDelivery.getAllFolders();
        return formatSuccessResponse(
          'Retrieved all smart delivery folders',
          result,
          `Found ${result.length || 0} folders`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Create Folder
  server.registerTool(
    'smartlead_create_folder',
    {
      title: 'Create Folder',
      description: 'Create a new smart delivery folder.',
      inputSchema: CreateFolderSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = CreateFolderSchema.parse(params);
        const result = await client.smartDelivery.createFolder(validatedParams);
        return formatSuccessResponse(
          `Created folder: ${validatedParams.name}`,
          result,
          `Folder ID: ${result.id || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Get Folder by ID
  server.registerTool(
    'smartlead_get_folder_by_id',
    {
      title: 'Get Folder by ID',
      description: 'Retrieve a specific smart delivery folder by ID.',
      inputSchema: GetFolderByIdSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = GetFolderByIdSchema.parse(params);
        const result = await client.smartDelivery.getFolderById(validatedParams.folder_id);
        return formatSuccessResponse(
          `Retrieved folder ${validatedParams.folder_id}`,
          result,
          `Folder: ${result.name || 'N/A'}`
        );
      } catch (error) {
        return handleError(error);
      }
    }
  );

  // Delete Folder
  server.registerTool(
    'smartlead_delete_folder',
    {
      title: 'Delete Folder',
      description: 'Delete a smart delivery folder by ID.',
      inputSchema: DeleteFolderSchema.shape,
    },
    async (params) => {
      try {
        const validatedParams = DeleteFolderSchema.parse(params);
        const result = await client.smartDelivery.deleteFolder(validatedParams.folder_id);
        return formatSuccessResponse(`Deleted folder ${validatedParams.folder_id}`, result);
      } catch (error) {
        return handleError(error);
      }
    }
  );
}
