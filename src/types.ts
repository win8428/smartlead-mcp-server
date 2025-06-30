/**
 * SmartLead MCP Server - Type Definitions
 * 
 * Comprehensive TypeScript type definitions and Zod schemas for all SmartLead API endpoints.
 * This file provides type safety, runtime validation, and documentation for the entire API surface.
 * 
 * API Coverage:
 * - Campaign management (13 endpoints)
 * - Lead management (8 endpoints)
 * - Statistics and analytics (6 endpoints)
 * - Smart delivery (4 endpoints)
 * - Webhooks (3 endpoints)
 * - Client management (4 endpoints)
 * - Smart senders (5 endpoints)
 * 
 * @author LeadMagic Team
 * @version 1.0.0
 */

import { z } from 'zod';

// ================================
// CORE CONFIGURATION TYPES
// ================================

/**
 * Configuration interface for SmartLead API client
 */
export interface SmartLeadConfig {
  /** SmartLead API key (required) */
  apiKey: string;
  /** Custom API base URL (optional, defaults to https://server.smartlead.ai/api/v1) */
  baseUrl?: string;
  /** Request timeout in milliseconds (optional, defaults to 30000) */
  timeout?: number;
  /** Maximum retry attempts (optional, defaults to 3) */
  maxRetries?: number;
  /** Initial retry delay in milliseconds (optional, defaults to 1000) */
  retryDelay?: number;
  /** Rate limit in requests per minute (optional, defaults to 100) */
  rateLimit?: number;
}

// ================================
// COMMON RESPONSE SCHEMAS
// ================================

/**
 * Schema for API error responses
 */
export const ErrorSchema = z.object({
  /** Error code identifier */
  error: z.string(),
  /** Human-readable error message */
  message: z.string(),
  /** HTTP status code */
  status: z.number().optional(),
});

/**
 * Schema for successful API responses
 */
export const SuccessResponseSchema = z.object({
  /** Success indicator */
  success: z.boolean(),
  /** Response message */
  message: z.string().optional(),
  /** Response data */
  data: z.unknown().optional(),
});

// ================================
// CAMPAIGN MANAGEMENT SCHEMAS
// ================================

/**
 * Request schema for creating a campaign
 */
export const CreateCampaignRequestSchema = z.object({
  /** Campaign name */
  name: z.string(),
  /** Client ID for the campaign */
  client_id: z.number().optional(),
});

/**
 * Request schema for updating campaign schedule
 */
export const UpdateCampaignScheduleRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Timezone for the campaign */
  timezone: z.string().optional(),
  /** Days of the week to send emails (1-7, where 1 is Monday) */
  days_of_the_week: z.array(z.number().min(1).max(7)).optional(),
  /** Start hour in 24-hour format */
  start_hour: z.string().optional(),
  /** End hour in 24-hour format */
  end_hour: z.string().optional(),
  /** Minimum time between emails in minutes */
  min_time_btw_emails: z.number().optional(),
  /** Maximum number of new leads per day */
  max_new_leads_per_day: z.number().optional(),
  /** Schedule start time in ISO format */
  schedule_start_time: z.string().optional(),
});

/**
 * Request schema for updating campaign settings
 */
export const UpdateCampaignSettingsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** New campaign name */
  name: z.string().optional(),
  /** Campaign status */
  status: z.enum(['active', 'paused', 'completed']).optional(),
  /** Additional campaign settings */
  settings: z.record(z.unknown()).optional(),
});

/**
 * Request schema for updating campaign status
 */
export const UpdateCampaignStatusRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** New campaign status */
  status: z.enum(['PAUSED', 'STOPPED', 'START']),
});

/**
 * Request schema for getting a campaign
 */
export const GetCampaignRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
});

/**
 * Request schema for listing campaigns
 */
export const ListCampaignsRequestSchema = z.object({
  /** Filter by status */
  status: z.enum(['active', 'paused', 'completed']).optional(),
  /** Maximum number of campaigns to return */
  limit: z.number().optional(),
  /** Offset for pagination */
  offset: z.number().optional(),
});

// ================================
// EMAIL SEQUENCE SCHEMAS
// ================================

/**
 * Schema for email sequence variant
 */
export const SequenceVariantSchema = z.object({
  /** Email subject line */
  subject: z.string(),
  /** Email body content in HTML */
  email_body: z.string(),
  /** Variant label (A, B, C, etc.) */
  variant_label: z.string(),
  /** Percentage of leads to receive this variant */
  variant_distribution_percentage: z.number().optional(),
});

/**
 * Schema for sequence delay details
 */
export const SequenceDelaySchema = z.object({
  /** Days to wait before sending this email */
  delay_in_days: z.number(),
});

/**
 * Schema for email sequence
 */
export const EmailSequenceSchema = z.object({
  /** Sequence number (order) */
  seq_number: z.number(),
  /** Delay details for this sequence */
  seq_delay_details: SequenceDelaySchema,
  /** How to distribute variants */
  variant_distribution_type: z.enum(['MANUAL_EQUAL', 'MANUAL_PERCENTAGE', 'AI_EQUAL']),
  /** Sample percentage for AI testing */
  lead_distribution_percentage: z.number().optional(),
  /** Metric for determining winner */
  winning_metric_property: z.enum(['OPEN_RATE', 'CLICK_RATE', 'REPLY_RATE', 'POSITIVE_REPLY_RATE']).optional(),
  /** Email variants */
  seq_variants: z.array(SequenceVariantSchema),
});

/**
 * Request schema for saving campaign sequence
 */
export const SaveCampaignSequenceRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Email sequence array */
  sequence: z.array(EmailSequenceSchema),
});

// ================================
// LEAD MANAGEMENT SCHEMAS
// ================================

/**
 * Schema for lead information
 */
export const LeadSchema = z.object({
  /** Lead ID */
  id: z.number().optional(),
  /** First name */
  first_name: z.string().optional(),
  /** Last name */
  last_name: z.string().optional(),
  /** Email address */
  email: z.string().email().optional(),
  /** Company name */
  company_name: z.string().optional(),
  /** Job title */
  job_title: z.string().optional(),
  /** Phone number */
  phone: z.string().optional(),
  /** LinkedIn URL */
  linkedin_url: z.string().optional(),
  /** Custom fields */
  custom_fields: z.record(z.unknown()).optional(),
});

/**
 * Request schema for listing leads
 */
export const ListLeadsRequestSchema = z.object({
  /** Filter leads by campaign ID */
  campaign_id: z.number().optional(),
  /** Filter leads by status */
  status: z.string().optional(),
  /** Maximum number of leads to return */
  limit: z.number().optional(),
  /** Offset for pagination */
  offset: z.number().optional(),
  /** Search term to filter leads */
  search: z.string().optional(),
  /** Filter leads created after this date */
  start_date: z.string().optional(),
  /** Filter leads created before this date */
  end_date: z.string().optional(),
});

/**
 * Request schema for getting a lead
 */
export const GetLeadRequestSchema = z.object({
  /** Lead ID */
  lead_id: z.number(),
});

/**
 * Request schema for adding a lead to campaign
 */
export const AddLeadToCampaignRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Email address */
  email: z.string().email(),
  /** First name */
  first_name: z.string().optional(),
  /** Last name */
  last_name: z.string().optional(),
  /** Company */
  company: z.string().optional(),
  /** Job title */
  title: z.string().optional(),
  /** Phone number */
  phone: z.string().optional(),
  /** Custom fields */
  custom_fields: z.record(z.unknown()).optional(),
});

/**
 * Request schema for updating a lead
 */
export const UpdateLeadRequestSchema = z.object({
  /** Lead ID */
  lead_id: z.number(),
  /** Email address */
  email: z.string().email().optional(),
  /** First name */
  first_name: z.string().optional(),
  /** Last name */
  last_name: z.string().optional(),
  /** Company */
  company: z.string().optional(),
  /** Job title */
  title: z.string().optional(),
  /** Phone number */
  phone: z.string().optional(),
  /** Custom fields */
  custom_fields: z.record(z.unknown()).optional(),
});

/**
 * Request schema for updating lead status
 */
export const UpdateLeadStatusRequestSchema = z.object({
  /** Lead ID */
  lead_id: z.number(),
  /** New status */
  status: z.string(),
});

/**
 * Request schema for bulk importing leads
 */
export const BulkImportLeadsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Array of leads to import */
  leads: z.array(z.object({
    /** Email address */
    email: z.string().email(),
    /** First name */
    first_name: z.string().optional(),
    /** Last name */
    last_name: z.string().optional(),
    /** Company */
    company: z.string().optional(),
    /** Job title */
    title: z.string().optional(),
    /** Phone number */
    phone: z.string().optional(),
    /** Custom fields */
    custom_fields: z.record(z.unknown()).optional(),
  })),
});

/**
 * Request schema for deleting a lead
 */
export const DeleteLeadRequestSchema = z.object({
  /** Lead ID */
  lead_id: z.number(),
});

// ================================
// ANALYTICS SCHEMAS
// ================================

/**
 * Request schema for campaign analytics by date
 */
export const CampaignAnalyticsByDateRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Start date in YYYY-MM-DD format */
  start_date: z.string(),
  /** End date in YYYY-MM-DD format */
  end_date: z.string(),
});

/**
 * Request schema for campaign sequence analytics
 */
export const CampaignSequenceAnalyticsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Start date in YYYY-MM-DD HH:MM:SS format */
  start_date: z.string(),
  /** End date in YYYY-MM-DD HH:MM:SS format */
  end_date: z.string(),
  /** Timezone for analytics */
  time_zone: z.string().optional(),
});

/**
 * Request schema for campaign statistics
 */
export const CampaignStatisticsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Offset for pagination */
  offset: z.number().optional(),
  /** Maximum number of statistics to return */
  limit: z.number().optional(),
  /** Email sequence number to filter by */
  email_sequence_number: z.string().optional(),
  /** Email status to filter by */
  email_status: z.string().optional(),
  /** Filter by sent time greater than this date */
  sent_time_start_date: z.string().optional(),
  /** Filter by sent time less than this date */
  sent_time_end_date: z.string().optional(),
});

/**
 * Request schema for warmup stats by email
 */
export const WarmupStatsByEmailRequestSchema = z.object({
  /** Email account ID */
  email_account_id: z.number(),
});

/**
 * Request schema for campaign top level analytics
 */
export const CampaignTopLevelAnalyticsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
});

/**
 * Request schema for campaign lead statistics
 */
export const CampaignLeadStatisticsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Maximum number of leads to return */
  limit: z.number().optional(),
  /** Filter by leads created after this date */
  created_at_gt: z.string().optional(),
  /** Filter by events after this date */
  event_time_gt: z.string().optional(),
  /** Offset for pagination */
  offset: z.number().optional(),
});

/**
 * Request schema for campaign mailbox statistics
 */
export const CampaignMailboxStatisticsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Client ID if campaign is client-specific */
  client_id: z.string().optional(),
  /** Offset for pagination */
  offset: z.number().optional(),
  /** Maximum number of results to return */
  limit: z.number().optional(),
  /** Start date */
  start_date: z.string().optional(),
  /** End date */
  end_date: z.string().optional(),
  /** Timezone for the data */
  timezone: z.string().optional(),
});

/**
 * Request schema for downloading campaign data
 */
export const DownloadCampaignDataRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.number(),
  /** Type of data to download */
  download_type: z.enum(['analytics', 'leads', 'sequence', 'full_export']),
  /** Format of downloaded data */
  format: z.enum(['json', 'csv']),
  /** Optional user identifier */
  user_id: z.string().optional(),
});

/**
 * Request schema for viewing download statistics
 */
export const ViewDownloadStatisticsRequestSchema = z.object({
  /** Time period to filter by */
  time_period: z.enum(['all', 'today', 'week', 'month']).optional(),
  /** How to group the statistics */
  group_by: z.enum(['type', 'format', 'campaign', 'date']).optional(),
});

// ================================
// WEBHOOK SCHEMAS
// ================================

/**
 * Webhook event types enum
 */
export const WebhookEventType = z.enum([
  'LEAD_REPLIED',
  'LEAD_OPENED',
  'LEAD_CLICKED',
  'LEAD_BOUNCED',
  'LEAD_UNSUBSCRIBED',
  'LEAD_INTERESTED',
  'LEAD_NOT_INTERESTED',
  'LEAD_MEETING_BOOKED',
  'LEAD_MEETING_COMPLETED',
  'LEAD_DNC_GLOBAL',
  'LEAD_DNC_CAMPAIGN',
  'LEAD_FINISHED',
]);

/**
 * Request schema for fetching webhooks by campaign
 */
export const FetchWebhooksByCampaignRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.string(),
});

/**
 * Request schema for upserting campaign webhook
 */
export const UpsertCampaignWebhookRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.string(),
  /** Webhook ID (null for new webhook) */
  id: z.number().nullable().optional(),
  /** Webhook name */
  name: z.string(),
  /** Webhook URL */
  webhook_url: z.string().url(),
  /** Event types to trigger webhook */
  event_types: z.array(WebhookEventType),
  /** Categories for filtering */
  categories: z.array(z.string()).optional(),
});

/**
 * Request schema for deleting campaign webhook
 */
export const DeleteCampaignWebhookRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.string(),
  /** Webhook ID */
  id: z.number(),
});

/**
 * Request schema for webhook publish summary
 */
export const WebhookPublishSummaryRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.string(),
  /** Start time in ISO format */
  fromTime: z.string().optional(),
  /** End time in ISO format */
  toTime: z.string().optional(),
});

/**
 * Request schema for retriggering failed events
 */
export const RetriggerFailedEventsRequestSchema = z.object({
  /** Campaign ID */
  campaign_id: z.string(),
  /** Start time in ISO format */
  fromTime: z.string(),
  /** End time in ISO format */
  toTime: z.string(),
});

// ================================
// SMART DELIVERY SCHEMAS
// ================================

/**
 * Request schema for creating manual placement test
 */
export const CreateManualPlacementTestRequestSchema = z.object({
  /** Test name */
  test_name: z.string(),
  /** Test description */
  description: z.string().optional(),
  /** Spam filters to test */
  spam_filters: z.array(z.string()),
  /** Enable link checker */
  link_checker: z.boolean(),
  /** Campaign ID */
  campaign_id: z.number(),
  /** Sequence mapping ID */
  sequence_mapping_id: z.number(),
  /** Provider IDs */
  provider_ids: z.array(z.number()),
  /** Sender accounts */
  sender_accounts: z.array(z.string()),
  /** Send all emails without time gap */
  all_email_sent_without_time_gap: z.boolean(),
  /** Minimum time between emails */
  min_time_btwn_emails: z.number(),
  /** Time unit */
  min_time_unit: z.string(),
  /** Enable warmup */
  is_warmup: z.boolean(),
});

/**
 * Request schema for creating automated placement test
 */
export const CreateAutomatedPlacementTestRequestSchema = z.object({
  /** Test name */
  test_name: z.string(),
  /** Test description */
  description: z.string().optional(),
  /** Spam filters to test */
  spam_filters: z.array(z.string()),
  /** Enable link checker */
  link_checker: z.boolean(),
  /** Campaign ID */
  campaign_id: z.number(),
  /** Sequence mapping ID */
  sequence_mapping_id: z.number(),
  /** Provider IDs */
  provider_ids: z.array(z.number()),
  /** Sender accounts */
  sender_accounts: z.array(z.string()),
  /** Send all emails without time gap */
  all_email_sent_without_time_gap: z.boolean(),
  /** Minimum time between emails */
  min_time_btwn_emails: z.number(),
  /** Time unit */
  min_time_unit: z.string(),
  /** Enable warmup */
  is_warmup: z.boolean(),
  /** Schedule start time */
  schedule_start_time: z.string(),
  /** Test end date */
  test_end_date: z.string(),
  /** Frequency in days */
  every_days: z.number(),
  /** Timezone */
  tz: z.string(),
  /** Days of week */
  days: z.array(z.number()),
  /** Start hour */
  starHour: z.string(),
  /** Folder ID */
  folder_id: z.number().optional(),
});

/**
 * Request schema for getting spam test details
 */
export const GetSpamTestDetailsRequestSchema = z.object({
  /** Spam test ID */
  spam_test_id: z.number(),
});

/**
 * Request schema for deleting smart delivery tests
 */
export const DeleteSmartDeliveryTestsRequestSchema = z.object({
  /** Array of spam test IDs to delete */
  spamTestIds: z.array(z.number()),
});

/**
 * Request schema for listing tests
 */
export const ListTestsRequestSchema = z.object({
  /** Test type */
  testType: z.enum(['manual', 'auto']),
  /** Limit */
  limit: z.number().optional(),
  /** Offset */
  offset: z.number().optional(),
});

/**
 * Request schema for creating folder
 */
export const CreateFolderRequestSchema = z.object({
  /** Folder name */
  name: z.string(),
});

/**
 * Request schema for getting folder by ID
 */
export const GetFolderByIdRequestSchema = z.object({
  /** Folder ID */
  folder_id: z.number(),
});

// ================================
// TYPESCRIPT TYPE EXPORTS
// ================================

/** Configuration type for SmartLead client */
export type SmartLeadClientConfig = SmartLeadConfig;

/** Campaign management types */
export type CreateCampaignRequest = z.infer<typeof CreateCampaignRequestSchema>;
export type UpdateCampaignScheduleRequest = z.infer<typeof UpdateCampaignScheduleRequestSchema>;
export type UpdateCampaignSettingsRequest = z.infer<typeof UpdateCampaignSettingsRequestSchema>;
export type UpdateCampaignStatusRequest = z.infer<typeof UpdateCampaignStatusRequestSchema>;
export type GetCampaignRequest = z.infer<typeof GetCampaignRequestSchema>;
export type ListCampaignsRequest = z.infer<typeof ListCampaignsRequestSchema>;

/** Email sequence types */
export type EmailSequence = z.infer<typeof EmailSequenceSchema>;
export type SequenceVariant = z.infer<typeof SequenceVariantSchema>;
export type SaveCampaignSequenceRequest = z.infer<typeof SaveCampaignSequenceRequestSchema>;

/** Lead management types */
export type Lead = z.infer<typeof LeadSchema>;
export type ListLeadsRequest = z.infer<typeof ListLeadsRequestSchema>;
export type GetLeadRequest = z.infer<typeof GetLeadRequestSchema>;
export type AddLeadToCampaignRequest = z.infer<typeof AddLeadToCampaignRequestSchema>;
export type UpdateLeadRequest = z.infer<typeof UpdateLeadRequestSchema>;
export type UpdateLeadStatusRequest = z.infer<typeof UpdateLeadStatusRequestSchema>;
export type BulkImportLeadsRequest = z.infer<typeof BulkImportLeadsRequestSchema>;
export type DeleteLeadRequest = z.infer<typeof DeleteLeadRequestSchema>;

/** Analytics types */
export type CampaignAnalyticsByDateRequest = z.infer<typeof CampaignAnalyticsByDateRequestSchema>;
export type CampaignSequenceAnalyticsRequest = z.infer<typeof CampaignSequenceAnalyticsRequestSchema>;
export type CampaignStatisticsRequest = z.infer<typeof CampaignStatisticsRequestSchema>;
export type WarmupStatsByEmailRequest = z.infer<typeof WarmupStatsByEmailRequestSchema>;
export type CampaignTopLevelAnalyticsRequest = z.infer<typeof CampaignTopLevelAnalyticsRequestSchema>;
export type CampaignLeadStatisticsRequest = z.infer<typeof CampaignLeadStatisticsRequestSchema>;
export type CampaignMailboxStatisticsRequest = z.infer<typeof CampaignMailboxStatisticsRequestSchema>;
export type DownloadCampaignDataRequest = z.infer<typeof DownloadCampaignDataRequestSchema>;
export type ViewDownloadStatisticsRequest = z.infer<typeof ViewDownloadStatisticsRequestSchema>;

/** Webhook types */
export type FetchWebhooksByCampaignRequest = z.infer<typeof FetchWebhooksByCampaignRequestSchema>;
export type UpsertCampaignWebhookRequest = z.infer<typeof UpsertCampaignWebhookRequestSchema>;
export type DeleteCampaignWebhookRequest = z.infer<typeof DeleteCampaignWebhookRequestSchema>;
export type WebhookPublishSummaryRequest = z.infer<typeof WebhookPublishSummaryRequestSchema>;
export type RetriggerFailedEventsRequest = z.infer<typeof RetriggerFailedEventsRequestSchema>;

/** Smart Delivery types */
export type CreateManualPlacementTestRequest = z.infer<typeof CreateManualPlacementTestRequestSchema>;
export type CreateAutomatedPlacementTestRequest = z.infer<typeof CreateAutomatedPlacementTestRequestSchema>;
export type GetSpamTestDetailsRequest = z.infer<typeof GetSpamTestDetailsRequestSchema>;
export type DeleteSmartDeliveryTestsRequest = z.infer<typeof DeleteSmartDeliveryTestsRequestSchema>;
export type ListTestsRequest = z.infer<typeof ListTestsRequestSchema>;
export type CreateFolderRequest = z.infer<typeof CreateFolderRequestSchema>;
export type GetFolderByIdRequest = z.infer<typeof GetFolderByIdRequestSchema>;

/** Common response types */
export type ErrorResponse = z.infer<typeof ErrorSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

/**
 * Schema for getting campaigns with analytics - comprehensive endpoint
 */
export const GetCampaignsWithAnalyticsRequestSchema = z.object({
  /** Filter campaigns by specific client ID to reduce dataset size */
  client_id: z.string().optional(),
  /** Filter campaigns by status (recommended for large accounts) */
  status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'DRAFT']).optional(),
  /** Maximum number of campaigns to return */
  limit: z.number().int().min(1).max(100).default(50),
  /** Number of campaigns to skip for pagination */
  offset: z.number().int().min(0).default(0),
  /** Start date for analytics (YYYY-MM-DD format) */
  start_date: z.string().default('2024-01-01'),
  /** End date for analytics (YYYY-MM-DD format, defaults to today) */
  end_date: z.string().optional(),
});

export type GetCampaignsWithAnalyticsRequest = z.infer<typeof GetCampaignsWithAnalyticsRequestSchema>;

// ================================
// LEAD MANAGEMENT SCHEMAS
// ================================

export const FetchLeadCategoriesRequestSchema = z.object({});

export const ListLeadsByCampaignRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  limit: z.number().int().min(1).max(1000).optional(),
  offset: z.number().int().min(0).optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

export const FetchLeadByEmailRequestSchema = z.object({
  email: z.string().email(),
});

export const AddLeadsToCampaignRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  leads: z.array(z.object({
    email: z.string().email(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    company: z.string().optional(),
    title: z.string().optional(),
    phone: z.string().optional(),
  })),
});

export const ResumeLeadByCampaignRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
});

export const PauseLeadByCampaignRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
});

export const DeleteLeadByCampaignRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
});

export const UnsubscribeLeadFromCampaignRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
});

export const UnsubscribeLeadFromAllCampaignsRequestSchema = z.object({
  lead_id: z.number().int().positive(),
});

export const AddLeadToGlobalBlocklistRequestSchema = z.object({
  email: z.string().email(),
});

export const UpdateLeadByIdRequestSchema = z.object({
  lead_id: z.number().int().positive(),
  email: z.string().email().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  phone: z.string().optional(),
});

export const UpdateLeadCategoryRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
  category: z.string(),
});

export const FetchLeadMessageHistoryRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
});

export const ReplyToLeadFromMasterInboxRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
  message: z.string(),
  subject: z.string().optional(),
});

export const ForwardReplyRequestSchema = z.object({
  campaign_id: z.number().int().positive(),
  lead_id: z.number().int().positive(),
  forward_to: z.string().email(),
  message: z.string().optional(),
});

export const FetchAllLeadsFromAccountRequestSchema = z.object({});
export const FetchLeadsFromGlobalBlocklistRequestSchema = z.object({});

// Lead management types
export type ListLeadsByCampaignRequest = z.infer<typeof ListLeadsByCampaignRequestSchema>;
export type FetchLeadByEmailRequest = z.infer<typeof FetchLeadByEmailRequestSchema>;
export type AddLeadsToCampaignRequest = z.infer<typeof AddLeadsToCampaignRequestSchema>;
export type ResumeLeadByCampaignRequest = z.infer<typeof ResumeLeadByCampaignRequestSchema>;
export type PauseLeadByCampaignRequest = z.infer<typeof PauseLeadByCampaignRequestSchema>;
export type DeleteLeadByCampaignRequest = z.infer<typeof DeleteLeadByCampaignRequestSchema>;
export type UnsubscribeLeadFromCampaignRequest = z.infer<typeof UnsubscribeLeadFromCampaignRequestSchema>;
export type UnsubscribeLeadFromAllCampaignsRequest = z.infer<typeof UnsubscribeLeadFromAllCampaignsRequestSchema>;
export type AddLeadToGlobalBlocklistRequest = z.infer<typeof AddLeadToGlobalBlocklistRequestSchema>;
export type UpdateLeadByIdRequest = z.infer<typeof UpdateLeadByIdRequestSchema>;
export type UpdateLeadCategoryRequest = z.infer<typeof UpdateLeadCategoryRequestSchema>;
export type FetchLeadMessageHistoryRequest = z.infer<typeof FetchLeadMessageHistoryRequestSchema>;
export type ReplyToLeadFromMasterInboxRequest = z.infer<typeof ReplyToLeadFromMasterInboxRequestSchema>;
export type ForwardReplyRequest = z.infer<typeof ForwardReplyRequestSchema>;
