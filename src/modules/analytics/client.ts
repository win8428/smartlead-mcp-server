/**
 * SmartLead MCP Server - Analytics Client
 *
 * Client module for analytics and reporting API endpoints.
 * Handles all analytics-related operations including global stats, campaign analytics, and health metrics.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
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
  SuccessResponse,
} from '../../types.js';

/**
 * Analytics Client
 *
 * Provides methods for accessing SmartLead analytics including:
 * - Global analytics and statistics
 * - Campaign performance metrics
 * - Email health and deliverability metrics
 * - Lead response analytics
 */
export class AnalyticsClient extends BaseSmartLeadClient {
  // ================================
  // GLOBAL ANALYTICS METHODS
  // ================================

  /**
   * Get campaign list for analytics
   */
  async getCampaignList(params?: AnalyticsCampaignListRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign/list', { params }),
      'get analytics campaign list'
    );
    return response.data;
  }

  /**
   * Get client list for analytics
   */
  async getClientList(params?: AnalyticsClientListRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/client/list', { params }),
      'get analytics client list'
    );
    return response.data;
  }

  /**
   * Get month-wise client count
   */
  async getClientMonthWiseCount(
    params?: AnalyticsClientMonthWiseCountRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/client/month-wise-count', { params }),
      'get analytics client month-wise count'
    );
    return response.data;
  }

  /**
   * Get overall stats v2
   */
  async getOverallStatsV2(params?: AnalyticsOverallStatsV2Request): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/overall-stats-v2', { params }),
      'get analytics overall stats v2'
    );
    return response.data;
  }

  /**
   * Get day-wise overall stats
   */
  async getDayWiseOverallStats(
    params?: AnalyticsDayWiseOverallStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/day-wise-overall-stats', { params }),
      'get analytics day-wise overall stats'
    );
    return response.data;
  }

  /**
   * Get day-wise positive reply stats
   */
  async getDayWisePositiveReplyStats(
    params?: AnalyticsDayWiseOverallStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/day-wise-positive-reply-stats', { params }),
      'get analytics day-wise positive reply stats'
    );
    return response.data;
  }

  /**
   * Get campaign overall stats
   */
  async getCampaignOverallStats(
    params?: AnalyticsCampaignOverallStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign/overall-stats', { params }),
      'get analytics campaign overall stats'
    );
    return response.data;
  }

  /**
   * Get client overall stats
   */
  async getClientOverallStats(
    params?: AnalyticsClientOverallStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/client/overall-stats', { params }),
      'get analytics client overall stats'
    );
    return response.data;
  }

  /**
   * Get email-id-wise health metrics
   */
  async getMailboxNameWiseHealthMetrics(
    params?: AnalyticsMailboxNameWiseHealthMetricsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox/name-wise-health-metrics', { params }),
      'get analytics mailbox name-wise health metrics'
    );
    return response.data;
  }

  /**
   * Get domain-wise health metrics
   */
  async getMailboxDomainWiseHealthMetrics(
    params?: AnalyticsMailboxDomainWiseHealthMetricsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox/domain-wise-health-metrics', { params }),
      'get analytics mailbox domain-wise health metrics'
    );
    return response.data;
  }

  /**
   * Get provider-wise overall performance
   */
  async getMailboxProviderWiseOverallPerformance(
    params?: AnalyticsMailboxProviderWiseOverallPerformanceRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox/provider-wise-overall-performance', { params }),
      'get analytics mailbox provider-wise overall performance'
    );
    return response.data;
  }

  /**
   * Get team board overall stats
   */
  async getTeamBoardOverallStats(
    params?: AnalyticsTeamBoardOverallStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/team-board/overall-stats', { params }),
      'get analytics team board overall stats'
    );
    return response.data;
  }

  /**
   * Get lead overall stats
   */
  async getLeadOverallStats(params?: AnalyticsLeadOverallStatsRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/lead/overall-stats', { params }),
      'get analytics lead overall stats'
    );
    return response.data;
  }

  /**
   * Get lead category-wise response
   */
  async getLeadCategoryWiseResponse(
    params?: AnalyticsLeadCategoryWiseResponseRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/lead/category-wise-response', { params }),
      'get analytics lead category-wise response'
    );
    return response.data;
  }

  /**
   * Get leads take for first reply
   */
  async getCampaignLeadsTakeForFirstReply(
    params?: AnalyticsCampaignLeadsTakeForFirstReplyRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign/leads-take-for-first-reply', { params }),
      'get analytics campaign leads take for first reply'
    );
    return response.data;
  }

  /**
   * Get follow-up reply rate
   */
  async getCampaignFollowUpReplyRate(
    params?: AnalyticsCampaignFollowUpReplyRateRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign/follow-up-reply-rate', { params }),
      'get analytics campaign follow-up reply rate'
    );
    return response.data;
  }

  /**
   * Get lead to reply time
   */
  async getCampaignLeadToReplyTime(
    params?: AnalyticsCampaignLeadToReplyTimeRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign/lead-to-reply-time', { params }),
      'get analytics campaign lead to reply time'
    );
    return response.data;
  }

  /**
   * Get campaign response stats
   */
  async getCampaignResponseStats(
    params?: AnalyticsCampaignResponseStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign/response-stats', { params }),
      'get analytics campaign response stats'
    );
    return response.data;
  }

  /**
   * Get campaign status stats
   */
  async getCampaignStatusStats(
    params?: AnalyticsCampaignStatusStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign/status-stats', { params }),
      'get analytics campaign status stats'
    );
    return response.data;
  }

  /**
   * Get mailbox overall stats
   */
  async getMailboxOverallStats(
    params?: AnalyticsMailboxOverallStatsRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox/overall-stats', { params }),
      'get analytics mailbox overall stats'
    );
    return response.data;
  }
}
