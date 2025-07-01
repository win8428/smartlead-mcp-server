/**
 * SmartLead MCP Server - Base API Client
 *
 * Core HTTP client functionality with error handling, retry logic, and rate limiting.
 * This base client is extended by specific API modules for different endpoint categories.
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
 * @version 1.5.0
 */

import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import type { SmartLeadConfig } from '../types/config.js';

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

/**
 * Base SmartLead API Client
 *
 * Provides core HTTP functionality that is extended by specific API modules.
 * Handles authentication, rate limiting, retries, and error management.
 */
export class BaseSmartLeadClient {
  protected readonly apiClient: AxiosInstance;
  protected readonly config: Required<SmartLeadConfig>;
  private requestCount = 0;
  private rateLimitResetTime = 0;

  /**
   * Creates a new base SmartLead API client
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
        'User-Agent': 'SmartLead-MCP-Server/1.5.0',
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
      const limitValue = parseInt(limit, 10);
      if (limitValue > 0) {
        this.config.rateLimit = limitValue;
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
      const data = error.response.data as { message?: string; error?: string } | unknown;
      const errorData =
        data && typeof data === 'object' ? (data as { message?: string; error?: string }) : {};
      const message =
        errorData?.message || errorData?.error || error.message || 'API request failed';

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
   * @protected
   */
  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Executes a request with retry logic
   * @protected
   */
  protected async withRetry<T>(
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

  /**
   * Test the API connection and validate credentials
   */
  async testConnection(): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      // Try a simple API call to test connectivity - use campaigns endpoint without limit parameter
      await this.withRetry(() => this.apiClient.get('/campaigns'), 'connection test');
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
      rateLimit: this.config.rateLimit,
    };
  }
}
