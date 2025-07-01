/**
 * SmartLead Webhooks API Client
 *
 * Handles webhook management operations including:
 * - Webhook CRUD operations
 * - Event management and retry logic
 * - Campaign webhook integration
 * - Webhook analytics and monitoring
 */

import { BaseSmartLeadClient } from '../../client/base.js';
import type { SuccessResponse } from '../../types.js';

/**
 * Webhooks Client
 *
 * Provides methods for managing webhooks and webhook events
 * including creation, updates, testing, and analytics.
 */
export class WebhooksClient extends BaseSmartLeadClient {
  // ================================
  // WEBHOOK MANAGEMENT METHODS
  // ================================

  /**
   * Create a new webhook
   */
  async createWebhook(params: Record<string, unknown>): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/webhooks', params),
      'create webhook'
    );
    return response.data;
  }

  /**
   * Get all webhooks
   */
  async getAllWebhooks(params?: Record<string, unknown>): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/webhooks', { params }),
      'get all webhooks'
    );
    return response.data;
  }

  /**
   * Get webhook by ID
   */
  async getWebhookById(webhookId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}`),
      'get webhook by ID'
    );
    return response.data;
  }

  /**
   * Update webhook
   */
  async updateWebhook(
    webhookId: number,
    params: Record<string, unknown>
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/webhooks/${webhookId}`, params),
      'update webhook'
    );
    return response.data;
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/webhooks/${webhookId}`),
      'delete webhook'
    );
    return response.data;
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(webhookId: number, params?: Record<string, unknown>): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/webhooks/${webhookId}/test`, params),
      'test webhook'
    );
    return response.data;
  }

  /**
   * Get webhook events
   */
  async getWebhookEvents(
    webhookId: number,
    params?: Record<string, unknown>
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}/events`, { params }),
      'get webhook events'
    );
    return response.data;
  }

  /**
   * Get webhook event types
   */
  async getWebhookEventTypes(): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/webhooks/event-types'),
      'get webhook event types'
    );
    return response.data;
  }

  /**
   * Retry failed webhook event
   */
  async retryWebhookEvent(webhookId: number, eventId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/webhooks/${webhookId}/events/${eventId}/retry`),
      'retry webhook event'
    );
    return response.data;
  }

  /**
   * Get webhook analytics
   */
  async getWebhookAnalytics(
    webhookId: number,
    params?: Record<string, unknown>
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}/analytics`, { params }),
      'get webhook analytics'
    );
    return response.data;
  }

  /**
   * Enable/disable webhook
   */
  async toggleWebhookStatus(webhookId: number, enabled: boolean): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.patch(`/webhooks/${webhookId}/status`, { enabled }),
      'toggle webhook status'
    );
    return response.data;
  }

  /**
   * Get webhook delivery logs
   */
  async getWebhookDeliveryLogs(
    webhookId: number,
    params?: Record<string, unknown>
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}/delivery-logs`, { params }),
      'get webhook delivery logs'
    );
    return response.data;
  }

  // ================================
  // CAMPAIGN WEBHOOK METHODS
  // ================================

  /**
   * GET /campaigns/{campaign_id}/webhooks
   */
  async getWebhooksByCampaignId(campaignId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/webhooks`),
      'get webhooks by campaign ID'
    );
    return response.data;
  }

  /**
   * POST /campaigns/{campaign_id}/webhooks
   */
  async addOrUpdateCampaignWebhook(
    campaignId: number,
    params: Record<string, unknown>
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/webhooks`, params),
      'add or update campaign webhook'
    );
    return response.data;
  }

  /**
   * DELETE /campaigns/{campaign_id}/webhooks/{webhook_id}
   */
  async deleteCampaignWebhook(campaignId: number, webhookId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/webhooks/${webhookId}`),
      'delete campaign webhook'
    );
    return response.data;
  }

  // ================================
  // WEBHOOK ANALYTICS & MONITORING
  // ================================

  /**
   * GET /webhooks/publish-summary
   */
  async getWebhooksPublishSummary(): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/webhooks/publish-summary'),
      'get webhooks publish summary'
    );
    return response.data;
  }

  /**
   * POST /webhooks/retrigger-failed-events
   */
  async retriggerFailedEvents(params?: Record<string, unknown>): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/webhooks/retrigger-failed-events', params),
      'retrigger failed events'
    );
    return response.data;
  }
}
