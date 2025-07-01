/**
 * SmartLead MCP Server - Lead Management Client
 *
 * Client module for lead management API endpoints.
 * Handles all lead-related operations including CRUD operations, status management, and messaging.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
import type {
  Lead,
  ListLeadsByCampaignRequest,
  ReplyToLeadFromMasterInboxRequest,
  SuccessResponse,
  UpdateLeadByIdRequest,
} from '../../types.js';

// Additional types for leads client
export interface FetchAllLeadsFromAccountParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
}

export interface FetchLeadsFromGlobalBlocklistParams {
  limit?: number;
  offset?: number;
}

export interface ForwardReplyRequest {
  forward_to_email: string;
  message?: string;
  include_original?: boolean;
}

/**
 * Lead Management Client
 *
 * Provides methods for managing SmartLead leads including:
 * - Adding and updating leads
 * - Managing lead status and categories
 * - Lead messaging and communication
 * - Global blocklist management
 */
export class LeadClient extends BaseSmartLeadClient {
  // ================================
  // LEAD MANAGEMENT METHODS
  // ================================

  /**
   * List all leads by campaign ID
   */
  async listLeadsByCampaign(
    campaignId: number,
    params?: ListLeadsByCampaignRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/leads`, { params }),
      'list leads by campaign'
    );
    return response.data;
  }

  /**
   * Fetch lead categories
   */
  async fetchLeadCategories(): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/categories'),
      'fetch lead categories'
    );
    return response.data;
  }

  /**
   * Fetch lead by email address
   */
  async fetchLeadByEmail(email: string): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/email', { params: { email } }),
      'fetch lead by email'
    );
    return response.data;
  }

  /**
   * Add leads to a campaign by ID
   */
  async addLeadsToCampaign(campaignId: number, leads: Lead[]): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads`, { leads }),
      'add leads to campaign'
    );
    return response.data;
  }

  /**
   * Resume lead by campaign ID
   */
  async resumeLeadByCampaign(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/resume`),
      'resume lead by campaign'
    );
    return response.data;
  }

  /**
   * Pause lead by campaign ID
   */
  async pauseLeadByCampaign(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/pause`),
      'pause lead by campaign'
    );
    return response.data;
  }

  /**
   * Delete lead by campaign ID
   */
  async deleteLeadByCampaign(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/leads/${leadId}`),
      'delete lead by campaign'
    );
    return response.data;
  }

  /**
   * Unsubscribe/Pause lead from campaign
   */
  async unsubscribeLeadFromCampaign(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/unsubscribe`),
      'unsubscribe lead from campaign'
    );
    return response.data;
  }

  /**
   * Unsubscribe lead from all campaigns
   */
  async unsubscribeLeadFromAllCampaigns(leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/leads/${leadId}/unsubscribe-all`),
      'unsubscribe lead from all campaigns'
    );
    return response.data;
  }

  /**
   * Add lead/domain to global block list
   */
  async addLeadToGlobalBlocklist(email: string): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/leads/global-blocklist', { email }),
      'add lead to global blocklist'
    );
    return response.data;
  }

  /**
   * Fetch all leads from entire account
   */
  async fetchAllLeadsFromAccount(
    params?: FetchAllLeadsFromAccountParams
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads', { params }),
      'fetch all leads from account'
    );
    return response.data;
  }

  /**
   * Fetch leads from global block list
   */
  async fetchLeadsFromGlobalBlocklist(
    params?: FetchLeadsFromGlobalBlocklistParams
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/global-blocklist', { params }),
      'fetch leads from global blocklist'
    );
    return response.data;
  }

  /**
   * Update lead using the lead ID
   */
  async updateLeadById(leadId: number, leadData: UpdateLeadByIdRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/leads/${leadId}`, leadData),
      'update lead by ID'
    );
    return response.data;
  }

  /**
   * Update a lead's category based on their campaign
   */
  async updateLeadCategory(
    campaignId: number,
    leadId: number,
    category: string
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/category`, { category }),
      'update lead category'
    );
    return response.data;
  }

  /**
   * Fetch lead message history based on campaign
   */
  async fetchLeadMessageHistory(campaignId: number, leadId: number): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/leads/${leadId}/messages`),
      'fetch lead message history'
    );
    return response.data;
  }

  /**
   * Reply to lead from master inbox via API
   */
  async replyToLeadFromMasterInbox(
    campaignId: number,
    leadId: number,
    message: ReplyToLeadFromMasterInboxRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/reply`, message),
      'reply to lead from master inbox'
    );
    return response.data;
  }

  /**
   * Forward a reply
   */
  async forwardReply(
    campaignId: number,
    leadId: number,
    forwardData: ForwardReplyRequest
  ): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/forward`, forwardData),
      'forward reply'
    );
    return response.data;
  }
}
