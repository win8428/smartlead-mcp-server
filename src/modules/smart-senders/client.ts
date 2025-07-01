/**
 * SmartLead MCP Server - Smart Senders Client
 *
 * Client module for smart senders API endpoints.
 * Handles smart sender management and optimization features.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
import type { SuccessResponse } from '../../types.js';

// Smart Senders Type Definitions
export interface DomainSearchRequest {
  domain: string;
}

export interface AutoGenerateMailboxesRequest {
  domain: string;
  count: number;
  vendor_id: number;
  naming_pattern?: string;
}

export interface PlaceOrderRequest {
  domain: string;
  mailboxes: Array<{
    email: string;
    password: string;
  }>;
  vendor_id: number;
}

export interface SenderReputationParams {
  start_date?: string;
  end_date?: string;
  sender_id?: number;
}

export interface SenderRotationSettings {
  rotation_enabled?: boolean;
  rotation_strategy?: 'round_robin' | 'weighted' | 'random';
  rotation_interval?: number;
  sender_weights?: Record<string, number>;
}

export interface SenderPerformanceParams {
  start_date?: string;
  end_date?: string;
  sender_id?: number;
  metrics?: string[];
}

export interface LoadBalancingSettings {
  load_balancing_enabled?: boolean;
  strategy?: 'even_distribution' | 'performance_based' | 'custom';
  custom_weights?: Record<string, number>;
}

export interface SenderHealthParams {
  sender_id?: number;
  health_score_threshold?: number;
  include_inactive?: boolean;
}

export interface OptimizationRecommendations {
  recommendations: Array<{
    type: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    action_required: boolean;
  }>;
}

export interface AnalyticsDashboardParams {
  start_date?: string;
  end_date?: string;
  group_by?: 'sender' | 'domain' | 'campaign';
}

/**
 * Smart Senders Client
 *
 * Provides methods for managing SmartLead smart senders including:
 * - Smart sender configuration and optimization
 * - Sender reputation management
 * - Sender rotation and load balancing
 * - Performance monitoring and analytics
 */
export class SmartSendersClient extends BaseSmartLeadClient {
  // ================================
  // SMART SENDERS METHODS
  // ================================

  /**
   * Search Domain
   * GET /smart-senders/search-domain
   */
  async searchDomain(params: DomainSearchRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/search-domain', { params }),
      'search domain'
    );
    return response.data;
  }

  /**
   * Get Vendors
   * GET /smart-senders/vendors
   */
  async getVendors(): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/vendors'),
      'get vendors'
    );
    return response.data;
  }

  /**
   * Auto-generate-mailboxes
   * POST /smart-senders/auto-generate-mailboxes
   */
  async autoGenerateMailboxes(params: AutoGenerateMailboxesRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/smart-senders/auto-generate-mailboxes', params),
      'auto generate mailboxes'
    );
    return response.data;
  }

  /**
   * Place order for mailboxes
   * POST /smart-senders/place-order
   */
  async placeOrderForMailboxes(params: PlaceOrderRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/smart-senders/place-order', params),
      'place order for mailboxes'
    );
    return response.data;
  }

  /**
   * Get Domain List
   * GET /smart-senders/domains
   */
  async getDomainList(): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/domains'),
      'get domain list'
    );
    return response.data;
  }

  /**
   * Get sender reputation scores
   */
  async getSenderReputationScores(params?: SenderReputationParams): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/reputation-scores', { params }),
      'get sender reputation scores'
    );
    return response.data;
  }

  /**
   * Get sender rotation settings
   */
  async getSenderRotationSettings(campaignId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/smart-senders/rotation-settings`),
      'get sender rotation settings'
    );
    return response.data;
  }

  /**
   * Update sender rotation settings
   */
  async updateSenderRotationSettings(
    campaignId: number,
    params: SenderRotationSettings
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/campaigns/${campaignId}/smart-senders/rotation-settings`, params),
      'update sender rotation settings'
    );
    return response.data;
  }

  /**
   * Get sender performance metrics
   */
  async getSenderPerformanceMetrics(params?: SenderPerformanceParams): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/performance-metrics', { params }),
      'get sender performance metrics'
    );
    return response.data;
  }

  /**
   * Get sender load balancing status
   */
  async getSenderLoadBalancingStatus(campaignId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/smart-senders/load-balancing-status`),
      'get sender load balancing status'
    );
    return response.data;
  }

  /**
   * Update sender load balancing settings
   */
  async updateSenderLoadBalancingSettings(
    campaignId: number,
    params: LoadBalancingSettings
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () =>
        this.apiClient.put(
          `/campaigns/${campaignId}/smart-senders/load-balancing-settings`,
          params
        ),
      'update sender load balancing settings'
    );
    return response.data;
  }

  /**
   * Get sender health monitoring
   */
  async getSenderHealthMonitoring(params?: SenderHealthParams): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/health-monitoring', { params }),
      'get sender health monitoring'
    );
    return response.data;
  }

  /**
   * Get sender optimization recommendations
   */
  async getSenderOptimizationRecommendations(campaignId?: number): Promise<SuccessResponse> {
    const endpoint = campaignId
      ? `/campaigns/${campaignId}/smart-senders/optimization-recommendations`
      : '/smart-senders/optimization-recommendations';
    const response = await this.withRetry(
      () => this.apiClient.get(endpoint),
      'get sender optimization recommendations'
    );
    return response.data;
  }

  /**
   * Apply sender optimization recommendations
   */
  async applySenderOptimizationRecommendations(
    campaignId: number,
    params: OptimizationRecommendations
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post(`/campaigns/${campaignId}/smart-senders/apply-optimization`, params),
      'apply sender optimization recommendations'
    );
    return response.data;
  }

  /**
   * Get sender analytics dashboard
   */
  async getSenderAnalyticsDashboard(params?: AnalyticsDashboardParams): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/analytics-dashboard', { params }),
      'get sender analytics dashboard'
    );
    return response.data;
  }

  /**
   * Reset sender reputation
   */
  async resetSenderReputation(senderId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/smart-senders/${senderId}/reset-reputation`),
      'reset sender reputation'
    );
    return response.data;
  }

  /**
   * Pause smart sender
   */
  async pauseSmartSender(senderId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/smart-senders/${senderId}/pause`),
      'pause smart sender'
    );
    return response.data;
  }

  /**
   * Resume smart sender
   */
  async resumeSmartSender(senderId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/smart-senders/${senderId}/resume`),
      'resume smart sender'
    );
    return response.data;
  }
}
