/**
 * SmartLead MCP Server - Webhooks Client
 *
 * Client module for webhook management API endpoints.
 * Handles all webhook-related operations including creation, updates, and event management.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
/**
 * Webhooks Client
 *
 * Provides methods for managing SmartLead webhooks including:
 * - Creating and configuring webhooks
 * - Managing webhook events and triggers
 * - Testing webhook endpoints
 * - Webhook analytics and monitoring
 */
export class WebhooksClient extends BaseSmartLeadClient {
  // ================================
  // WEBHOOK MANAGEMENT METHODS
  // ================================

  /**
   * Create a new webhook
   */
  async createWebhook(params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/webhooks', params),
      'create webhook'
    );
    return response.data;
  }

  /**
   * Get all webhooks
   */
  async getAllWebhooks(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/webhooks', { params }),
      'get all webhooks'
    );
    return response.data;
  }

  /**
   * Get webhook by ID
   */
  async getWebhookById(webhookId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}`),
      'get webhook by ID'
    );
    return response.data;
  }

  /**
   * Update webhook
   */
  async updateWebhook(webhookId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/webhooks/${webhookId}`, params),
      'update webhook'
    );
    return response.data;
  }

  /**
   * Delete webhook
   */
  async deleteWebhook(webhookId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/webhooks/${webhookId}`),
      'delete webhook'
    );
    return response.data;
  }

  /**
   * Test webhook endpoint
   */
  async testWebhook(webhookId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/webhooks/${webhookId}/test`, params),
      'test webhook'
    );
    return response.data;
  }

  /**
   * Get webhook events
   */
  async getWebhookEvents(webhookId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}/events`, { params }),
      'get webhook events'
    );
    return response.data;
  }

  /**
   * Get webhook event types
   */
  async getWebhookEventTypes(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/webhooks/event-types'),
      'get webhook event types'
    );
    return response.data;
  }

  /**
   * Retry failed webhook event
   */
  async retryWebhookEvent(webhookId: number, eventId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/webhooks/${webhookId}/events/${eventId}/retry`),
      'retry webhook event'
    );
    return response.data;
  }

  /**
   * Get webhook analytics
   */
  async getWebhookAnalytics(webhookId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}/analytics`, { params }),
      'get webhook analytics'
    );
    return response.data;
  }

  /**
   * Enable/disable webhook
   */
  async toggleWebhookStatus(webhookId: number, enabled: boolean): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.patch(`/webhooks/${webhookId}/status`, { enabled }),
      'toggle webhook status'
    );
    return response.data;
  }

  /**
   * Get webhook delivery logs
   */
  async getWebhookDeliveryLogs(webhookId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/webhooks/${webhookId}/delivery-logs`, { params }),
      'get webhook delivery logs'
    );
    return response.data;
  }

  /**
   * Get webhooks by campaign ID
   * GET /campaigns/{campaign_id}/webhooks
   */
  async getWebhooksByCampaignId(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/webhooks`),
      'get webhooks by campaign ID'
    );
    return response.data;
  }

  /**
   * Add or update campaign webhook
   * POST /campaigns/{campaign_id}/webhooks
   */
  async addOrUpdateCampaignWebhook(campaignId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/webhooks`, params),
      'add or update campaign webhook'
    );
    return response.data;
  }

  /**
   * Delete campaign webhook
   * DELETE /campaigns/{campaign_id}/webhooks/{webhook_id}
   */
  async deleteCampaignWebhook(campaignId: number, webhookId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/webhooks/${webhookId}`),
      'delete campaign webhook'
    );
    return response.data;
  }

  /**
   * Get webhooks publish summary
   * GET /webhooks/publish-summary
   */
  async getWebhooksPublishSummary(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/webhooks/publish-summary', { params }),
      'get webhooks publish summary'
    );
    return response.data;
  }

  /**
   * Retrigger failed webhook events
   * POST /webhooks/retrigger-failed-events
   */
  async retriggerFailedEvents(params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/webhooks/retrigger-failed-events', params),
      'retrigger failed events'
    );
    return response.data;
  }
}
