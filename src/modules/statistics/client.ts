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

  /**
   * Download campaign data in various formats
   * Uses the statistics endpoint to fetch and format campaign data
   * 
   * @param {number} campaignId - The ID of the campaign to download data for
   * @param {string} downloadType - The type of data to download (e.g., 'statistics', 'leads', 'responses')
   * @param {'json' | 'csv'} format - The output format, defaults to 'json'
   * @param {string} [userId] - Optional user ID for filtering (not currently supported by API)
   * @returns {Promise<any>} Download response containing the data in requested format
   * @throws {Error} If the campaign data cannot be retrieved
   * 
   * @example
   * // Download campaign statistics as JSON
   * const jsonData = await client.downloadCampaignData(12345, 'statistics', 'json');
   * 
   * @example
   * // Download campaign data as CSV
   * const csvData = await client.downloadCampaignData(12345, 'leads', 'csv');
   * // csvData.data contains base64-encoded CSV content
   */
  async downloadCampaignData(campaignId: number, downloadType: string, format: 'json' | 'csv' = 'json', userId?: string): Promise<any> {
    try {
      // Fetch statistics data based on download type
      let data: any;
      let allData: any[] = [];
      let hasMore = true;
      let offset = 0;
      const limit = 500; // Max limit per request

      // For now, all download types will use the general statistics endpoint
      // In the future, we could use different endpoints based on downloadType
      while (hasMore) {
        const params = {
          offset,
          limit
          // Note: user_id is not supported by the statistics endpoint
        };

        const response = await this.withRetry(
          () => this.apiClient.get(`/campaigns/${campaignId}/statistics`, { params }),
          'download campaign statistics data'
        );

        if (response.data && response.data.data) {
          allData = allData.concat(response.data.data);
          
          // Check if there are more records to fetch
          const totalRecords = parseInt(response.data.total_stats) || 0;
          hasMore = (offset + limit) < totalRecords;
          offset += limit;
        } else {
          hasMore = false;
        }
      }

      // Format the data based on requested format
      if (format === 'csv') {
        // Convert to CSV format
        if (allData.length === 0) {
          return {
            format: 'csv',
            encoding: 'utf-8',
            filename: `campaign_${campaignId}_${downloadType}_${new Date().toISOString().split('T')[0]}.csv`,
            mimeType: 'text/csv',
            data: 'No data available',
            size: 17
          };
        }

        // Get headers from the first object
        const headers = Object.keys(allData[0]);
        let csvContent = headers.join(',') + '\n';

        // Add data rows
        for (const row of allData) {
          const values = headers.map(header => {
            const value = row[header];
            // Handle null/undefined
            if (value === null || value === undefined) return '';
            // Escape quotes and wrap in quotes if contains comma, newline, or quotes
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          });
          csvContent += values.join(',') + '\n';
        }

        // Convert to base64 for transport
        const buffer = Buffer.from(csvContent, 'utf-8');
        const base64Data = buffer.toString('base64');

        return {
          format: 'csv',
          encoding: 'base64',
          filename: `campaign_${campaignId}_${downloadType}_${new Date().toISOString().split('T')[0]}.csv`,
          mimeType: 'text/csv',
          data: base64Data,
          size: buffer.length
        };
      } else {
        // Return JSON format
        return {
          download_type: downloadType,
          campaign_id: campaignId,
          total_records: allData.length,
          data: allData,
          generated_at: new Date().toISOString()
        };
      }
    } catch (error) {
      // Re-throw the error to be handled by the retry mechanism
      throw error;
    }
  }

  /**
   * View download statistics
   * GET /download-statistics
   * 
   * Retrieves download statistics with optional filtering by time period and grouping.
   * Falls back to overall analytics if the download-statistics endpoint is not available.
   * 
   * @param {string} [timePeriod] - Time period to filter by ('last_7_days', 'last_30_days', 'last_quarter')
   * @param {string} [groupBy] - How to group the statistics ('date', 'campaign', 'user')
   * @returns {Promise<any>} Download statistics or fallback analytics data
   * @throws {Error} If statistics cannot be retrieved from any endpoint
   * 
   * @example
   * // Get download statistics for the last 7 days
   * const stats = await client.viewDownloadStatistics('last_7_days', 'date');
   * 
   * @example
   * // Get all download statistics grouped by campaign
   * const stats = await client.viewDownloadStatistics(undefined, 'campaign');
   */
  async viewDownloadStatistics(timePeriod?: string, groupBy?: string): Promise<any> {
    // First try the documented endpoint
    const params: Record<string, string> = {};
    if (timePeriod) params.time_period = timePeriod;
    if (groupBy) params.group_by = groupBy;
    
    try {
      const response = await this.withRetry(
        () => this.apiClient.get('/download-statistics', { params }),
        'view download statistics'
      );
      return response.data;
    } catch (error: any) {
      // If the endpoint doesn't exist (404), try alternative approach
      if (error.status === 404 || error.code === 'HTTP_404') {
        console.log('[SmartLead] /download-statistics endpoint not found, using overall analytics as fallback');
        
        // Use overall analytics with date filtering based on time period
        const endDate = new Date().toISOString().split('T')[0];
        let startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to last 30 days
        
        // Calculate start date based on time period
        switch (timePeriod) {
          case 'last_7_days':
            startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case 'last_30_days':
            startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          case 'last_quarter':
            startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            break;
          // default case already set above
        }
        
        // Get overall analytics as fallback
        const overallStatsResponse = await this.withRetry(
          () => this.apiClient.get('/analytics/overall-stats-v2', {
            params: {
              start_date: startDate,
              end_date: endDate
            }
          }),
          'get overall analytics for download statistics'
        );
        
        // Format the response to simulate download statistics
        const data = overallStatsResponse.data?.data || overallStatsResponse.data || {};
        
        return {
          success: true,
          message: 'Download statistics retrieved using overall analytics',
          data: {
            time_period: timePeriod || 'last_30_days',
            group_by: groupBy || 'date',
            statistics: {
              total_campaigns: data.overall_stats?.campaigns || 0,
              total_exports: 0, // Not available in overall stats
              emails_sent: data.overall_stats?.sent || 0,
              emails_opened: data.overall_stats?.opened || 0,
              emails_replied: data.overall_stats?.replied || 0,
              note: 'Using overall analytics as download statistics endpoint is not available'
            }
          }
        };
      }
      
      // Re-throw other errors
      throw error;
    }
  }
}
