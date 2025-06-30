/**
 * SmartLead MCP Server - Campaign Statistics Client
 *
 * Client module for campaign statistics API endpoints.
 * Handles campaign-specific statistics and performance metrics.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
/**
 * Campaign Statistics Client
 *
 * Provides methods for accessing SmartLead campaign statistics including:
 * - Campaign performance metrics
 * - Email delivery statistics
 * - Response and engagement metrics
 * - Time-based analytics
 */
export class StatisticsClient extends BaseSmartLeadClient {
  // ================================
  // CAMPAIGN STATISTICS METHODS
  // ================================

  /**
   * Get campaign statistics
   */
  async getCampaignStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics`, { params }),
      'get campaign statistics'
    );
    return response.data;
  }

  /**
   * Get campaign email statistics
   */
  async getCampaignEmailStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/emails`, { params }),
      'get campaign email statistics'
    );
    return response.data;
  }

  /**
   * Get campaign response statistics
   */
  async getCampaignResponseStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/responses`, { params }),
      'get campaign response statistics'
    );
    return response.data;
  }

  /**
   * Get campaign engagement statistics
   */
  async getCampaignEngagementStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/engagement`, { params }),
      'get campaign engagement statistics'
    );
    return response.data;
  }

  /**
   * Get campaign conversion statistics
   */
  async getCampaignConversionStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/conversions`, { params }),
      'get campaign conversion statistics'
    );
    return response.data;
  }

  /**
   * Get campaign time-based statistics
   */
  async getCampaignTimeBasedStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/time-based`, { params }),
      'get campaign time-based statistics'
    );
    return response.data;
  }

  /**
   * Get campaign deliverability statistics
   */
  async getCampaignDeliverabilityStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/deliverability`, { params }),
      'get campaign deliverability statistics'
    );
    return response.data;
  }

  /**
   * Get campaign sequence statistics
   */
  async getCampaignSequenceStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/sequence`, { params }),
      'get campaign sequence statistics'
    );
    return response.data;
  }

  /**
   * Get campaign lead source statistics
   */
  async getCampaignLeadSourceStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/lead-sources`, { params }),
      'get campaign lead source statistics'
    );
    return response.data;
  }

  /**
   * Get campaign A/B test statistics
   */
  async getCampaignABTestStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/ab-tests`, { params }),
      'get campaign A/B test statistics'
    );
    return response.data;
  }

  /**
   * Export campaign statistics
   */
  async exportCampaignStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/export`, { params }),
      'export campaign statistics'
    );
    return response.data;
  }

  /**
   * Get real-time campaign statistics
   */
  async getRealTimeCampaignStatistics(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/real-time`),
      'get real-time campaign statistics'
    );
    return response.data;
  }

  /**
   * Get campaign comparison statistics
   */
  async getCampaignComparisonStatistics(campaignIds: number[], params?: any): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post('/campaigns/statistics/compare', {
          campaign_ids: campaignIds,
          ...params,
        }),
      'get campaign comparison statistics'
    );
    return response.data;
  }

  /**
   * Get campaign benchmark statistics
   */
  async getCampaignBenchmarkStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/benchmark`, { params }),
      'get campaign benchmark statistics'
    );
    return response.data;
  }

  /**
   * Get campaign statistics by date range
   * GET /campaigns/{campaign_id}/statistics/date-range
   */
  async getCampaignStatisticsByDateRange(campaignId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/date-range`, { params }),
      'get campaign statistics by date range'
    );
    return response.data;
  }

  /**
   * Get warmup stats by email account ID
   * GET /email-accounts/{email_account_id}/warmup-stats
   */
  async getWarmupStatsByEmailAccountId(emailAccountId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${emailAccountId}/warmup-stats`, { params }),
      'get warmup stats by email account ID'
    );
    return response.data;
  }

  /**
   * Get campaign top level analytics
   * GET /campaigns/{campaign_id}/analytics/top-level
   */
  async getCampaignTopLevelAnalytics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/analytics/top-level`, { params }),
      'get campaign top level analytics'
    );
    return response.data;
  }

  /**
   * Get campaign top level analytics by date range
   * GET /campaigns/{campaign_id}/analytics/top-level/date-range
   */
  async getCampaignTopLevelAnalyticsByDateRange(campaignId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.get(`/campaigns/${campaignId}/analytics/top-level/date-range`, { params }),
      'get campaign top level analytics by date range'
    );
    return response.data;
  }

  /**
   * Get campaign lead statistics
   * GET /campaigns/{campaign_id}/statistics/leads
   */
  async getCampaignLeadStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/leads`, { params }),
      'get campaign lead statistics'
    );
    return response.data;
  }

  /**
   * Get campaign mailbox statistics
   * GET /campaigns/{campaign_id}/statistics/mailboxes
   */
  async getCampaignMailboxStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/statistics/mailboxes`, { params }),
      'get campaign mailbox statistics'
    );
    return response.data;
  }
}
