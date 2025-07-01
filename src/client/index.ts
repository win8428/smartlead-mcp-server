/**
 * SmartLead MCP Server - Main Client
 *
 * Main client that combines all API modules into a single interface.
 * Provides a unified API for accessing all SmartLead functionality.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { AnalyticsClient } from '../modules/analytics/client.js';
import { CampaignManagementClient } from '../modules/campaigns/client.js';
import { ClientManagementClient } from '../modules/client-management/client.js';
import { EmailAccountManagementClient } from '../modules/email-accounts/client.js';
import { LeadClient } from '../modules/leads/client.js';
import { SmartDeliveryClient } from '../modules/smart-delivery/client.js';
import { SmartSendersClient } from '../modules/smart-senders/client.js';
import { StatisticsClient } from '../modules/statistics/client.js';
import { WebhooksClient } from '../modules/webhooks/client.js';
import type { SmartLeadConfig } from '../types/config.js';
import type {
  AnalyticsCampaignFollowUpReplyRateRequest,
  AnalyticsCampaignLeadsTakeForFirstReplyRequest,
  AnalyticsCampaignLeadToReplyTimeRequest,
  AnalyticsCampaignListRequest,
  AnalyticsCampaignOverallStatsRequest,
  AnalyticsCampaignResponseStatsRequest,
  AnalyticsCampaignStatusStatsRequest,
  AnalyticsClientListRequest,
  AnalyticsClientMonthWiseCountRequest,
  AnalyticsClientOverallStatsRequest,
  AnalyticsDayWiseOverallStatsRequest,
  AnalyticsLeadCategoryWiseResponseRequest,
  AnalyticsLeadOverallStatsRequest,
  AnalyticsMailboxDomainWiseHealthMetricsRequest,
  AnalyticsMailboxNameWiseHealthMetricsRequest,
  AnalyticsMailboxOverallStatsRequest,
  AnalyticsMailboxProviderWiseOverallPerformanceRequest,
  AnalyticsOverallStatsV2Request,
  AnalyticsTeamBoardOverallStatsRequest,
  CreateCampaignRequest,
  EmailSequence,
  ExportCampaignDataRequest,
  FetchCampaignAnalyticsByDateRangeRequest,
  GetCampaignSequenceAnalyticsRequest,
  GetCampaignsWithAnalyticsRequest,
  Lead,
  ListCampaignsRequest,
  ListLeadsRequest,
  UpdateCampaignScheduleRequest,
  UpdateCampaignSettingsRequest,
  UpdateLeadRequest,
} from '../types.js';
import { BaseSmartLeadClient } from './base.js';

// These are not in types.ts, so defining them here
interface EmailAccountRequest {
  email: string;
  password: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: string;
  imap_port: number;
  name?: string;
}
interface UpdateEmailAccountRequest {
  name?: string;
  settings?: Record<string, unknown>;
  status?: 'active' | 'inactive' | 'warmup';
}
interface WarmupSettings {
  email_account_id: number;
  emails_per_day?: number;
  warmup_reputation?: boolean;
  ramp_up_increment?: number;
  reply_rate_percentage?: number;
}
interface EmailAccountHealthParams {
  start_date?: string;
  end_date?: string;
  metrics?: string[];
}

/**
 * Main SmartLead API Client
 *
 * Unified client that provides access to all SmartLead API functionality
 * through modular sub-clients for different API categories.
 */
export class SmartLeadClient extends BaseSmartLeadClient {
  public readonly campaigns: CampaignManagementClient;
  public readonly leads: LeadClient;
  public readonly analytics: AnalyticsClient;
  public readonly emailAccounts: EmailAccountManagementClient;
  public readonly clientManagement: ClientManagementClient;
  public readonly webhooks: WebhooksClient;
  public readonly smartDelivery: SmartDeliveryClient;
  public readonly statistics: StatisticsClient;
  public readonly smartSenders: SmartSendersClient;

  constructor(config: SmartLeadConfig) {
    super(config);

    // Initialize all module clients
    this.campaigns = new CampaignManagementClient(config);
    this.leads = new LeadClient(config);
    this.analytics = new AnalyticsClient(config);
    this.emailAccounts = new EmailAccountManagementClient(config);
    this.clientManagement = new ClientManagementClient(config);
    this.webhooks = new WebhooksClient(config);
    this.smartDelivery = new SmartDeliveryClient(config);
    this.statistics = new StatisticsClient(config);
    this.smartSenders = new SmartSendersClient(config);
  }

  // ================================
  // LEGACY COMPATIBILITY METHODS
  // ================================
  // These methods maintain backward compatibility with the existing server implementation
  // while the server is being refactored to use the new modular structure

  // Campaign methods (delegate to campaigns module)
  async createCampaign(params: CreateCampaignRequest) {
    return this.campaigns.createCampaign(params);
  }
  async updateCampaignSchedule(campaignId: number, params: UpdateCampaignScheduleRequest) {
    return this.campaigns.updateCampaignSchedule(campaignId, params);
  }
  async updateCampaignSettings(campaignId: number, params: UpdateCampaignSettingsRequest) {
    return this.campaigns.updateCampaignSettings(campaignId, params);
  }
  async updateCampaignStatus(campaignId: number, status: string) {
    return this.campaigns.updateCampaignStatus(campaignId, status);
  }
  async getCampaign(campaignId: number) {
    return this.campaigns.getCampaign(campaignId);
  }
  async listCampaigns(params?: ListCampaignsRequest) {
    return this.campaigns.listCampaigns(params);
  }
  async saveCampaignSequence(campaignId: number, sequence: EmailSequence) {
    return this.campaigns.saveCampaignSequence(campaignId, sequence);
  }
  async getCampaignSequence(campaignId: number) {
    return this.campaigns.getCampaignSequence(campaignId);
  }
  async getCampaignsWithAnalytics(params?: GetCampaignsWithAnalyticsRequest) {
    return this.campaigns.getCampaignsWithAnalytics(params);
  }
  async deleteCampaign(campaignId: number) {
    return this.campaigns.deleteCampaign(campaignId);
  }
  async exportCampaignData(campaignId: number, params?: ExportCampaignDataRequest) {
    return this.campaigns.exportCampaignData(campaignId, params);
  }
  async fetchCampaignAnalyticsByDateRange(
    campaignId: number,
    params: FetchCampaignAnalyticsByDateRangeRequest
  ) {
    return this.campaigns.fetchCampaignAnalyticsByDateRange(campaignId, params);
  }
  async getCampaignSequenceAnalytics(
    campaignId: number,
    params?: GetCampaignSequenceAnalyticsRequest
  ) {
    return this.campaigns.getCampaignSequenceAnalytics(campaignId, params);
  }
  async fetchAllCampaignsUsingLeadId(leadId: number) {
    return this.campaigns.fetchAllCampaignsUsingLeadId({ lead_id: leadId });
  }

  // Lead methods (delegate to leads module)
  async listLeadsByCampaign(
    campaignId: number,
    params?: { limit?: number; offset?: number; search?: string; status?: string }
  ) {
    const leadsParams = params
      ? {
          campaign_id: campaignId,
          ...params,
        }
      : { campaign_id: campaignId };
    return this.leads.listLeadsByCampaign(campaignId, leadsParams);
  }
  async fetchLeadCategories() {
    return this.leads.fetchLeadCategories();
  }
  async fetchLeadByEmail(email: string) {
    return this.leads.fetchLeadByEmail(email);
  }
  async addLeadsToCampaign(campaignId: number, leads: Lead[]) {
    return this.leads.addLeadsToCampaign(campaignId, leads);
  }
  async resumeLeadByCampaign(campaignId: number, leadId: number) {
    return this.leads.resumeLeadByCampaign(campaignId, leadId);
  }
  async pauseLeadByCampaign(campaignId: number, leadId: number) {
    return this.leads.pauseLeadByCampaign(campaignId, leadId);
  }
  async deleteLeadByCampaign(campaignId: number, leadId: number) {
    return this.leads.deleteLeadByCampaign(campaignId, leadId);
  }
  async unsubscribeLeadFromCampaign(campaignId: number, leadId: number) {
    return this.leads.unsubscribeLeadFromCampaign(campaignId, leadId);
  }
  async unsubscribeLeadFromAllCampaigns(leadId: number) {
    return this.leads.unsubscribeLeadFromAllCampaigns(leadId);
  }
  async addLeadToGlobalBlocklist(email: string) {
    return this.leads.addLeadToGlobalBlocklist(email);
  }
  async fetchAllLeadsFromAccount(params?: ListLeadsRequest) {
    return this.leads.fetchAllLeadsFromAccount(params);
  }
  async fetchLeadsFromGlobalBlocklist(params?: ListLeadsRequest) {
    return this.leads.fetchLeadsFromGlobalBlocklist(params);
  }
  async updateLeadById(leadId: number, leadData: UpdateLeadRequest) {
    return this.leads.updateLeadById(leadId, leadData);
  }
  async updateLeadCategory(campaignId: number, leadId: number, category: string) {
    return this.leads.updateLeadCategory(campaignId, leadId, category);
  }
  async fetchLeadMessageHistory(campaignId: number, leadId: number) {
    return this.leads.fetchLeadMessageHistory(campaignId, leadId);
  }
  async replyToLeadFromMasterInbox(
    campaignId: number,
    leadId: number,
    message: { subject: string; message: string }
  ) {
    const replyMessage = {
      campaign_id: campaignId,
      lead_id: leadId,
      message: message.message,
      subject: message.subject,
    };
    return this.leads.replyToLeadFromMasterInbox(campaignId, leadId, replyMessage);
  }
  async forwardReply(
    campaignId: number,
    leadId: number,
    forwardData: { forward_to: string; message?: string }
  ) {
    const forwardRequest = {
      forward_to_email: forwardData.forward_to,
      message: forwardData.message,
      include_original: true,
    };
    return this.leads.forwardReply(campaignId, leadId, forwardRequest);
  }

  // Analytics methods (delegate to analytics module)
  async getAnalyticsCampaignList(params?: AnalyticsCampaignListRequest) {
    return this.analytics.getCampaignList(params);
  }
  async getAnalyticsClientList(params?: AnalyticsClientListRequest) {
    return this.analytics.getClientList(params);
  }
  async getAnalyticsClientMonthWiseCount(params?: AnalyticsClientMonthWiseCountRequest) {
    return this.analytics.getClientMonthWiseCount(params);
  }
  async getAnalyticsOverallStatsV2(params?: AnalyticsOverallStatsV2Request) {
    return this.analytics.getOverallStatsV2(params);
  }
  async getAnalyticsDayWiseOverallStats(params?: AnalyticsDayWiseOverallStatsRequest) {
    return this.analytics.getDayWiseOverallStats(params);
  }
  async getAnalyticsDayWisePositiveReplyStats(params?: AnalyticsDayWiseOverallStatsRequest) {
    return this.analytics.getDayWisePositiveReplyStats(params);
  }
  async getAnalyticsCampaignOverallStats(params?: AnalyticsCampaignOverallStatsRequest) {
    return this.analytics.getCampaignOverallStats(params);
  }
  async getAnalyticsClientOverallStats(params?: AnalyticsClientOverallStatsRequest) {
    return this.analytics.getClientOverallStats(params);
  }
  async getAnalyticsMailboxNameWiseHealthMetrics(
    params?: AnalyticsMailboxNameWiseHealthMetricsRequest
  ) {
    return this.analytics.getMailboxNameWiseHealthMetrics(params);
  }
  async getAnalyticsMailboxDomainWiseHealthMetrics(
    params?: AnalyticsMailboxDomainWiseHealthMetricsRequest
  ) {
    return this.analytics.getMailboxDomainWiseHealthMetrics(params);
  }
  async getAnalyticsMailboxProviderWiseOverallPerformance(
    params?: AnalyticsMailboxProviderWiseOverallPerformanceRequest
  ) {
    return this.analytics.getMailboxProviderWiseOverallPerformance(params);
  }
  async getAnalyticsTeamBoardOverallStats(params?: AnalyticsTeamBoardOverallStatsRequest) {
    return this.analytics.getTeamBoardOverallStats(params);
  }
  async getAnalyticsLeadOverallStats(params?: AnalyticsLeadOverallStatsRequest) {
    return this.analytics.getLeadOverallStats(params);
  }
  async getAnalyticsLeadCategoryWiseResponse(params?: AnalyticsLeadCategoryWiseResponseRequest) {
    return this.analytics.getLeadCategoryWiseResponse(params);
  }
  async getAnalyticsCampaignLeadsTakeForFirstReply(
    params?: AnalyticsCampaignLeadsTakeForFirstReplyRequest
  ) {
    return this.analytics.getCampaignLeadsTakeForFirstReply(params);
  }
  async getAnalyticsCampaignFollowUpReplyRate(params?: AnalyticsCampaignFollowUpReplyRateRequest) {
    return this.analytics.getCampaignFollowUpReplyRate(params);
  }
  async getAnalyticsCampaignLeadToReplyTime(params?: AnalyticsCampaignLeadToReplyTimeRequest) {
    return this.analytics.getCampaignLeadToReplyTime(params);
  }
  async getAnalyticsCampaignResponseStats(params?: AnalyticsCampaignResponseStatsRequest) {
    return this.analytics.getCampaignResponseStats(params);
  }
  async getAnalyticsCampaignStatusStats(params?: AnalyticsCampaignStatusStatsRequest) {
    return this.analytics.getCampaignStatusStats(params);
  }
  async getAnalyticsMailboxOverallStats(params?: AnalyticsMailboxOverallStatsRequest) {
    return this.analytics.getMailboxOverallStats(params);
  }

  // Email Account methods (delegate to email accounts module)
  async addEmailAccount(params: EmailAccountRequest) {
    return this.emailAccounts.createEmailAccount(params);
  }
  async getAllEmailAccounts() {
    return this.emailAccounts.getAllEmailAccounts();
  }
  async getEmailAccountById(accountId: number) {
    return this.emailAccounts.getEmailAccountById(accountId);
  }
  async updateEmailAccount(accountId: number, params: UpdateEmailAccountRequest) {
    return this.emailAccounts.updateEmailAccount(accountId, params);
  }
  async deleteEmailAccount(_accountId: number) {
    // Note: Delete functionality not available in current API
    throw new Error('Delete email account functionality not available in current SmartLead API');
  }
  async testEmailAccountConnection(accountId: number) {
    return this.emailAccounts.testEmailAccountConnection(accountId);
  }
  async getEmailAccountWarmupStatus(accountId: number) {
    return this.emailAccounts.getEmailAccountWarmupStatus(accountId);
  }
  async updateEmailAccountWarmupSettings(accountId: number, params: WarmupSettings) {
    return this.emailAccounts.updateEmailAccountWarmupSettings(accountId, params);
  }
  async getEmailAccountHealthMetrics(accountId: number, params?: EmailAccountHealthParams) {
    return this.emailAccounts.getEmailAccountHealthMetrics(accountId, params);
  }
  async assignEmailAccountsToCampaign(campaignId: number, accountIds: number[]) {
    return this.emailAccounts.assignEmailAccountsToCampaign(campaignId, accountIds);
  }
  async removeEmailAccountsFromCampaign(campaignId: number, accountIds: number[]) {
    return this.emailAccounts.removeEmailAccountsFromCampaign(campaignId, accountIds);
  }
  async listEmailAccountsPerCampaign(campaignId: number) {
    return this.emailAccounts.listEmailAccountsPerCampaign(campaignId);
  }
}

export { AnalyticsClient } from '../modules/analytics/client.js';
export { CampaignManagementClient } from '../modules/campaigns/client.js';
export { ClientManagementClient } from '../modules/client-management/client.js';
export { EmailAccountManagementClient } from '../modules/email-accounts/client.js';
export { LeadClient } from '../modules/leads/client.js';
export { SmartDeliveryClient } from '../modules/smart-delivery/client.js';
export { SmartSendersClient } from '../modules/smart-senders/client.js';
export { StatisticsClient } from '../modules/statistics/client.js';
export { WebhooksClient } from '../modules/webhooks/client.js';
export { SmartLeadConfig } from '../types/config.js';
// Export the main client and all modules
export { BaseSmartLeadClient, SmartLeadError } from './base.js';
