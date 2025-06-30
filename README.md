# 🚀 SmartLead MCP Server

[![SmartLead MCP Server](https://img.shields.io/badge/%F0%9F%9A%80-SmartLead%20MCP%20Server-blue?style=for-the-badge&labelColor=000000)](https://github.com/LeadMagic/smartlead-mcp-server)

**⚡ The Ultimate Model Context Protocol Server for Email Marketing Automation**

_Seamlessly integrate SmartLead's complete API suite with Claude, Cursor, Windsurf, and all MCP-compatible AI tools_

> **🤝 Unofficial Partner Integration** - We are proud partners of [SmartLead](https://smartlead.ai) and absolutely love their product! This is an unofficial MCP server implementation that provides seamless access to SmartLead's powerful email marketing automation platform. SmartLead's API is incredibly well-designed, their deliverability is outstanding, and their feature set is unmatched.

[![npm version](https://img.shields.io/npm/v/smartlead-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/smartlead-mcp-server) [![Downloads](https://img.shields.io/npm/dm/smartlead-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=brightgreen)](https://www.npmjs.com/package/smartlead-mcp-server) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensource&logoColor=white)](https://opensource.org/licenses/MIT) [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-brightgreen.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue?style=for-the-badge&logo=protocol&logoColor=white)](https://modelcontextprotocol.io) [![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/LeadMagic/smartlead-mcp-server) [![Security](https://img.shields.io/badge/Security-Verified-green?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/LeadMagic/smartlead-mcp-server/security)

---

**🎯 120+ Powerful Tools • 🔥 Zero Configuration • ⚡ One-Line Setup • 🛡️ Enterprise Security • 🤝 SmartLead Partner**

---

## 📖 Table of Contents

- [🚀 Super Easy Installation](#-super-easy-installation)
- [🛠️ Available Tools](#️-available-tools)
- [💡 Usage Examples](#-usage-examples)
- [🌐 Supported MCP Clients](#-supported-mcp-clients)
- [🔧 Development Setup](#-development-setup)
- [🏗️ Architecture](#️-architecture)
- [📊 API Reference](#-api-reference)
- [🔒 Security & Best Practices](#-security--best-practices)
- [🤝 Support & Resources](#-support--resources)

---

> 🎯 **Access all SmartLead API endpoints through the Model Context Protocol for seamless integration with Claude, Cursor, Windsurf, Continue.dev, and other MCP-compatible AI tools.**

## 🚀 Super Easy Installation

### ⚡ Option 1: Interactive Installer (Recommended)

The easiest way to get started - works on **macOS**, **Windows**, and **Linux**. Our interactive installer makes setup a breeze.

```bash
# 🔥 Using npx (no installation required)
npx smartlead-mcp-server install
```

**✨ The enhanced installer features:**
- 🎨 **Beautiful modern UI** with gradient text and interactive components
- ✅ **Guided API key setup** with real-time validation
- 🔍 **Smart client detection** for all supported AI tools
- ⚙️ **Automatic configuration** with zero manual setup
- 🚀 **Lightning fast** - up and running in under 2 minutes!
- 🛡️ **Mandatory security** - API key validation before any installation
- 📱 **Node.js 20+ optimized** for enhanced performance

### 📱 Option 2: Quick Manual Setup

If you prefer manual setup, you can configure the server directly:

```bash
# Set your API key
export SMARTLEAD_API_KEY=your-api-key-here

# Run the server
npx smartlead-mcp-server
```

### 🔑 Get Your API Key

1. 🌐 Visit [SmartLead Dashboard](https://app.smartlead.ai)
2. 📝 Sign up for free (if needed)
3. 🔐 Generate your API key
4. 📋 Set it as an environment variable

### ⚡ npx Usage (Zero Installation)

You can use the server without installing, which is great for quick tests:

```bash
# 🚀 Run directly with your API key
SMARTLEAD_API_KEY=your-key npx smartlead-mcp-server

# 📋 Run the interactive installer
npx smartlead-mcp-server install

# ❓ Check available commands
npx smartlead-mcp-server --help
```

---

## 🛠️ Available Tools

### 🚀 **PRIORITY: Combined Campaign Analytics**
- 📊 `smartlead_get_campaigns_with_analytics` - **Efficient combined endpoint** that fetches campaigns with their analytics in one call. Supports client/status filtering for large datasets. **Use this for comprehensive campaign reporting!**

### 📧 **Campaign Management (13+ tools)**
- 🎯 `smartlead_create_campaign` - Create new email campaigns
- ⏰ `smartlead_update_campaign_schedule` - Configure sending schedules
- ⚙️ `smartlead_update_campaign_settings` - Update campaign configuration
- 🔄 `smartlead_update_campaign_status` - Start, pause, or stop campaigns
- 📋 `smartlead_list_campaigns` - List all campaigns with filtering
- 🔍 `smartlead_get_campaign` - Get detailed campaign information
- 📝 `smartlead_save_campaign_sequence` - Set up email sequences with A/B testing
- 📊 `smartlead_get_campaign_sequence` - Retrieve sequence configuration
- 🗑️ `smartlead_delete_campaign` - Delete campaigns
- 📤 `smartlead_export_campaign_data` - Export campaign data
- 🔗 `smartlead_fetch_campaigns_by_lead_id` - Get campaigns by lead ID
- 📈 `smartlead_fetch_campaign_analytics_by_date` - Get campaign analytics by date range
- 📊 `smartlead_get_campaign_sequence_analytics` - Get sequence analytics

### 👥 **Lead Management (17+ tools)**
- 📋 `smartlead_list_leads_by_campaign` - List all leads by campaign ID
- 🔍 `smartlead_fetch_lead_categories` - Get lead categories
- 📧 `smartlead_fetch_lead_by_email` - Find lead by email address
- ➕ `smartlead_add_leads_to_campaign` - Add leads to campaigns
- ▶️ `smartlead_resume_lead_by_campaign` - Resume paused leads
- ⏸️ `smartlead_pause_lead_by_campaign` - Pause active leads
- 🗑️ `smartlead_delete_lead_by_campaign` - Delete leads from campaigns
- 🚫 `smartlead_unsubscribe_lead_from_campaign` - Unsubscribe leads
- 🚫 `smartlead_unsubscribe_lead_from_all_campaigns` - Global unsubscribe
- 🚫 `smartlead_add_lead_to_global_blocklist` - Add to global blocklist
- 🌐 `smartlead_fetch_all_leads_from_account` - Get all account leads
- 🚫 `smartlead_fetch_leads_from_global_blocklist` - Get blocklist leads
- ✏️ `smartlead_update_lead_by_id` - Update lead information
- 🏷️ `smartlead_update_lead_category` - Update lead categories
- 💬 `smartlead_fetch_lead_message_history` - Get message history
- 💬 `smartlead_reply_to_lead_from_master_inbox` - Reply to leads
- 📧 `smartlead_forward_reply` - Forward replies

### 📧 **Email Account Management (10+ tools)**
- 📋 `smartlead_list_email_accounts_per_campaign` - List campaign email accounts
- ➕ `smartlead_add_email_account_to_campaign` - Add email accounts to campaigns
- ➖ `smartlead_remove_email_account_from_campaign` - Remove email accounts
- 📧 `smartlead_fetch_all_email_accounts` - Get all user email accounts
- 🆕 `smartlead_create_email_account` - Create new email accounts
- ✏️ `smartlead_update_email_account` - Update email account settings
- 🔍 `smartlead_fetch_email_account_by_id` - Get email account details
- 🔥 `smartlead_add_update_warmup_to_email_account` - Configure email warmup
- 🔄 `smartlead_reconnect_failed_email_accounts` - Reconnect failed accounts
- 🏷️ `smartlead_update_email_account_tag` - Update account tags

### 📊 **Campaign Statistics (9+ tools)**
- 📈 `smartlead_fetch_campaign_statistics` - Get campaign statistics
- 📅 `smartlead_fetch_campaign_statistics_by_date_range` - Get stats by date range
- 🔥 `smartlead_fetch_warmup_stats_by_email_account` - Get warmup statistics
- 📊 `smartlead_fetch_campaign_top_level_analytics` - Get top-level analytics
- 📅 `smartlead_fetch_campaign_top_level_analytics_by_date` - Get analytics by date
- 👥 `smartlead_fetch_campaign_lead_statistics` - Get lead statistics
- 📧 `smartlead_fetch_campaign_mailbox_statistics` - Get mailbox statistics
- 📥 `smartlead_download_campaign_data` - **Download data in CSV/JSON format**
- 📊 `smartlead_view_download_statistics` - View download analytics

### 🎯 **Smart Delivery (25+ tools)**
- 🌍 `smartlead_get_region_wise_providers` - Get email providers by region
- 🧪 `smartlead_create_manual_placement_test` - Create manual spam tests
- 🤖 `smartlead_create_automated_placement_test` - Create automated spam tests
- 🔍 `smartlead_get_spam_test_details` - Get spam test details
- 🗑️ `smartlead_delete_smart_delivery_tests` - Delete tests in bulk
- ⏹️ `smartlead_stop_automated_test` - Stop automated tests
- 📋 `smartlead_list_all_tests` - List all tests
- 📊 `smartlead_get_provider_wise_report` - Provider performance reports
- 🌍 `smartlead_get_group_wise_report` - Geographic performance reports
- 📧 `smartlead_get_sender_account_wise_report` - Sender account reports
- 🛡️ `smartlead_get_spam_filter_details` - Spam filter analysis
- 🔐 `smartlead_get_dkim_details` - DKIM authentication details
- 🔐 `smartlead_get_spf_details` - SPF authentication details
- 🔐 `smartlead_get_rdns_details` - rDNS verification details
- 📧 `smartlead_get_sender_accounts` - Get sender accounts for tests
- 🚫 `smartlead_get_blacklist` - Get blacklist information
- 📧 `smartlead_get_email_content` - Get test email content
- 📊 `smartlead_get_ip_analytics` - IP blacklist analytics
- 📧 `smartlead_get_email_headers` - Email header analysis
- 📅 `smartlead_get_schedule_history` - Automated test history
- 🌐 `smartlead_get_ip_details` - IP blacklist details
- 📧 `smartlead_get_mailbox_summary` - Mailbox performance summary
- 📊 `smartlead_get_mailbox_count` - Mailbox count statistics
- 📁 `smartlead_get_all_folders` - List all folders
- 📁 `smartlead_create_folder` - Create organization folders
- 📁 `smartlead_get_folder_by_id` - Get folder details
- 🗑️ `smartlead_delete_folder` - Delete folders

### 🔗 **Webhooks (5 tools)**
- 📋 `smartlead_fetch_webhooks_by_campaign` - List campaign webhooks
- ➕ `smartlead_upsert_campaign_webhook` - Add/update webhooks
- 🗑️ `smartlead_delete_campaign_webhook` - Delete webhooks
- 📊 `smartlead_get_webhooks_publish_summary` - Webhook delivery stats
- 🔄 `smartlead_retrigger_failed_events` - Retry failed webhook events

### 👥 **Client Management (6 tools)**
- ➕ `smartlead_add_client` - Add new clients (white-label)
- 📋 `smartlead_fetch_all_clients` - List all clients
- 🔑 `smartlead_create_new_client_api_key` - Create API keys
- 📋 `smartlead_get_clients_api_keys` - List client API keys
- 🗑️ `smartlead_delete_client_api_key` - Delete API keys
- 🔄 `smartlead_reset_client_api_key` - Reset API keys

### 🌐 **Smart Senders (5 tools)**
- 🏪 `smartlead_get_vendors` - Get domain vendors
- 🔍 `smartlead_search_domain` - Search available domains
- 🤖 `smartlead_auto_generate_mailboxes` - Auto-generate mailboxes
- 🛒 `smartlead_place_order_mailboxes` - Purchase domains/mailboxes
- 📋 `smartlead_get_domain_list` - List purchased domains

### 📊 **Global Analytics (20+ tools)**
- 📋 `smartlead_get_analytics_campaign_list` - Campaign analytics list
- 👥 `smartlead_get_analytics_client_list` - Client analytics list
- 📅 `smartlead_get_analytics_client_month_wise_count` - Monthly client stats
- 📊 `smartlead_get_analytics_overall_stats_v2` - Overall performance stats
- 📅 `smartlead_get_analytics_day_wise_overall_stats` - Daily performance
- 💬 `smartlead_get_analytics_day_wise_positive_reply_stats` - Daily reply stats
- 📊 `smartlead_get_analytics_campaign_overall_stats` - Campaign performance
- 👥 `smartlead_get_analytics_client_overall_stats` - Client performance
- 📧 `smartlead_get_analytics_mailbox_name_wise_health_metrics` - Mailbox health
- 🌐 `smartlead_get_analytics_mailbox_domain_wise_health_metrics` - Domain health
- 🏪 `smartlead_get_analytics_mailbox_provider_wise_overall_performance` - Provider performance
- 👥 `smartlead_get_analytics_team_board_overall_stats` - Team performance
- 👤 `smartlead_get_analytics_lead_overall_stats` - Lead performance
- 🏷️ `smartlead_get_analytics_lead_category_wise_response` - Category responses
- ⏱️ `smartlead_get_analytics_campaign_leads_take_for_first_reply` - First reply timing
- 🔄 `smartlead_get_analytics_campaign_follow_up_reply_rate` - Follow-up rates
- ⏱️ `smartlead_get_analytics_campaign_lead_to_reply_time` - Response timing
- 💬 `smartlead_get_analytics_campaign_response_stats` - Response statistics
- 📊 `smartlead_get_analytics_campaign_status_stats` - Status statistics
- 📧 `smartlead_get_analytics_mailbox_overall_stats` - Mailbox statistics

---

## 💡 Usage Examples

Once installed, you can use natural language commands in your AI tool:

### 📧 Campaign Operations

```
"Create a new campaign called 'Product Launch 2025'"
"Update the schedule for campaign 123 to send emails Monday-Friday 9-5 EST"
"Pause campaign 456"
"Show me all active campaigns"
```

### 📝 Email Sequences

```
"Create a 3-email sequence for campaign 789 with 2-day delays"
"Add A/B testing to the first email in campaign 123"
"Show me the email sequence for campaign 456"
```

### 📊 Analytics

```
"Get campaign analytics for campaign 123 from last week"
"Show me the performance metrics for all campaigns this month"
"What's the open rate for campaign 456?"
```

---

## 🌐 Supported MCP Clients

| Client | Installation | Status | Notes |
|--------|-------------|--------|-------|
| 🤖 **Claude Desktop** | Interactive installer | ✅ Fully Supported | Official Anthropic client |
| 🎯 **Cursor (Cline)** | VS Code settings | ✅ Fully Supported | Requires Cline extension |
| 🏄 **Windsurf** | Manual config | ✅ Fully Supported | Codeium's AI IDE |
| 🔄 **Continue.dev** | Config file | ✅ Fully Supported | Open source coding assistant |
| 💻 **VS Code (Cline)** | VS Code settings.json | ✅ Fully Supported | Requires Cline extension |
| ⚡ **Zed Editor** | Settings | ✅ Fully Supported | Modern code editor |
| 🔗 **Any MCP Client** | Manual configuration | ✅ Supported | Standard MCP protocol |

---

## 🔧 Development Setup

### 📋 Prerequisites

- 📦 Node.js 20.0.0 or higher (LTS recommended for optimal performance)
- 🔑 SmartLead API key from [smartlead.ai](https://smartlead.ai)

### 💻 Local Development

```bash
# 📥 Clone the repository
git clone https://github.com/LeadMagic/smartlead-mcp-server.git
cd smartlead-mcp-server

# 📦 Install dependencies
npm install

# 🔐 Create environment file
echo "SMARTLEAD_API_KEY=your-api-key-here" > .env

# 🚀 Start development server
npm run dev

# 🏗️ Build for production
npm run build

# ✅ Run validation
npm run validate
```

### 🔍 Testing with MCP Inspector

```bash
# 🚀 Start the MCP inspector
npm run inspector

# 🌐 Open the provided URL in your browser to test all tools
```

---

## 🏗️ Architecture

### 🛠️ Technology Stack

- ⚡ **Runtime**: Node.js 18+
- 📘 **Language**: TypeScript with strict type checking
- 🔌 **MCP SDK**: @modelcontextprotocol/sdk v1.0.0+
- 🌐 **HTTP Client**: Axios with comprehensive error handling
- ✅ **Validation**: Zod schemas for all API inputs/outputs
- 🔧 **Development**: ESLint, Prettier, Jest for testing

### 📁 Project Structure

```
├── src/
│   ├── index.ts        # 🚀 Main entry point and CLI
│   ├── server.ts       # 🔌 MCP server implementation
│   ├── client.ts       # 🌐 SmartLead API client wrapper
│   ├── types.ts        # 📝 TypeScript types and Zod schemas
│   └── install.tsx     # 🎨 Interactive installer (React/Ink)
├── dist/               # 📦 Compiled JavaScript output
├── .env.example        # 🔐 Environment configuration example
└── README.md           # 📚 This file
```

---

## 📊 API Reference

### 🔤 Field Naming Convention

**All fields use snake_case** (matching SmartLead API):

```json
{
  "campaign_id": 123,
  "campaign_name": "Product Launch",
  "email_status": "sent"
}
```

### 🔐 Authentication

Include your API key in environment variables:

```bash
export SMARTLEAD_API_KEY=your-smartlead-api-key
```

### ⏱️ Rate Limits

- 📊 **Standard endpoints**: Respects SmartLead API limits
- 🔄 **Automatic retry**: Exponential backoff for rate limits

### ❌ Error Handling

Consistent error format across all endpoints:

```json
{
  "error": "Bad Request",
  "message": "API key is missing or invalid."
}
```

---

## 🔒 Security & Best Practices

✅ **No API keys in code** - Always use environment variables  
✅ **Type-safe requests** - Full TypeScript coverage with Zod validation  
✅ **Error handling** - Comprehensive error catching and user-friendly messages  
✅ **Rate limiting** - Respects SmartLead API rate limits  
✅ **Secure defaults** - Production-ready configuration out of the box  
✅ **Interactive installer** - No manual config file editing required

---

## 🤝 Support & Resources

- 📚 **API Documentation**: [docs.smartlead.ai](https://docs.smartlead.ai)
- 🌐 **Official Website**: [smartlead.ai](https://smartlead.ai)
- 📊 **Dashboard**: [app.smartlead.ai](https://app.smartlead.ai)
- 🆘 **Support**: [jesse@leadmagic.io](mailto:jesse@leadmagic.io)
- 🐛 **Issues**: [GitHub Issues](https://github.com/LeadMagic/smartlead-mcp-server/issues)
- 🐙 **Source Code**: [GitHub Repository](https://github.com/LeadMagic/smartlead-mcp-server)

---

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♀️ Contributing

We welcome contributions! Here's how to get started:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch: `git checkout -b feature/new-feature`
3. ✨ Make your changes and add tests
4. ✅ Run validation: `npm run validate`
5. 💾 Commit your changes: `git commit -am 'Add new feature'`
6. 📤 Push to the branch: `git push origin feature/new-feature`
7. 🔄 Submit a pull request

---

**🎉 Built with the SmartLead API for 100% compatibility**

---

### 🌟 Star us on GitHub • 🐛 Report Issues • 💡 Request Features

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/LeadMagic/smartlead-mcp-server) [![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/smartlead-mcp-server)

**Made with ❤️ by the LeadMagic team**
