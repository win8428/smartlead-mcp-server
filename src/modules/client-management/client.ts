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
}
