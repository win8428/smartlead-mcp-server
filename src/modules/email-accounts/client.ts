/**
 * SmartLead MCP Server - Email Account Management Client
 *
 * Client module for email account management API endpoints.
 * Handles all email account operations including setup, configuration, and health monitoring.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
/**
 * Email Account Management Client
 *
 * Provides methods for managing SmartLead email accounts including:
 * - Adding and configuring email accounts
 * - Managing email account settings and warmup
 * - Monitoring email account health and deliverability
 * - Managing email account assignments to campaigns
 */
export class EmailAccountClient extends BaseSmartLeadClient {
  // ================================
  // EMAIL ACCOUNT MANAGEMENT METHODS
  // ================================

  /**
   * List all email accounts per campaign
   * GET /campaigns/{campaign_id}/email-accounts
   */
  async listEmailAccountsPerCampaign(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/email-accounts`),
      'list email accounts per campaign'
    );
    return response.data;
  }

  /**
   * Add Email Account to a Campaign
   * POST /campaigns/{campaign_id}/email-accounts
   */
  async addEmailAccountToCampaign(
    campaignId: number,
    params: { email_account_id: number }
  ): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/email-accounts`, params),
      'add email account to campaign'
    );
    return response.data;
  }

  /**
   * Remove Email Account from a Campaign
   * DELETE /campaigns/{campaign_id}/email-accounts/{email_account_id}
   */
  async removeEmailAccountFromCampaign(campaignId: number, emailAccountId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/email-accounts/${emailAccountId}`),
      'remove email account from campaign'
    );
    return response.data;
  }

  /**
   * Fetch all email accounts associated to a user
   * GET /email-accounts
   */
  async getAllEmailAccounts(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/email-accounts'),
      'get all email accounts'
    );
    return response.data;
  }

  /**
   * Create an Email Account
   * POST /email-accounts
   */
  async createEmailAccount(params: {
    email: string;
    password: string;
    smtp_host: string;
    smtp_port: number;
    imap_host: string;
    imap_port: number;
    name?: string;
  }): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/email-accounts', params),
      'create email account'
    );
    return response.data;
  }

  /**
   * Update Email Account
   * POST /email-accounts/{email_account_id}
   */
  async updateEmailAccount(emailAccountId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}`, params),
      'update email account'
    );
    return response.data;
  }

  /**
   * Fetch Email Account By ID
   * GET /email-accounts/{email_account_id}
   */
  async getEmailAccountById(emailAccountId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${emailAccountId}`),
      'get email account by ID'
    );
    return response.data;
  }

  /**
   * Add/Update Warmup To Email Account
   * POST /email-accounts/{email_account_id}/warmup
   */
  async updateEmailAccountWarmup(
    emailAccountId: number,
    params: {
      warmup_enabled: boolean;
      warmup_reputation?: number;
      daily_ramp_up?: number;
      reply_rate_percentage?: number;
    }
  ): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}/warmup`, params),
      'update email account warmup'
    );
    return response.data;
  }

  /**
   * Reconnect failed email accounts
   * POST /email-accounts/reconnect
   */
  async reconnectFailedEmailAccounts(params: { email_account_ids: number[] }): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/email-accounts/reconnect', params),
      'reconnect failed email accounts'
    );
    return response.data;
  }

  /**
   * Update Email Account Tag
   * POST /email-accounts/{email_account_id}/tag
   */
  async updateEmailAccountTag(emailAccountId: number, params: { tag: string }): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}/tag`, params),
      'update email account tag'
    );
    return response.data;
  }

  /**
   * Test email account connection
   */
  async testEmailAccountConnection(accountId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${accountId}/test-connection`),
      'test email account connection'
    );
    return response.data;
  }

  /**
   * Get email account warmup status
   */
  async getEmailAccountWarmupStatus(accountId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${accountId}/warmup-status`),
      'get email account warmup status'
    );
    return response.data;
  }

  /**
   * Update email account warmup settings
   */
  async updateEmailAccountWarmupSettings(accountId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/email-accounts/${accountId}/warmup-settings`, params),
      'update email account warmup settings'
    );
    return response.data;
  }

  /**
   * Get email account health metrics
   */
  async getEmailAccountHealthMetrics(accountId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${accountId}/health-metrics`, { params }),
      'get email account health metrics'
    );
    return response.data;
  }

  /**
   * Assign email accounts to campaign
   */
  async assignEmailAccountsToCampaign(campaignId: number, accountIds: number[]): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post(`/campaigns/${campaignId}/email-accounts`, { account_ids: accountIds }),
      'assign email accounts to campaign'
    );
    return response.data;
  }

  /**
   * Remove email accounts from campaign
   */
  async removeEmailAccountsFromCampaign(campaignId: number, accountIds: number[]): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.delete(`/campaigns/${campaignId}/email-accounts`, {
          data: { account_ids: accountIds },
        }),
      'remove email accounts from campaign'
    );
    return response.data;
  }

  /**
   * Get campaign email accounts
   */
  async getCampaignEmailAccounts(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/email-accounts`),
      'get campaign email accounts'
    );
    return response.data;
  }

  /**
   * Bulk update email account settings
   */
  async bulkUpdateEmailAccountSettings(params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put('/email-accounts/bulk-update', params),
      'bulk update email account settings'
    );
    return response.data;
  }

  /**
   * Get email account sending limits
   */
  async getEmailAccountSendingLimits(accountId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${accountId}/sending-limits`),
      'get email account sending limits'
    );
    return response.data;
  }

  /**
   * Update email account sending limits
   */
  async updateEmailAccountSendingLimits(accountId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/email-accounts/${accountId}/sending-limits`, params),
      'update email account sending limits'
    );
    return response.data;
  }
}
