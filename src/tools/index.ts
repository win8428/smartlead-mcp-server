/**
 * SmartLead MCP Server - Tools Index
 *
 * Central export point for all MCP tool registration functions.
 *
 * Tool Loading Strategy:
 * - Essential tools (campaigns, leads, email accounts, statistics) are always loaded
 * - Advanced tools (smart delivery, analytics, webhooks) require SMARTLEAD_ADVANCED_TOOLS=true
 * - Administrative tools (client management, smart senders) require SMARTLEAD_ADMIN_TOOLS=true
 *
 * @author LeadMagic Team
 * @version 1.6.2
 */

export { registerAnalyticsTools } from './analytics.js';
export { registerCampaignTools } from './campaigns.js';
export { registerClientManagementTools } from './client-management.js';
export { registerEmailAccountTools } from './email-accounts.js';
export { registerLeadTools } from './leads.js';
export { registerSmartDeliveryTools } from './smart-delivery.js';
export { registerSmartSendersTools } from './smart-senders.js';
export { registerStatisticsTools } from './statistics.js';
export { registerWebhookTools } from './webhooks.js';
