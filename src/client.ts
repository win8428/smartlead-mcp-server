/**
 * SmartLead MCP Server - API Client
 *
 * A robust HTTP client for the SmartLead API with comprehensive error handling,
 * retry logic, rate limiting, and type safety. This client provides a clean
 * interface to all SmartLead API endpoints with production-ready features.
 *
 * Features:
 * - Exponential backoff retry logic
 * - Rate limiting and request queuing
 * - Comprehensive error handling and classification
 * - Request/response logging and debugging
 * - Type-safe parameter validation
 * - Connection testing and health checks
 *
 * @author LeadMagic Team
 * @version 1.0.0
 */

import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import type { SmartLeadConfig } from './types.js';

// ================================
// ERROR HANDLING CLASSES
// ================================

/**
 * Custom error class for SmartLead API errors
 * Provides detailed error information and classification
 */
export class SmartLeadError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly response?: unknown;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    code: string = 'UNKNOWN_ERROR',
    status: number = 500,
    response?: unknown,
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'SmartLeadError';
    this.code = code;
    this.status = status;
    this.response = response;
    this.isRetryable = isRetryable;

    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SmartLeadError);
    }
  }

  /**
   * Check if this is a client error (4xx status codes)
   */
  isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  /**
   * Check if this is a server error (5xx status codes)
   */
  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * Check if this is a network error
   */
  isNetworkError(): boolean {
    return this.code === 'NETWORK_ERROR' || this.code === 'TIMEOUT_ERROR';
  }

  /**
   * Check if this error should trigger a retry
   */
  shouldRetry(): boolean {
    return this.isRetryable || this.isServerError() || this.isNetworkError();
  }
}

// ================================
// SMARTLEAD API CLIENT
// ================================

/**
 * SmartLead API Client
 *
 * Provides a comprehensive interface to the SmartLead API with robust error handling,
 * retry logic, and type safety. All methods return properly typed responses and
 * handle errors gracefully.
 */
export class SmartLeadClient {
  private readonly apiClient: AxiosInstance;
  private readonly config: Required<SmartLeadConfig>;
  private requestCount = 0;
  private rateLimitResetTime = 0;

  /**
   * Creates a new SmartLead API client
   *
   * @param config - Client configuration including API key and optional settings
   * @throws {SmartLeadError} If configuration is invalid
   */
  constructor(config: SmartLeadConfig) {
    // Validate required configuration
    if (!config.apiKey || typeof config.apiKey !== 'string' || config.apiKey.trim().length === 0) {
      throw new SmartLeadError('Valid SmartLead API key is required', 'INVALID_CONFIG', 400);
    }

    // Set default configuration values
    this.config = {
      apiKey: config.apiKey.trim(),
      baseUrl: config.baseUrl || 'https://server.smartlead.ai/api/v1',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      rateLimit: config.rateLimit || 100, // 100 requests per minute default
    };

    // Initialize Axios client with configuration
    this.apiClient = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SmartLead-MCP-Server/1.0.0',
      },
      params: {
        api_key: this.config.apiKey,
      },
    });

    // Set up request and response interceptors
    this.setupInterceptors();
  }

  /**
   * Rate limiting: Check if we can make a request now
   * @private
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();

    // Reset counter if a minute has passed
    if (now > this.rateLimitResetTime) {
      this.requestCount = 0;
      this.rateLimitResetTime = now + 60000; // Next minute
    }

    // Check if we've exceeded the rate limit
    if (this.requestCount >= this.config.rateLimit) {
      const waitTime = this.rateLimitResetTime - now;
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.rateLimitResetTime = Date.now() + 60000;
      }
    }

    this.requestCount++;
  }

  /**
   * Parse rate limit info from response headers
   * @private
   */
  private parseRateLimitHeaders(response: AxiosResponse): void {
    const remaining = response.headers['x-ratelimit-remaining'];
    const reset = response.headers['x-ratelimit-reset'];
    const limit = response.headers['x-ratelimit-limit'];

    if (remaining !== undefined) {
      const remainingRequests = parseInt(remaining, 10);
      if (remainingRequests === 0 && reset) {
        const resetTime = parseInt(reset, 10) * 1000; // Convert to milliseconds
        this.rateLimitResetTime = resetTime;
      }
    }

    if (limit !== undefined) {
      const rateLimitFromHeader = parseInt(limit, 10);
      if (rateLimitFromHeader > 0) {
        // Update our rate limit based on server response
        this.config.rateLimit = rateLimitFromHeader;
      }
    }
  }

  /**
   * Sets up Axios interceptors for request/response handling
   * @private
   */
  private setupInterceptors(): void {
    // Request interceptor for rate limiting and logging
    this.apiClient.interceptors.request.use(
      async (config) => {
        // Apply rate limiting
        await this.checkRateLimit();

        // Log request in debug mode
        if (process.env.DEBUG === 'true') {
          console.log(`[SmartLead API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[SmartLead API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for rate limit parsing and error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        // Parse rate limit headers
        this.parseRateLimitHeaders(response);

        // Log response in debug mode
        if (process.env.DEBUG === 'true') {
          console.log(`[SmartLead API] Response ${response.status} from ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        // Parse rate limit headers from error response
        if (error.response) {
          this.parseRateLimitHeaders(error.response);
        }

        console.error('[SmartLead API] Response error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Handles Axios errors and converts them to SmartLeadError instances
   * @private
   */
  private handleAxiosError(error: AxiosError): SmartLeadError {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;
      const message = data?.message || data?.error || error.message || 'API request failed';

      // Determine if error is retryable
      const isRetryable = status === 429 || status >= 500;

      return new SmartLeadError(message, `HTTP_${status}`, status, data, isRetryable);
    } else if (error.request) {
      // Request was made but no response received
      return new SmartLeadError(
        'Network error: No response received from server',
        'NETWORK_ERROR',
        0,
        undefined,
        true
      );
    } else if (error.code === 'ECONNABORTED') {
      // Request timeout
      return new SmartLeadError(
        `Request timeout after ${this.config.timeout}ms`,
        'TIMEOUT_ERROR',
        408,
        undefined,
        true
      );
    } else {
      // Something else happened
      return new SmartLeadError(
        error.message || 'Unknown error occurred',
        'UNKNOWN_ERROR',
        500,
        undefined,
        false
      );
    }
  }

  /**
   * Implements exponential backoff retry logic
   * @private
   */
  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Executes a request with retry logic
   * @private
   */
  private async withRetry<T>(
    operation: () => Promise<AxiosResponse<T>>,
    context: string,
    attempt: number = 1
  ): Promise<AxiosResponse<T>> {
    try {
      return await operation();
    } catch (error) {
      if (
        error instanceof SmartLeadError &&
        error.shouldRetry() &&
        attempt < this.config.maxRetries
      ) {
        const delayMs = Math.min(
          this.config.retryDelay * 2 ** (attempt - 1),
          10000 // Max 10 second delay
        );

        console.error(
          `[SmartLead API] ${context} failed (attempt ${attempt}/${this.config.maxRetries}). ` +
            `Retrying in ${delayMs}ms. Error: ${error.message}`
        );

        await this.delay(delayMs);
        return this.withRetry(operation, context, attempt + 1);
      }
      throw error;
    }
  }

  // ================================
  // COMPREHENSIVE CAMPAIGN ANALYTICS
  // ================================

  /**
   * Get campaigns with analytics - Combined endpoint for efficiency
   * Fetches campaigns and their analytics in one call to reduce API usage
   *
   * @param options - Filtering and pagination options
   * @returns Promise resolving to campaigns with analytics data
   */
  async getCampaignsWithAnalytics(
    options: {
      client_id?: string;
      status?: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DRAFT';
      limit?: number;
      offset?: number;
      start_date?: string;
      end_date?: string;
    } = {}
  ): Promise<any> {
    try {
      // First get campaigns with filtering
      const campaigns = await this.listCampaigns(options);

      if (!Array.isArray(campaigns) || campaigns.length === 0) {
        return { campaigns: [], analytics: {} };
      }

      // Get analytics for each campaign
      const analyticsPromises = campaigns.map(async (campaign: any) => {
        try {
          const startDate = options.start_date || '2024-01-01';
          const endDate = options.end_date || new Date().toISOString().split('T')[0];
          const analytics = await this.getCampaignAnalyticsByDate(
            campaign.id,
            startDate,
            endDate as string
          );
          return { campaignId: campaign.id, analytics };
        } catch (error) {
          console.warn(`Failed to get analytics for campaign ${campaign.id}:`, error);
          return { campaignId: campaign.id, analytics: null };
        }
      });

      const analyticsResults = await Promise.all(analyticsPromises);
      const analyticsMap = analyticsResults.reduce((acc: any, result) => {
        acc[result.campaignId] = result.analytics;
        return acc;
      }, {});

      return {
        campaigns: campaigns.map((campaign: any) => ({
          ...campaign,
          analytics: analyticsMap[campaign.id],
        })),
        summary: {
          total_campaigns: campaigns.length,
          active_campaigns: campaigns.filter((c: any) => c.status === 'ACTIVE').length,
          paused_campaigns: campaigns.filter((c: any) => c.status === 'PAUSED').length,
          completed_campaigns: campaigns.filter((c: any) => c.status === 'COMPLETED').length,
        },
      };
    } catch (error) {
      throw this.handleAxiosError(error as AxiosError);
    }
  }

  // ================================
  // CAMPAIGN MANAGEMENT METHODS (13+ endpoints)
  // ================================

  /**
   * Create a new campaign
   */
  async createCampaign(params: { name: string; client_id?: number }): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/campaigns/create', params),
      'create campaign'
    );
    return response.data;
  }

  /**
   * Update campaign schedule
   */
  async updateCampaignSchedule(campaignId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/schedule`, params),
      'update campaign schedule'
    );
    return response.data;
  }

  /**
   * Update campaign settings
   */
  async updateCampaignSettings(campaignId: number, params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/settings`, params),
      'update campaign settings'
    );
    return response.data;
  }

  /**
   * Update campaign status
   */
  async updateCampaignStatus(campaignId: number, status: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/status`, { status }),
      'update campaign status'
    );
    return response.data;
  }

  /**
   * Get campaign details
   */
  async getCampaign(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}`),
      'get campaign'
    );
    return response.data;
  }

  /**
   * List campaigns
   */
  async listCampaigns(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/campaigns', { params }),
      'list campaigns'
    );
    return response.data;
  }

  /**
   * Save campaign sequence
   */
  async saveCampaignSequence(campaignId: number, sequence: any[]): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/sequences`, { sequence }),
      'save campaign sequence'
    );
    return response.data;
  }

  /**
   * Get campaign sequence
   */
  async getCampaignSequence(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/sequences`),
      'get campaign sequence'
    );
    return response.data;
  }

  // ================================
  // LEAD MANAGEMENT METHODS
  // ================================

  /**
   * List leads with filtering options
   */
  async listLeads(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads', { params }),
      'list leads'
    );
    return response.data;
  }

  /**
   * Get lead details by ID
   */
  async getLead(leadId: number): Promise<any> {
    const response = await this.withRetry(() => this.apiClient.get(`/leads/${leadId}`), 'get lead');
    return response.data;
  }

  /**
   * Add a lead to campaign
   */
  async addLeadToCampaign(campaignId: number, leadData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads`, leadData),
      'add lead to campaign'
    );
    return response.data;
  }

  /**
   * Update lead information
   */
  async updateLead(leadId: number, leadData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/leads/${leadId}`, leadData),
      'update lead'
    );
    return response.data;
  }

  /**
   * Update lead status
   */
  async updateLeadStatus(leadId: number, status: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.patch(`/leads/${leadId}/status`, { status }),
      'update lead status'
    );
    return response.data;
  }

  /**
   * Bulk import leads to campaign
   */
  async bulkImportLeads(campaignId: number, leads: any[]): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/bulk`, { leads }),
      'bulk import leads'
    );
    return response.data;
  }

  /**
   * Delete a lead
   */
  async deleteLead(leadId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/leads/${leadId}`),
      'delete lead'
    );
    return response.data;
  }

  // ================================
  // ANALYTICS AND STATISTICS METHODS
  // ================================

  /**
   * Get campaign analytics by date range
   */
  async getCampaignAnalyticsByDate(
    campaignId: number,
    startDate: string,
    endDate: string
  ): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.get(`/campaigns/${campaignId}/analytics`, {
          params: { start_date: startDate, end_date: endDate },
        }),
      'get campaign analytics by date'
    );
    return response.data;
  }

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
   * Get warmup stats by email
   */
  async getWarmupStatsByEmail(emailAccountId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${emailAccountId}/warmup-stats`),
      'get warmup stats by email'
    );
    return response.data;
  }

  /**
   * Get campaign top level analytics
   */
  async getCampaignTopLevelAnalytics(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/analytics/top-level`),
      'get campaign top level analytics'
    );
    return response.data;
  }

  /**
   * Get campaign lead statistics
   */
  async getCampaignLeadStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/lead-statistics`, { params }),
      'get campaign lead statistics'
    );
    return response.data;
  }

  /**
   * Get campaign mailbox statistics
   */
  async getCampaignMailboxStatistics(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/mailbox-statistics`, { params }),
      'get campaign mailbox statistics'
    );
    return response.data;
  }

  // ================================
  // WEBHOOK MANAGEMENT METHODS
  // ================================

  /**
   * Fetch webhooks by campaign
   */
  async fetchWebhooksByCampaign(campaignId: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/webhooks`),
      'fetch webhooks by campaign'
    );
    return response.data;
  }

  /**
   * Upsert campaign webhook
   */
  async upsertCampaignWebhook(campaignId: string, webhookData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/webhooks`, webhookData),
      'upsert campaign webhook'
    );
    return response.data;
  }

  /**
   * Delete campaign webhook
   */
  async deleteCampaignWebhook(campaignId: string, webhookId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/webhooks/${webhookId}`),
      'delete campaign webhook'
    );
    return response.data;
  }

  /**
   * Get webhook publish summary
   */
  async getWebhookPublishSummary(campaignId: string, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/webhooks/publish-summary`, { params }),
      'get webhook publish summary'
    );
    return response.data;
  }

  /**
   * Retrigger failed webhook events
   */
  async retriggerFailedEvents(campaignId: string, fromTime: string, toTime: string): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post(`/campaigns/${campaignId}/webhooks/retrigger`, { fromTime, toTime }),
      'retrigger failed events'
    );
    return response.data;
  }

  // ================================
  // SMART DELIVERY METHODS
  // ================================

  /**
   * Get region wise providers
   */
  async getRegionWiseProviders(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-delivery/providers'),
      'get region wise providers'
    );
    return response.data;
  }

  /**
   * Create manual placement test
   */
  async createManualPlacementTest(testData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/smart-delivery/tests/manual', testData),
      'create manual placement test'
    );
    return response.data;
  }

  /**
   * Create automated placement test
   */
  async createAutomatedPlacementTest(testData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/smart-delivery/tests/automated', testData),
      'create automated placement test'
    );
    return response.data;
  }

  /**
   * Get spam test details
   */
  async getSpamTestDetails(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}`),
      'get spam test details'
    );
    return response.data;
  }

  /**
   * Delete smart delivery tests
   */
  async deleteSmartDeliveryTests(spamTestIds: number[]): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete('/smart-delivery/tests', { data: { spamTestIds } }),
      'delete smart delivery tests'
    );
    return response.data;
  }

  /**
   * List all tests
   */
  async listAllTests(testType: string, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${testType}`, { params }),
      'list all tests'
    );
    return response.data;
  }

  /**
   * Create folder
   */
  async createFolder(name: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/smart-delivery/folders', { name }),
      'create folder'
    );
    return response.data;
  }

  /**
   * Get folder by ID
   */
  async getFolderById(folderId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/folders/${folderId}`),
      'get folder by ID'
    );
    return response.data;
  }

  /**
   * Delete folder
   */
  async deleteFolder(folderId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/smart-delivery/folders/${folderId}`),
      'delete folder'
    );
    return response.data;
  }

  /**
   * Get all folders
   */
  async getAllFolders(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-delivery/folders', { params }),
      'get all folders'
    );
    return response.data;
  }

  /**
   * Stop automated test
   */
  async stopAutomatedTest(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/smart-delivery/tests/${spamTestId}/stop`),
      'stop automated test'
    );
    return response.data;
  }

  /**
   * Get provider wise report
   */
  async getProviderWiseReport(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/reports/provider-wise`),
      'get provider wise report'
    );
    return response.data;
  }

  /**
   * Get group wise report
   */
  async getGroupWiseReport(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/reports/group-wise`),
      'get group wise report'
    );
    return response.data;
  }

  /**
   * Get sender account wise report
   */
  async getSenderAccountWiseReport(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/reports/sender-account-wise`),
      'get sender account wise report'
    );
    return response.data;
  }

  /**
   * Get spam filter details
   */
  async getSpamFilterDetails(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/spam-filter-details`),
      'get spam filter details'
    );
    return response.data;
  }

  /**
   * Get DKIM details
   */
  async getDkimDetails(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/dkim-details`),
      'get DKIM details'
    );
    return response.data;
  }

  /**
   * Get SPF details
   */
  async getSpfDetails(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/spf-details`),
      'get SPF details'
    );
    return response.data;
  }

  /**
   * Get rDNS details
   */
  async getRdnsDetails(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/rdns-details`),
      'get rDNS details'
    );
    return response.data;
  }

  /**
   * Get sender accounts for spam test
   */
  async getSenderAccounts(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/sender-accounts`),
      'get sender accounts'
    );
    return response.data;
  }

  /**
   * Get blacklist information
   */
  async getBlacklist(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/blacklist`),
      'get blacklist'
    );
    return response.data;
  }

  /**
   * Get email content
   */
  async getEmailContent(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/email-content`),
      'get email content'
    );
    return response.data;
  }

  /**
   * Get IP analytics
   */
  async getIpAnalytics(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/ip-analytics`),
      'get IP analytics'
    );
    return response.data;
  }

  /**
   * Get email headers
   */
  async getEmailHeaders(spamTestId: number, replyId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/emails/${replyId}/headers`),
      'get email headers'
    );
    return response.data;
  }

  /**
   * Get schedule history
   */
  async getScheduleHistory(spamTestId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/schedule-history`),
      'get schedule history'
    );
    return response.data;
  }

  /**
   * Get IP details
   */
  async getIpDetails(spamTestId: number, replyId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/smart-delivery/tests/${spamTestId}/emails/${replyId}/ip-details`),
      'get IP details'
    );
    return response.data;
  }

  /**
   * Get mailbox summary
   */
  async getMailboxSummary(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-delivery/mailbox-summary', { params }),
      'get mailbox summary'
    );
    return response.data;
  }

  /**
   * Get mailbox count
   */
  async getMailboxCount(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-delivery/mailbox-count'),
      'get mailbox count'
    );
    return response.data;
  }

  // ================================
  // LEAD MANAGEMENT METHODS (17+ endpoints)
  // ================================

  /**
   * List leads by campaign ID
   */
  async listLeadsByCampaign(campaignId: number, params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/leads`, { params }),
      'list leads by campaign'
    );
    return response.data;
  }

  /**
   * Fetch lead categories
   */
  async fetchLeadCategories(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/categories'),
      'fetch lead categories'
    );
    return response.data;
  }

  /**
   * Fetch lead by email address
   */
  async fetchLeadByEmail(email: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/leads/email/${email}`),
      'fetch lead by email'
    );
    return response.data;
  }

  /**
   * Add leads to campaign
   */
  async addLeadsToCampaign(campaignId: number, leads: any[]): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads`, { leads }),
      'add leads to campaign'
    );
    return response.data;
  }

  /**
   * Resume lead by campaign ID
   */
  async resumeLeadByCampaign(campaignId: number, leadId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/resume`),
      'resume lead by campaign'
    );
    return response.data;
  }

  /**
   * Pause lead by campaign ID
   */
  async pauseLeadByCampaign(campaignId: number, leadId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/pause`),
      'pause lead by campaign'
    );
    return response.data;
  }

  /**
   * Delete lead by campaign ID
   */
  async deleteLeadByCampaign(campaignId: number, leadId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/campaigns/${campaignId}/leads/${leadId}`),
      'delete lead by campaign'
    );
    return response.data;
  }

  /**
   * Unsubscribe/Pause lead from campaign
   */
  async unsubscribeLeadFromCampaign(campaignId: number, leadId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/unsubscribe`),
      'unsubscribe lead from campaign'
    );
    return response.data;
  }

  /**
   * Unsubscribe lead from all campaigns
   */
  async unsubscribeLeadFromAllCampaigns(leadId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/leads/${leadId}/unsubscribe-all`),
      'unsubscribe lead from all campaigns'
    );
    return response.data;
  }

  /**
   * Add lead/domain to global block list
   */
  async addLeadToGlobalBlocklist(email: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/leads/global-blocklist', { email }),
      'add lead to global blocklist'
    );
    return response.data;
  }

  /**
   * Fetch all leads from entire account
   */
  async fetchAllLeadsFromAccount(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/global', { params }),
      'fetch all leads from account'
    );
    return response.data;
  }

  /**
   * Fetch leads from global block list
   */
  async fetchLeadsFromGlobalBlocklist(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/leads/global-blocklist', { params }),
      'fetch leads from global blocklist'
    );
    return response.data;
  }

  /**
   * Update lead using lead ID
   */
  async updateLeadById(leadId: number, leadData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/leads/${leadId}`, leadData),
      'update lead by ID'
    );
    return response.data;
  }

  /**
   * Update lead's category based on their campaign
   */
  async updateLeadCategory(campaignId: number, leadId: number, category: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/campaigns/${campaignId}/leads/${leadId}/category`, { category }),
      'update lead category'
    );
    return response.data;
  }

  /**
   * Fetch lead message history based on campaign
   */
  async fetchLeadMessageHistory(campaignId: number, leadId: number): Promise<any> {
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
    replyData: any
  ): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/reply`, replyData),
      'reply to lead from master inbox'
    );
    return response.data;
  }

  /**
   * Forward a reply
   */
  async forwardReply(campaignId: number, leadId: number, forwardData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/campaigns/${campaignId}/leads/${leadId}/forward`, forwardData),
      'forward reply'
    );
    return response.data;
  }

  // ================================
  // EMAIL ACCOUNT MANAGEMENT METHODS (10+ endpoints)
  // ================================

  /**
   * List all email accounts per campaign
   */
  async listEmailAccountsPerCampaign(campaignId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/email-accounts`),
      'list email accounts per campaign'
    );
    return response.data;
  }

  /**
   * Add email account to campaign
   */
  async addEmailAccountToCampaign(campaignId: number, emailAccountId: number): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post(`/campaigns/${campaignId}/email-accounts`, {
          email_account_id: emailAccountId,
        }),
      'add email account to campaign'
    );
    return response.data;
  }

  /**
   * Remove email account from campaign
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
   */
  async fetchAllEmailAccounts(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/email-accounts'),
      'fetch all email accounts'
    );
    return response.data;
  }

  /**
   * Create an email account
   */
  async createEmailAccount(emailAccountData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/email-accounts', emailAccountData),
      'create email account'
    );
    return response.data;
  }

  /**
   * Update email account
   */
  async updateEmailAccount(emailAccountId: number, emailAccountData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/email-accounts/${emailAccountId}`, emailAccountData),
      'update email account'
    );
    return response.data;
  }

  /**
   * Fetch email account by ID
   */
  async fetchEmailAccountById(emailAccountId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/email-accounts/${emailAccountId}`),
      'fetch email account by ID'
    );
    return response.data;
  }

  /**
   * Add/Update warmup to email account
   */
  async addUpdateWarmupToEmailAccount(emailAccountId: number, warmupData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/email-accounts/${emailAccountId}/warmup`, warmupData),
      'add/update warmup to email account'
    );
    return response.data;
  }

  /**
   * Reconnect failed email accounts
   */
  async reconnectFailedEmailAccounts(emailAccountIds: number[]): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.post('/email-accounts/reconnect', { email_account_ids: emailAccountIds }),
      'reconnect failed email accounts'
    );
    return response.data;
  }

  /**
   * Update email account tag
   */
  async updateEmailAccountTag(emailAccountId: number, tag: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/email-accounts/${emailAccountId}/tag`, { tag }),
      'update email account tag'
    );
    return response.data;
  }

  // ================================
  // CLIENT MANAGEMENT METHODS
  // ================================

  /**
   * Add client
   */
  async addClient(clientData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/clients', clientData),
      'add client'
    );
    return response.data;
  }

  /**
   * Fetch all clients
   */
  async fetchAllClients(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/clients'),
      'fetch all clients'
    );
    return response.data;
  }

  /**
   * Create new client API key
   */
  async createNewClientApiKey(clientId: number, keyData: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post(`/clients/${clientId}/api-keys`, keyData),
      'create new client API key'
    );
    return response.data;
  }

  /**
   * Get client's API keys
   */
  async getClientsApiKeys(clientId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/clients/${clientId}/api-keys`),
      'get client API keys'
    );
    return response.data;
  }

  /**
   * Delete client API key
   */
  async deleteClientApiKey(clientId: number, keyId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/clients/${clientId}/api-keys/${keyId}`),
      'delete client API key'
    );
    return response.data;
  }

  /**
   * Reset client API key
   */
  async resetClientApiKey(clientId: number, keyId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/clients/${clientId}/api-keys/${keyId}/reset`),
      'reset client API key'
    );
    return response.data;
  }

  // ================================
  // SMART SENDERS METHODS
  // ================================

  /**
   * Get vendors
   */
  async getVendors(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/vendors'),
      'get vendors'
    );
    return response.data;
  }

  /**
   * Search domain
   */
  async searchDomain(domainName: string, vendorId: number): Promise<any> {
    const response = await this.withRetry(
      () =>
        this.apiClient.get('/smart-senders/search-domain', {
          params: { domain_name: domainName, vendor_id: vendorId },
        }),
      'search domain'
    );
    return response.data;
  }

  /**
   * Auto generate mailboxes
   */
  async autoGenerateMailboxes(data: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/smart-senders/auto-generate-mailboxes', data),
      'auto generate mailboxes'
    );
    return response.data;
  }

  /**
   * Place order for mailboxes
   */
  async placeOrderMailboxes(data: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/smart-senders/place-order', data),
      'place order mailboxes'
    );
    return response.data;
  }

  /**
   * Get domain list
   */
  async getDomainList(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/smart-senders/domains'),
      'get domain list'
    );
    return response.data;
  }

  // ================================
  // ADDITIONAL STATISTICS METHODS
  // ================================

  /**
   * Download campaign data (supports CSV format)
   */
  async downloadCampaignData(
    campaignId: number,
    downloadType: string,
    format: 'json' | 'csv' = 'json',
    userId?: string
  ): Promise<any> {
    const params: any = {
      download_type: downloadType,
      format,
    };
    if (userId) params.user_id = userId;

    const response = await this.withRetry(
      () =>
        this.apiClient.get(`/campaigns/${campaignId}/download`, {
          params,
          responseType: format === 'csv' ? 'blob' : 'json',
        }),
      'download campaign data'
    );

    if (format === 'csv') {
      // Return blob data for CSV downloads
      return response.data;
    }
    return response.data;
  }

  /**
   * View download statistics
   */
  async viewDownloadStatistics(timePeriod?: string, groupBy?: string): Promise<any> {
    const params: any = {};
    if (timePeriod) params.time_period = timePeriod;
    if (groupBy) params.group_by = groupBy;

    const response = await this.withRetry(
      () => this.apiClient.get('/download-statistics', { params }),
      'view download statistics'
    );
    return response.data;
  }

  // ================================
  // GLOBAL ANALYTICS METHODS (20+ endpoints)
  // ================================

  /**
   * Get campaign list for analytics
   */
  async getAnalyticsCampaignList(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign-list', { params }),
      'get analytics campaign list'
    );
    return response.data;
  }

  /**
   * Get client list for analytics
   */
  async getAnalyticsClientList(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/client-list', { params }),
      'get analytics client list'
    );
    return response.data;
  }

  /**
   * Get month-wise client count
   */
  async getAnalyticsClientMonthWiseCount(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/client-month-wise-count', { params }),
      'get analytics client month-wise count'
    );
    return response.data;
  }

  /**
   * Get overall stats v2
   */
  async getAnalyticsOverallStatsV2(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/overall-stats-v2', { params }),
      'get analytics overall stats v2'
    );
    return response.data;
  }

  /**
   * Get day-wise overall stats
   */
  async getAnalyticsDayWiseOverallStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/day-wise-overall-stats', { params }),
      'get analytics day-wise overall stats'
    );
    return response.data;
  }

  /**
   * Get day-wise positive reply stats
   */
  async getAnalyticsDayWisePositiveReplyStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/day-wise-positive-reply-stats', { params }),
      'get analytics day-wise positive reply stats'
    );
    return response.data;
  }

  /**
   * Get campaign overall stats
   */
  async getAnalyticsCampaignOverallStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign-overall-stats', { params }),
      'get analytics campaign overall stats'
    );
    return response.data;
  }

  /**
   * Get client overall stats
   */
  async getAnalyticsClientOverallStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/client-overall-stats', { params }),
      'get analytics client overall stats'
    );
    return response.data;
  }

  /**
   * Get email-id-wise health metrics
   */
  async getAnalyticsMailboxNameWiseHealthMetrics(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox-name-wise-health-metrics', { params }),
      'get analytics mailbox name-wise health metrics'
    );
    return response.data;
  }

  /**
   * Get domain-wise health metrics
   */
  async getAnalyticsMailboxDomainWiseHealthMetrics(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox-domain-wise-health-metrics', { params }),
      'get analytics mailbox domain-wise health metrics'
    );
    return response.data;
  }

  /**
   * Get provider-wise overall performance
   */
  async getAnalyticsMailboxProviderWiseOverallPerformance(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox-provider-wise-overall-performance', { params }),
      'get analytics mailbox provider-wise overall performance'
    );
    return response.data;
  }

  /**
   * Get team board overall stats
   */
  async getAnalyticsTeamBoardOverallStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/team-board-overall-stats', { params }),
      'get analytics team board overall stats'
    );
    return response.data;
  }

  /**
   * Get lead overall stats
   */
  async getAnalyticsLeadOverallStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/lead-overall-stats', { params }),
      'get analytics lead overall stats'
    );
    return response.data;
  }

  /**
   * Get lead category-wise response
   */
  async getAnalyticsLeadCategoryWiseResponse(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/lead-category-wise-response', { params }),
      'get analytics lead category-wise response'
    );
    return response.data;
  }

  /**
   * Get leads take for first reply
   */
  async getAnalyticsCampaignLeadsTakeForFirstReply(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign-leads-take-for-first-reply', { params }),
      'get analytics campaign leads take for first reply'
    );
    return response.data;
  }

  /**
   * Get follow-up reply rate
   */
  async getAnalyticsCampaignFollowUpReplyRate(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign-follow-up-reply-rate', { params }),
      'get analytics campaign follow-up reply rate'
    );
    return response.data;
  }

  /**
   * Get lead to reply time
   */
  async getAnalyticsCampaignLeadToReplyTime(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign-lead-to-reply-time', { params }),
      'get analytics campaign lead to reply time'
    );
    return response.data;
  }

  /**
   * Get campaign response stats
   */
  async getAnalyticsCampaignResponseStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign-response-stats', { params }),
      'get analytics campaign response stats'
    );
    return response.data;
  }

  /**
   * Get campaign status stats
   */
  async getAnalyticsCampaignStatusStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/campaign-status-stats', { params }),
      'get analytics campaign status stats'
    );
    return response.data;
  }

  /**
   * Get mailbox overall stats
   */
  async getAnalyticsMailboxOverallStats(params?: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/analytics/mailbox-overall-stats', { params }),
      'get analytics mailbox overall stats'
    );
    return response.data;
  }

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Test the API connection and validate credentials
   */
  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Try to list campaigns as a simple test
      await this.listCampaigns({});
      return {
        success: true,
        message: 'Successfully connected to SmartLead API',
      };
    } catch (error) {
      const smartLeadError =
        error instanceof SmartLeadError
          ? error
          : new SmartLeadError('Connection test failed', 'CONNECTION_TEST_FAILED');

      return {
        success: false,
        error: smartLeadError.message,
      };
    }
  }

  /**
   * Get client configuration (excluding sensitive data)
   */
  getConfig(): Partial<SmartLeadConfig> {
    return {
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      maxRetries: this.config.maxRetries,
      retryDelay: this.config.retryDelay,
    };
  }
}
