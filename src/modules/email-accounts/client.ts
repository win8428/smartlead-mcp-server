/**
 * SmartLead MCP Server - Email Account Management Client
 *
 * Client module for email account management API endpoints.
 * Handles all email account-related operations including creation, updates, warmup settings, and health metrics.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
import type { SuccessResponse } from '../../types.js';

// Email Account Type Definitions
export interface EmailAccountRequest {
  email: string;
  password: string;
  smtp_host: string;
  smtp_port: number;
  imap_host: string;
  imap_port: number;
  name?: string;
}

export interface UpdateEmailAccountRequest {
  name?: string;
  settings?: Record<string, unknown>;
  status?: 'active' | 'inactive' | 'warmup';
}

export interface WarmupSettings {
  email_account_id: number;
  emails_per_day?: number;
  warmup_reputation?: boolean;
  ramp_up_increment?: number;
  reply_rate_percentage?: number;
}

export interface EmailAccountHealthParams {
  start_date?: string;
  end_date?: string;
  metrics?: string[];
}

export interface BulkUpdateEmailAccountRequest {
  email_account_ids: number[];
  settings?: Record<string, unknown>;
  status?: 'active' | 'inactive' | 'warmup';
}

export interface SendingLimitsRequest {
  daily_limit?: number;
  monthly_limit?: number;
  per_hour_limit?: number;
  warmup_limit?: number;
}

/**
 * Email Account Management Client
 *
 * Provides methods for managing SmartLead email accounts including:
 * - Creating and updating email accounts
 * - Managing warmup settings and status
 * - Health metrics and monitoring
 * - Campaign assignment and management
 */
export class EmailAccountManagementClient extends BaseSmartLeadClient {
  // ================================
  // EMAIL ACCOUNT MANAGEMENT METHODS
  // ================================

  /**
   * List Email Accounts Per Campaign
   * GET /campaigns/{campaign_id}/email-accounts
   */
  async listEmailAccountsPerCampaign(campaignId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/email-accounts`),
      'list email accounts per campaign'
    );
    return response.data;
  }

  /**
   * Add Email Account To Campaign
   * POST /campaigns/{campaign_id}/email-accounts
   */
  async addEmailAccountToCampaign(
    campaignId: number,
    params: { email_account_id: number }
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/email-accounts`, params),
      'add email account to campaign'
    );
    return response.data;
  }

  /**
   * Remove Email Account From Campaign
   * DELETE /campaigns/{campaign_id}/email-accounts/{email_account_id}
   */
  async removeEmailAccountFromCampaign(
    campaignId: number,
    emailAccountId: number
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/email-accounts/${emailAccountId}`),
      'remove email account from campaign'
    );
    return response.data;
  }

  /**
   * Get All Email Accounts
   * GET /email-accounts
   */
  async getAllEmailAccounts(): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/email-accounts'),
      'get all email accounts'
    );
    return response.data;
  }

  /**
   * Create Email Account
   * POST /email-accounts
   */
  async createEmailAccount(params: EmailAccountRequest): Promise<SuccessResponse> {
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
  async updateEmailAccount(
    emailAccountId: number,
    params: UpdateEmailAccountRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}`, params),
      'update email account'
    );
    return response.data;
  }

  /**
   * Get Email Account By ID
   * GET /email-accounts/{email_account_id}
   */
  async getEmailAccountById(emailAccountId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${emailAccountId}`),
      'get email account by ID'
    );
    return response.data;
  }

  /**
   * Start Email Account Warmup
   * POST /email-accounts/{email_account_id}/warmup
   */
  async startEmailAccountWarmup(
    emailAccountId: number,
    params: WarmupSettings
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}/warmup`, params),
      'start email account warmup'
    );
    return response.data;
  }

  /**
   * Reconnect Failed Email Accounts
   * POST /email-accounts/reconnect
   */
  async reconnectFailedEmailAccounts(params: {
    email_account_ids: number[];
  }): Promise<SuccessResponse> {
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
  async updateEmailAccountTag(
    emailAccountId: number,
    params: { tag: string }
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}/tag`, params),
      'update email account tag'
    );
    return response.data;
  }

  /**
   * Test email account connection
   */
  async testEmailAccountConnection(accountId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${accountId}/test-connection`),
      'test email account connection'
    );
    return response.data;
  }

  /**
   * Get email account warmup status
   */
  async getEmailAccountWarmupStatus(accountId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${accountId}/warmup-status`),
      'get email account warmup status'
    );
    return response.data;
  }

  /**
   * Update email account warmup settings
   */
  async updateEmailAccountWarmupSettings(
    accountId: number,
    params: WarmupSettings
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/email-accounts/${accountId}/warmup-settings`, params),
      'update email account warmup settings'
    );
    return response.data;
  }

  /**
   * Get email account health metrics
   */
  async getEmailAccountHealthMetrics(
    accountId: number,
    params?: EmailAccountHealthParams
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${accountId}/health-metrics`, { params }),
      'get email account health metrics'
    );
    return response.data;
  }

  /**
   * Assign email accounts to campaign
   */
  async assignEmailAccountsToCampaign(
    campaignId: number,
    accountIds: number[]
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post(`/campaigns/${campaignId}/email-accounts/bulk`, {
          email_account_ids: accountIds,
        }),
      'assign email accounts to campaign'
    );
    return response.data;
  }

  /**
   * Remove email accounts from campaign
   */
  async removeEmailAccountsFromCampaign(
    campaignId: number,
    accountIds: number[]
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () =>
        this.apiClient.delete(`/campaigns/${campaignId}/email-accounts/bulk`, {
          data: { email_account_ids: accountIds },
        }),
      'remove email accounts from campaign'
    );
    return response.data;
  }

  /**
   * Update email account warmup
   */
  async updateEmailAccountWarmup(
    emailAccountId: number,
    params: {
      warmup_enabled: boolean;
      warmup_reputation?: number;
      daily_ramp_up?: number;
      reply_rate_percentage?: number;
    }
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}/warmup`, params),
      'update email account warmup'
    );
    return response.data;
  }

  /**
   * Get campaign email accounts
   */
  async getCampaignEmailAccounts(campaignId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/email-accounts`),
      'get campaign email accounts'
    );
    return response.data;
  }

  /**
   * Bulk update email account settings
   */
  async bulkUpdateEmailAccountSettings(
    params: BulkUpdateEmailAccountRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.put('/email-accounts/bulk-update', params),
      'bulk update email account settings'
    );
    return response.data;
  }

  /**
   * Get email account sending limits
   */
  async getEmailAccountSendingLimits(accountId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${accountId}/sending-limits`),
      'get email account sending limits'
    );
    return response.data;
  }

  /**
   * Update email account sending limits
   */
  async updateEmailAccountSendingLimits(
    accountId: number,
    params: SendingLimitsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/email-accounts/${accountId}/sending-limits`, params),
      'update email account sending limits'
    );
    return response.data;
  }
}
