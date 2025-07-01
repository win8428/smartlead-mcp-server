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
import type { SuccessResponse } from '../../types.js';

// Client Management Type Definitions
interface CreateClientRequest {
  name: string;
  email: string;
  organization?: string;
  permissions?: string[];
  settings?: Record<string, unknown>;
}

interface ClientApiKeyRequest {
  client_id?: number;
  name?: string;
  permissions?: string[];
}

interface Client {
  id: number;
  name: string;
  email: string;
  organization?: string;
  created_at: string;
  updated_at: string;
  status: string;
}

interface TeamDetails {
  team_id: string;
  team_name: string;
  organization: string | null;
  members_count: number;
  clients: Client[];
  active_campaigns: number;
  recent_performance: {
    period: string;
    stats: {
      sent: number;
      opened: number;
      replied: number;
      bounced: number;
    };
  };
  created_at: string | null;
  last_updated: string;
}

interface TeamDetailsResponse extends SuccessResponse {
  data: TeamDetails;
}

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
  async addClientToSystem(params: CreateClientRequest): Promise<SuccessResponse> {
    const response = await this.withRetry(
      () => this.apiClient.post('/client', params),
      'add client to system'
    );
    return response.data;
  }

  /**
   * Create a new client (alias for addClientToSystem)
   */
  async createClient(params: CreateClientRequest): Promise<SuccessResponse> {
    return this.addClientToSystem(params);
  }

  /**
   * Fetch all clients
   * GET /client
   */
  async getAllClients(): Promise<Client[]> {
    const response = await this.withRetry(() => this.apiClient.get('/client'), 'get all clients');
    return response.data;
  }

  /**
   * Create New Client API Key
   * POST /client/api-key
   */
  async createClientApiKey(params: ClientApiKeyRequest): Promise<SuccessResponse> {
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
  async getClientApiKeys(): Promise<SuccessResponse> {
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
  async deleteClientApiKey(apiKeyId: number): Promise<SuccessResponse> {
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
  async resetClientApiKey(apiKeyId: number): Promise<SuccessResponse> {
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
   * @returns {Promise<TeamDetailsResponse>} Team details including members, campaigns, and performance metrics
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
  async getTeamDetails(teamId?: string): Promise<TeamDetailsResponse> {
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
        bounced: 0,
      };

      // Get basic client/team information
      let clients: Client[] = [];
      try {
        clients = await this.getAllClients();
        // Ensure clients is an array
        if (!Array.isArray(clients)) {
          console.warn('[SmartLead] getAllClients returned non-array:', typeof clients);
          clients = [];
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('[SmartLead] Failed to fetch clients:', errorMessage);
        // Continue with empty clients array
      }

      // Get overall stats for the last 30 days as a default
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      // Get analytics data - we need to access the analytics client through the parent
      let teamStats: unknown = null;
      try {
        // Note: This requires the analytics module to be available
        const analyticsClient = this.apiClient;
        const statsResponse = await this.withRetry(
          () =>
            analyticsClient.get('/analytics/team-board/overall-stats', {
              params: {
                start_date: startDate,
                end_date: endDate,
                full_data: true,
              },
            }),
          'get team board stats for team details'
        );
        teamStats = statsResponse.data;

        // Validate the stats response
        if (!teamStats || typeof teamStats !== 'object') {
          console.warn('[SmartLead] Invalid team board stats response');
          teamStats = null;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('[SmartLead] Could not fetch team board stats:', errorMessage);
      }

      // Get campaign count
      let campaignCount = 0;
      try {
        const campaignsResponse = await this.withRetry(
          () => this.apiClient.get('/campaigns'),
          'get campaigns for team details'
        );
        const campaignsData = campaignsResponse.data;
        campaignCount = Array.isArray(campaignsData) ? campaignsData.length : 0;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.warn('[SmartLead] Could not fetch campaigns:', errorMessage);
      }

      // Extract stats with fallbacks
      let extractedStats = defaultStats;
      try {
        const statsData = (teamStats as { data?: { team_board_stats?: unknown[] } })?.data
          ?.team_board_stats;
        if (Array.isArray(statsData) && statsData.length > 0) {
          const firstStat = statsData[0] as Record<string, string | number>;
          extractedStats = {
            sent: parseInt(String(firstStat.sent)) || 0,
            opened: parseInt(String(firstStat.opened)) || 0,
            replied: parseInt(String(firstStat.replied)) || 0,
            bounced: parseInt(String(firstStat.bounced)) || 0,
          };
        }
      } catch (error) {
        console.warn('[SmartLead] Error extracting team stats:', error);
      }

      // Aggregate the response
      const teamDetails: TeamDetails = {
        team_id: teamId || 'default',
        team_name: clients?.[0]?.name || 'Your Team',
        organization: clients?.[0]?.organization || null,
        members_count: clients?.length || 0,
        clients: clients || [],
        active_campaigns: campaignCount,
        recent_performance: {
          period: '30_days',
          stats: extractedStats,
        },
        created_at: clients?.[0]?.created_at || null,
        last_updated: new Date().toISOString(),
      };

      return {
        success: true,
        message: 'Team details retrieved successfully',
        data: teamDetails,
      };
    } catch (error) {
      // Enhance error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const enhancedError = new Error(`Failed to get team details: ${errorMessage}`);

      // Add error properties in a type-safe way
      Object.assign(enhancedError, {
        status: (error as { status?: number })?.status || 500,
        code: (error as { code?: string })?.code || 'TEAM_DETAILS_ERROR',
      });

      throw enhancedError;
    }
  }
}
