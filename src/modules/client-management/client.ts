/**
 * SmartLead MCP Server - Client Management Client
 *
 * Client module for client management API endpoints.
 * Handles all client-related operations including creation, updates, and management.
 *
 * @author LeadMagic Team
 * @version 1.5.0
 */

import { BaseSmartLeadClient } from '../../client/base.js';
/**
 * Client Management Client
 *
 * Provides methods for managing SmartLead clients including:
 * - Creating and updating clients
 * - Managing client settings and permissions
 * - Client analytics and reporting
 * - Client team management
 */
export class ClientManagementClient extends BaseSmartLeadClient {
  // ================================
  // CLIENT MANAGEMENT METHODS
  // ================================

  /**
   * Add Client To System (Whitelabel or not)
   * POST /client
   */
  async addClientToSystem(params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/client', params),
      'add client to system'
    );
    return response.data;
  }

  /**
   * Create a new client (alias for addClientToSystem)
   */
  async createClient(params: any): Promise<any> {
    return this.addClientToSystem(params);
  }

  /**
   * Fetch all clients
   * GET /client
   */
  async getAllClients(): Promise<any> {
    const response = await this.withRetry(() => this.apiClient.get('/client'), 'get all clients');
    return response.data;
  }

  /**
   * Create New Client API Key
   * POST /client/api-key
   */
  async createClientApiKey(params: any): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.post('/client/api-key', params),
      'create client API key'
    );
    return response.data;
  }

  /**
   * Get Clients API Keys
   * GET /client/api-key
   */
  async getClientApiKeys(): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.get('/client/api-key'),
      'get client API keys'
    );
    return response.data;
  }

  /**
   * Delete Client API Key
   * DELETE /client/api-key/{api_key_id}
   */
  async deleteClientApiKey(apiKeyId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.delete(`/client/api-key/${apiKeyId}`),
      'delete client API key'
    );
    return response.data;
  }

  /**
   * Reset Client API Key
   * PUT /client/api-key/{api_key_id}/reset
   */
  async resetClientApiKey(apiKeyId: number): Promise<any> {
    const response = await this.withRetry(
      () => this.apiClient.put(`/client/api-key/${apiKeyId}/reset`),
      'reset client API key'
    );
    return response.data;
  }

  /**
   * Get team details - Aggregates team information from various sources
   * This is a wrapper method that provides simplified team information
   * without requiring date ranges like the analytics endpoints
   * 
   * @param {string} [teamId] - Optional team ID to filter results (defaults to 'default')
   * @returns {Promise<any>} Team details including members, campaigns, and performance metrics
   * @throws {Error} If team details cannot be retrieved or if provided teamId is invalid
   * 
   * @example
   * // Get default team details
   * const teamDetails = await client.getTeamDetails();
   * console.log(`Team: ${teamDetails.data.team_name} with ${teamDetails.data.members_count} members`);
   * 
   * @example
   * // Get specific team details
   * const teamDetails = await client.getTeamDetails('team_123');
   * console.log(`Active campaigns: ${teamDetails.data.active_campaigns}`);
   * 
   * @description
   * This method aggregates data from multiple endpoints:
   * - Client list for team member information
   * - Team board analytics for performance metrics
   * - Campaign list for active campaign count
   * 
   * Returns a unified response with fallback values if any endpoint fails,
   * ensuring the method remains robust and reliable.
   */
  async getTeamDetails(teamId?: string): Promise<any> {
    try {
      // Validate teamId if provided
      if (teamId && typeof teamId !== 'string') {
        throw new Error('Invalid team ID: must be a string');
      }

      // Initialize response structure with defaults
      const defaultStats = {
        sent: 0,
        opened: 0,
        replied: 0,
        bounced: 0
      };

      // Get basic client/team information
      let clients = [];
      try {
        clients = await this.getAllClients();
        // Ensure clients is an array
        if (!Array.isArray(clients)) {
          console.warn('[SmartLead] getAllClients returned non-array:', typeof clients);
          clients = [];
        }
      } catch (error: any) {
        console.warn('[SmartLead] Failed to fetch clients:', error.message);
        // Continue with empty clients array
      }
      
      // Get overall stats for the last 30 days as a default
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Get analytics data - we need to access the analytics client through the parent
      let teamStats = null;
      try {
        // Note: This requires the analytics module to be available
        const analyticsClient = (this as any).apiClient;
        const statsResponse = await this.withRetry(
          () => analyticsClient.get('/analytics/team-board/overall-stats', {
            params: {
              start_date: startDate,
              end_date: endDate,
              full_data: true
            }
          }),
          'get team board stats for team details'
        );
        teamStats = statsResponse.data;
        
        // Validate the stats response
        if (!teamStats || typeof teamStats !== 'object') {
          console.warn('[SmartLead] Invalid team board stats response');
          teamStats = null;
        }
      } catch (error: any) {
        console.warn('[SmartLead] Could not fetch team board stats:', error.message);
      }

      // Get campaign count
      let campaignCount = 0;
      try {
        const campaignsResponse = await this.withRetry(
          () => (this as any).apiClient.get('/campaigns'),
          'get campaigns for team details'
        );
        const campaignsData = campaignsResponse.data;
        campaignCount = Array.isArray(campaignsData) ? campaignsData.length : 0;
      } catch (error: any) {
        console.warn('[SmartLead] Could not fetch campaigns:', error.message);
      }

      // Extract stats with fallbacks
      let extractedStats = defaultStats;
      try {
        const statsData = (teamStats as any)?.data?.team_board_stats;
        if (Array.isArray(statsData) && statsData.length > 0) {
          const firstStat = statsData[0];
          extractedStats = {
            sent: parseInt(firstStat.sent) || 0,
            opened: parseInt(firstStat.opened) || 0,
            replied: parseInt(firstStat.replied) || 0,
            bounced: parseInt(firstStat.bounced) || 0
          };
        }
      } catch (error) {
        console.warn('[SmartLead] Error extracting team stats:', error);
      }

      // Aggregate the response
      const teamDetails = {
        team_id: teamId || 'default',
        team_name: clients?.[0]?.name || 'Your Team',
        organization: clients?.[0]?.organization || null,
        members_count: clients?.length || 0,
        clients: clients || [],
        active_campaigns: campaignCount,
        recent_performance: {
          period: '30_days',
          stats: extractedStats
        },
        created_at: clients?.[0]?.created_at || null,
        last_updated: new Date().toISOString()
      };

      return {
        success: true,
        message: 'Team details retrieved successfully',
        data: teamDetails
      };
    } catch (error: any) {
      // Enhance error message
      const errorMessage = error.message || 'Unknown error occurred';
      const enhancedError = new Error(`Failed to get team details: ${errorMessage}`);
      (enhancedError as any).status = error.status || 500;
      (enhancedError as any).code = error.code || 'TEAM_DETAILS_ERROR';
      throw enhancedError;
    }
  }
}
