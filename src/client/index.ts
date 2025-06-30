/**
 * SmartLead MCP Server - Main Client
 *
 * Main client that combines all API modules into a single interface.
 * Provides a unified API for accessing all SmartLead functionality.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from './base.js';
import { SmartLeadConfig } from '../types/config.js';
import { CampaignClient } from '../modules/campaigns/client.js';
import { LeadClient } from '../modules/leads/client.js';
import { AnalyticsClient } from '../modules/analytics/client.js';
import { EmailAccountClient } from '../modules/email-accounts/client.js';
import { ClientManagementClient } from '../modules/client-management/client.js';
import { WebhooksClient } from '../modules/webhooks/client.js';
import { SmartDeliveryClient } from '../modules/smart-delivery/client.js';
import { StatisticsClient } from '../modules/statistics/client.js';
import { SmartSendersClient } from '../modules/smart-senders/client.js';

/**
 * Main SmartLead API Client
 *
 * Unified client that provides access to all SmartLead API functionality
 * through modular sub-clients for different API categories.
 */
export class SmartLeadClient extends BaseSmartLeadClient {
  public readonly campaigns: CampaignClient;
  public readonly leads: LeadClient;
  public readonly analytics: AnalyticsClient;
  public readonly emailAccounts: EmailAccountClient;
  public readonly clientManagement: ClientManagementClient;
  public readonly webhooks: WebhooksClient;
  public readonly smartDelivery: SmartDeliveryClient;
  public readonly statistics: StatisticsClient;
  public readonly smartSenders: SmartSendersClient;

  constructor(config: SmartLeadConfig) {
    super(config);

    // Initialize all module clients
    this.campaigns = new CampaignClient(config);
    this.leads = new LeadClient(config);
    this.analytics = new AnalyticsClient(config);
    this.emailAccounts = new EmailAccountClient(config);
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
  async createCampaign(params: any) {
    return this.campaigns.createCampaign(params);
  }
  async updateCampaignSchedule(campaignId: number, params: any) {
    return this.campaigns.updateCampaignSchedule(campaignId, params);
  }
  async updateCampaignSettings(campaignId: number, params: any) {
    return this.campaigns.updateCampaignSettings(campaignId, params);
  }
  async updateCampaignStatus(campaignId: number, status: string) {
    return this.campaigns.updateCampaignStatus(campaignId, status);
  }
  async getCampaign(campaignId: number) {
    return this.campaigns.getCampaign(campaignId);
  }
  async listCampaigns(params?: any) {
    return this.campaigns.listCampaigns(params);
  }
  async saveCampaignSequence(campaignId: number, sequence: any) {
    return this.campaigns.saveCampaignSequence(campaignId, sequence);
  }
  async getCampaignSequence(campaignId: number) {
    return this.campaigns.getCampaignSequence(campaignId);
  }
  async getCampaignsWithAnalytics(params?: any) {
    return this.campaigns.getCampaignsWithAnalytics(params);
  }
  async deleteCampaign(campaignId: number) {
    return this.campaigns.deleteCampaign(campaignId);
  }
  async exportCampaignData(campaignId: number, params?: any) {
    return this.campaigns.exportCampaignData(campaignId, params);
  }
  async fetchCampaignAnalyticsByDateRange(campaignId: number, params: any) {
    return this.campaigns.fetchCampaignAnalyticsByDateRange(campaignId, params);
  }
  async getCampaignSequenceAnalytics(campaignId: number, params?: any) {
    return this.campaigns.getCampaignSequenceAnalytics(campaignId, params);
  }
  async fetchAllCampaignsUsingLeadId(leadId: number) {
    return this.campaigns.fetchAllCampaignsUsingLeadId(leadId);
  }

  // Lead methods (delegate to leads module)
  async listLeadsByCampaign(campaignId: number, params?: any) {
    return this.leads.listLeadsByCampaign(campaignId, params);
  }
  async fetchLeadCategories() {
    return this.leads.fetchLeadCategories();
  }
  async fetchLeadByEmail(email: string) {
    return this.leads.fetchLeadByEmail(email);
  }
  async addLeadsToCampaign(campaignId: number, leads: any[]) {
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
  async fetchAllLeadsFromAccount(params?: any) {
    return this.leads.fetchAllLeadsFromAccount(params);
  }
  async fetchLeadsFromGlobalBlocklist(params?: any) {
    return this.leads.fetchLeadsFromGlobalBlocklist(params);
  }
  async updateLeadById(leadId: number, leadData: any) {
    return this.leads.updateLeadById(leadId, leadData);
  }
  async updateLeadCategory(campaignId: number, leadId: number, category: string) {
    return this.leads.updateLeadCategory(campaignId, leadId, category);
  }
  async fetchLeadMessageHistory(campaignId: number, leadId: number) {
    return this.leads.fetchLeadMessageHistory(campaignId, leadId);
  }
  async replyToLeadFromMasterInbox(campaignId: number, leadId: number, message: any) {
    return this.leads.replyToLeadFromMasterInbox(campaignId, leadId, message);
  }
  async forwardReply(campaignId: number, leadId: number, forwardData: any) {
    return this.leads.forwardReply(campaignId, leadId, forwardData);
  }

  // Analytics methods (delegate to analytics module)
  async getAnalyticsCampaignList(params?: any) {
    return this.analytics.getCampaignList(params);
  }
  async getAnalyticsClientList(params?: any) {
    return this.analytics.getClientList(params);
  }
  async getAnalyticsClientMonthWiseCount(params?: any) {
    return this.analytics.getClientMonthWiseCount(params);
  }
  async getAnalyticsOverallStatsV2(params?: any) {
    return this.analytics.getOverallStatsV2(params);
  }
  async getAnalyticsDayWiseOverallStats(params?: any) {
    return this.analytics.getDayWiseOverallStats(params);
  }
  async getAnalyticsDayWisePositiveReplyStats(params?: any) {
    return this.analytics.getDayWisePositiveReplyStats(params);
  }
  async getAnalyticsCampaignOverallStats(params?: any) {
    return this.analytics.getCampaignOverallStats(params);
  }
  async getAnalyticsClientOverallStats(params?: any) {
    return this.analytics.getClientOverallStats(params);
  }
  async getAnalyticsMailboxNameWiseHealthMetrics(params?: any) {
    return this.analytics.getMailboxNameWiseHealthMetrics(params);
  }
  async getAnalyticsMailboxDomainWiseHealthMetrics(params?: any) {
    return this.analytics.getMailboxDomainWiseHealthMetrics(params);
  }
  async getAnalyticsMailboxProviderWiseOverallPerformance(params?: any) {
    return this.analytics.getMailboxProviderWiseOverallPerformance(params);
  }
  async getAnalyticsTeamBoardOverallStats(params?: any) {
    return this.analytics.getTeamBoardOverallStats(params);
  }
  async getAnalyticsLeadOverallStats(params?: any) {
    return this.analytics.getLeadOverallStats(params);
  }
  async getAnalyticsLeadCategoryWiseResponse(params?: any) {
    return this.analytics.getLeadCategoryWiseResponse(params);
  }
  async getAnalyticsCampaignLeadsTakeForFirstReply(params?: any) {
    return this.analytics.getCampaignLeadsTakeForFirstReply(params);
  }
  async getAnalyticsCampaignFollowUpReplyRate(params?: any) {
    return this.analytics.getCampaignFollowUpReplyRate(params);
  }
  async getAnalyticsCampaignLeadToReplyTime(params?: any) {
    return this.analytics.getCampaignLeadToReplyTime(params);
  }
  async getAnalyticsCampaignResponseStats(params?: any) {
    return this.analytics.getCampaignResponseStats(params);
  }
  async getAnalyticsCampaignStatusStats(params?: any) {
    return this.analytics.getCampaignStatusStats(params);
  }
  async getAnalyticsMailboxOverallStats(params?: any) {
    return this.analytics.getMailboxOverallStats(params);
  }

  // Email Account methods (delegate to email accounts module)
  async addEmailAccount(params: any) {
    return this.emailAccounts.createEmailAccount(params);
  }
  async getAllEmailAccounts(params?: any) {
    return this.emailAccounts.getAllEmailAccounts();
  }
  async getEmailAccountById(accountId: number) {
    return this.emailAccounts.getEmailAccountById(accountId);
  }
  async updateEmailAccount(accountId: number, params: any) {
    return this.emailAccounts.updateEmailAccount(accountId, params);
  }
  async deleteEmailAccount(accountId: number) {
    // Note: Delete functionality not available in current API
    throw new Error('Delete email account functionality not available in current SmartLead API');
  }
  async testEmailAccountConnection(accountId: number) {
    return this.emailAccounts.testEmailAccountConnection(accountId);
  }
  async getEmailAccountWarmupStatus(accountId: number) {
    return this.emailAccounts.getEmailAccountWarmupStatus(accountId);
  }
  async updateEmailAccountWarmupSettings(accountId: number, params: any) {
    return this.emailAccounts.updateEmailAccountWarmupSettings(accountId, params);
  }
  async getEmailAccountHealthMetrics(accountId: number, params?: any) {
    return this.emailAccounts.getEmailAccountHealthMetrics(accountId, params);
  }
  async assignEmailAccountsToCampaign(campaignId: number, accountIds: number[]) {
    return this.emailAccounts.assignEmailAccountsToCampaign(campaignId, accountIds);
  }
  async removeEmailAccountsFromCampaign(campaignId: number, accountIds: number[]) {
    return this.emailAccounts.removeEmailAccountsFromCampaign(campaignId, accountIds);
  }
  async getCampaignEmailAccounts(campaignId: number) {
    return this.emailAccounts.getCampaignEmailAccounts(campaignId);
  }
  async bulkUpdateEmailAccountSettings(params: any) {
    return this.emailAccounts.bulkUpdateEmailAccountSettings(params);
  }
  async getEmailAccountSendingLimits(accountId: number) {
    return this.emailAccounts.getEmailAccountSendingLimits(accountId);
  }
  async updateEmailAccountSendingLimits(accountId: number, params: any) {
    return this.emailAccounts.updateEmailAccountSendingLimits(accountId, params);
  }
}

// Export the main client and all modules
export { BaseSmartLeadClient, SmartLeadError } from './base.js';
export { CampaignClient } from '../modules/campaigns/client.js';
export { LeadClient } from '../modules/leads/client.js';
export { AnalyticsClient } from '../modules/analytics/client.js';
export { EmailAccountClient } from '../modules/email-accounts/client.js';
export { ClientManagementClient } from '../modules/client-management/client.js';
export { WebhooksClient } from '../modules/webhooks/client.js';
export { SmartDeliveryClient } from '../modules/smart-delivery/client.js';
export { StatisticsClient } from '../modules/statistics/client.js';
export { SmartSendersClient } from '../modules/smart-senders/client.js';
export { SmartLeadConfig } from '../types/config.js';
