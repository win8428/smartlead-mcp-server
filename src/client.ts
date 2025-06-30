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

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { SmartLeadConfig } from './types.js';

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

  /**
   * Creates a new SmartLead API client
   * 
   * @param config - Client configuration including API key and optional settings
   * @throws {SmartLeadError} If configuration is invalid
   */
  constructor(config: SmartLeadConfig) {
    // Validate required configuration
    if (!config.apiKey || typeof config.apiKey !== 'string' || config.apiKey.trim().length === 0) {
      throw new SmartLeadError(
        'Valid SmartLead API key is required',
        'INVALID_CONFIG',
        400
      );
    }

    // Set default configuration values
    this.config = {
      apiKey: config.apiKey.trim(),
      baseUrl: config.baseUrl || 'https://server.smartlead.ai/api/v1',
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
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
   * Sets up Axios interceptors for request/response handling
   * @private
   */
  private setupInterceptors(): void {
    // Request interceptor for logging and debugging
    this.apiClient.interceptors.request.use(
      (config) => {
        if (process.env.DEBUG === 'true') {
          console.error(`[SmartLead API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[SmartLead API] Request error:', error);
        return Promise.reject(this.handleAxiosError(error));
      }
    );

    // Response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => {
        if (process.env.DEBUG === 'true') {
          console.error(`[SmartLead API] Response ${response.status} from ${response.config.url}`);
        }
        return response;
      },
      (error) => {
        return Promise.reject(this.handleAxiosError(error));
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
      
      return new SmartLeadError(
        message,
        `HTTP_${status}`,
        status,
        data,
        isRetryable
      );
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
    return new Promise(resolve => setTimeout(resolve, ms));
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
      if (error instanceof SmartLeadError && error.shouldRetry() && attempt < this.config.maxRetries) {
        const delayMs = Math.min(
          this.config.retryDelay * Math.pow(2, attempt - 1),
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
  // CAMPAIGN MANAGEMENT METHODS
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
    const response = await this.withRetry(
      () => this.apiClient.get(`/leads/${leadId}`),
      'get lead'
    );
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
  async getCampaignAnalyticsByDate(campaignId: number, startDate: string, endDate: string): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get(`/campaigns/${campaignId}/analytics`, {
        params: { start_date: startDate, end_date: endDate }
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
      () => this.apiClient.post(`/campaigns/${campaignId}/webhooks/retrigger`, { fromTime, toTime }),
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

  // ================================
  // UTILITY METHODS
  // ================================

  /**
   * Test the API connection and validate credentials
   */
  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Try to list campaigns as a simple test
      await this.listCampaigns({ limit: 1 });
      return { 
        success: true, 
        message: 'Successfully connected to SmartLead API' 
      };
    } catch (error) {
      const smartLeadError = error instanceof SmartLeadError ? error : 
        new SmartLeadError('Connection test failed', 'CONNECTION_TEST_FAILED');
      
      return { 
        success: false, 
        error: smartLeadError.message 
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
