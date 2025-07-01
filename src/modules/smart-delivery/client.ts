/**
 * SmartLead MCP Server - Smart Delivery Client
 *
 * Handles all Smart Delivery related operations including placement tests,
 * spam tests, reports, and folder management.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import axios, { type AxiosInstance } from 'axios';
import { BaseSmartLeadClient } from '../../client/base.js';
import type { SmartLeadConfig } from '../../types/config.js';

// Smart Delivery Types
interface Provider {
  provider_id: string;
  provider_name: string;
}

interface ProviderGroup {
  group_id: string;
  group_name: string;
  providers: Provider[];
}

interface RegionProvider {
  region_id: string;
  region_name: string;
  groups: ProviderGroup[];
}

interface SpamTestParams {
  test_name?: string;
  sender_account_ids?: number[];
  email_content?: string;
  subject?: string;
  limit?: number;
  offset?: number;
  status?: string;
  test_type?: string;
}

interface SpamTestDetails {
  spam_test_id: number;
  test_name: string;
  test_type: string;
  status: string;
  created_at: string;
  test_end_date?: string;
  inbox_count: number;
  spam_count: number;
  tab_count: number;
  adjusted_total_email_count: number;
}

interface FolderParams {
  name: string;
  description?: string;
}

interface SmartDeliveryFolder {
  id?: number;
  folder_id?: number;
  name: string;
  description?: string;
  created_at?: string;
}

interface BulkDeleteParams {
  test_ids: number[];
}

interface ReportParams {
  test_id?: number;
  spam_test_id?: number;
  limit?: number;
  offset?: number;
  status?: string;
  date_range?: {
    start_date: string;
    end_date: string;
  };
}

interface SmartDeliveryResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Smart Delivery Client
 *
 * Provides methods for managing SmartLead smart delivery including:
 * - Placement tests (manual and automated)
 * - Spam tests and reports
 * - Folder management
 * - Provider and geo-wise reports
 *
 * Note: Smart Delivery uses a different base URL than the main API
 * Base URL: https://smartdelivery.smartlead.ai/api/v1
 */
export class SmartDeliveryClient extends BaseSmartLeadClient {
  private smartDeliveryClient: AxiosInstance;

  constructor(config: SmartLeadConfig) {
    super(config);

    // Create a separate Axios client for Smart Delivery with the correct base URL
    this.smartDeliveryClient = axios.create({
      baseURL: 'https://smartdelivery.smartlead.ai/api/v1',
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SmartLead-MCP-Server/1.5.0',
      },
    });

    // Add request interceptor for API key authentication
    this.smartDeliveryClient.interceptors.request.use((config) => {
      if (!config.params) {
        config.params = {};
      }
      config.params.api_key = this.config.apiKey;
      return config;
    });
  }

  /**
   * Get region wise provider IDs
   * GET /spam-test/seed/providers
   */
  async getRegionWiseProviderIds(): Promise<RegionProvider[]> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get('/spam-test/seed/providers'),
      'get region wise provider IDs'
    );
    return response.data;
  }

  /**
   * Create a manual placement test
   * POST /spam-test/manual
   */
  async createManualPlacementTest(params: SpamTestParams): Promise<SpamTestDetails> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.post('/spam-test/manual', params),
      'create manual placement test'
    );
    return response.data;
  }

  /**
   * Create an automated placement test
   * POST /spam-test/automated
   */
  async createAutomatedPlacementTest(params: SpamTestParams): Promise<SpamTestDetails> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.post('/spam-test/automated', params),
      'create automated placement test'
    );
    return response.data;
  }

  /**
   * Get spam test details
   * GET /spam-test/{test_id}
   */
  async getSpamTestDetails(testId: number): Promise<SpamTestDetails> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}`),
      'get spam test details'
    );
    return response.data;
  }

  /**
   * Delete smart delivery tests in bulk
   * POST /spam-test/bulk-delete
   */
  async deleteTestsInBulk(params: BulkDeleteParams): Promise<SmartDeliveryResponse> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.post('/spam-test/bulk-delete', params),
      'delete tests in bulk'
    );
    return response.data;
  }

  /**
   * Stop an automated smart delivery test
   * PUT /spam-test/{test_id}/stop
   */
  async stopAutomatedTest(testId: number): Promise<SmartDeliveryResponse> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.put(`/spam-test/${testId}/stop`),
      'stop automated test'
    );
    return response.data;
  }

  /**
   * List all tests
   * POST /spam-test/report
   */
  async listAllTests(params: ReportParams): Promise<SpamTestDetails[]> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.post('/spam-test/report', params),
      'list all tests'
    );
    return response.data;
  }

  /**
   * Get provider wise report
   * POST /spam-test/provider-wise-results
   */
  async getProviderWiseReport(params: ReportParams): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.post('/spam-test/provider-wise-results', params),
      'get provider wise report'
    );
    return response.data;
  }

  /**
   * Get geo wise report
   * POST /spam-test/geo-wise-report
   */
  async getGeoWiseReport(params: ReportParams): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.post('/spam-test/geo-wise-report', params),
      'get geo wise report'
    );
    return response.data;
  }

  /**
   * Get sender account wise report
   * GET /spam-test/sender-account-wise-report
   */
  async getSenderAccountWiseReport(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/sender-account-wise-report?test_id=${testId}`),
      'get sender account wise report'
    );
    return response.data;
  }

  /**
   * Get spam filter report
   * GET /spam-test/{test_id}/spam-filter-report
   */
  async getSpamFilterReport(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/spam-filter-report`),
      'get spam filter report'
    );
    return response.data;
  }

  /**
   * Get DKIM details
   * GET /spam-test/{test_id}/dkim-details
   */
  async getDkimDetails(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/dkim-details`),
      'get DKIM details'
    );
    return response.data;
  }

  /**
   * Get SPF details
   * GET /spam-test/{test_id}/spf-details
   */
  async getSpfDetails(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/spf-details`),
      'get SPF details'
    );
    return response.data;
  }

  /**
   * Get rDNS report
   * GET /spam-test/{test_id}/rdns-report
   */
  async getRdnsReport(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/rdns-report`),
      'get rDNS report'
    );
    return response.data;
  }

  /**
   * Get sender account list
   * GET /spam-test/{test_id}/sender-account-list
   */
  async getSenderAccountList(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/sender-account-list`),
      'get sender account list'
    );
    return response.data;
  }

  /**
   * Get blacklists
   * GET /spam-test/{test_id}/blacklists
   */
  async getBlacklists(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/blacklists`),
      'get blacklists'
    );
    return response.data;
  }

  /**
   * Get domain blacklist
   * GET /spam-test/{test_id}/domain-blacklist
   */
  async getDomainBlacklist(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/domain-blacklist`),
      'get domain blacklist'
    );
    return response.data;
  }

  /**
   * Get spam test email content
   * GET /spam-test/{test_id}/email-content
   */
  async getSpamTestEmailContent(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/email-content`),
      'get spam test email content'
    );
    return response.data;
  }

  /**
   * Get IP blacklist count
   * GET /spam-test/{test_id}/ip-blacklist-count
   */
  async getIpBlacklistCount(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/ip-blacklist-count`),
      'get IP blacklist count'
    );
    return response.data;
  }

  /**
   * Get email reply headers
   * GET /spam-test/{test_id}/email-headers
   */
  async getEmailReplyHeaders(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/email-headers`),
      'get email reply headers'
    );
    return response.data;
  }

  /**
   * Get schedule history for automated tests
   * GET /spam-test/{test_id}/schedule-history
   */
  async getScheduleHistory(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/schedule-history`),
      'get schedule history'
    );
    return response.data;
  }

  /**
   * Get IP details
   * GET /spam-test/{test_id}/ip-details
   */
  async getIpDetails(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/ip-details`),
      'get IP details'
    );
    return response.data;
  }

  /**
   * Get mailbox summary
   * GET /spam-test/{test_id}/mailbox-summary
   */
  async getMailboxSummary(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/mailbox-summary`),
      'get mailbox summary'
    );
    return response.data;
  }

  /**
   * Get mailbox count
   * GET /spam-test/{test_id}/mailbox-count
   */
  async getMailboxCount(testId: number): Promise<unknown> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/${testId}/mailbox-count`),
      'get mailbox count'
    );
    return response.data;
  }

  /**
   * Get all folders
   * GET /spam-test/folder
   */
  async getAllFolders(): Promise<SmartDeliveryFolder[]> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get('/spam-test/folder'),
      'get all folders'
    );
    return response.data;
  }

  /**
   * Create folder
   * POST /spam-test/folder
   */
  async createFolder(params: FolderParams): Promise<SmartDeliveryFolder> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.post('/spam-test/folder', params),
      'create folder'
    );
    return response.data;
  }

  /**
   * Get folder by ID
   * GET /spam-test/folder/{folder_id}
   */
  async getFolderById(folderId: number): Promise<SmartDeliveryFolder> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.get(`/spam-test/folder/${folderId}`),
      'get folder by ID'
    );
    return response.data;
  }

  /**
   * Delete folder
   * DELETE /spam-test/folder/{folder_id}
   */
  async deleteFolder(folderId: number): Promise<SmartDeliveryResponse> {
    const response = await this.withRetry(
      () => this.smartDeliveryClient.delete(`/spam-test/folder/${folderId}`),
      'delete folder'
    );
    return response.data;
  }
}
