# 🚀 SmartLead MCP Server by LeadMagic

[![SmartLead MCP Server](https://img.shields.io/badge/%F0%9F%9A%80-SmartLead%20MCP%20Server-blue?style=for-the-badge&labelColor=000000)](https://github.com/LeadMagic/smartlead-mcp-server)

**⚡ The Premier Model Context Protocol Server for Cold Email Marketing Automation**

_Seamlessly integrate SmartLead's complete cold email API suite with Claude, Cursor, Windsurf, and all MCP-compatible AI tools_

**🎨 Powered by React Ink • 🚀 Built with TypeScript • ⚡ Optimized with Bun • 📧 Cold Email Focused**

> **🤝 Unofficial Partner Integration** - We are proud partners of [SmartLead](https://smartlead.ai) and absolutely love their product! This is an unofficial MCP server implementation that provides seamless access to SmartLead's powerful email marketing automation platform. SmartLead's API is incredibly well-designed, their deliverability is outstanding, and their feature set is unmatched.

[![npm version](https://img.shields.io/npm/v/smartlead-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/smartlead-mcp-server) [![Downloads](https://img.shields.io/npm/dm/smartlead-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=brightgreen)](https://www.npmjs.com/package/smartlead-mcp-server) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensource&logoColor=white)](https://opensource.org/licenses/MIT) [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-brightgreen.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Ink](https://img.shields.io/badge/Ink-000000?style=for-the-badge&logo=react&logoColor=white)](https://github.com/vadimdemedes/ink) [![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)](https://bun.sh/)

[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue?style=for-the-badge&logo=protocol&logoColor=white)](https://modelcontextprotocol.io) [![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/LeadMagic/smartlead-mcp-server) [![Security](https://img.shields.io/badge/Security-Verified-green?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/LeadMagic/smartlead-mcp-server/security)

---

**🎯 113 Cold Email Tools • 🔥 Zero Configuration • ⚡ One-Line Setup • 🛡️ Enterprise Security • 🤝 SmartLead Partner**

---

## 📖 Table of Contents

- [🚀 Super Easy Installation](#-super-easy-installation)
- [🏗️ Technology Stack](#️-technology-stack)
- [📧 Cold Email Features](#-cold-email-features)
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

## 🏗️ Technology Stack

### **🎨 Interactive Installer - Powered by React Ink**

Our beautiful command-line installer is built with **[React Ink](https://github.com/vadimdemedes/ink)** - React for CLI applications:

- **🎭 Animated ASCII Art** - Beautiful SmartLead branding with gradient effects
- **🎯 Interactive Components** - Select inputs, text inputs, progress bars
- **🔐 Real-time Validation** - Live API key verification with SmartLead
- **🛡️ Error Recovery** - Comprehensive error handling with user guidance
- **📱 Responsive Design** - Works perfectly in any terminal size
- **⚡ Fast Performance** - Optimized React components for CLI

### **🚀 Core Technologies**

| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **[TypeScript](https://www.typescriptlang.org/)** | Type-safe development | Zero runtime errors, excellent DX |
| **[React Ink](https://github.com/vadimdemedes/ink)** | CLI interface | Beautiful, interactive command-line UIs |
| **[Bun](https://bun.sh/)** | Runtime & package manager | 3x faster than Node.js, modern tooling |
| **[MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)** | Protocol implementation | Official TypeScript SDK for MCP |
| **[Zod](https://zod.dev/)** | Schema validation | Runtime type safety, excellent errors |
| **[Axios](https://axios-http.com/)** | HTTP client | Robust, feature-rich API communication |

### **🎨 React Ink Components Used**

- **`<Box>`** - Layout and styling
- **`<Text>`** - Styled text with gradients and colors
- **`<Spinner>`** - Loading animations
- **`<SelectInput>`** - Interactive selection menus
- **`<TextInput>`** - User input with validation
- **`<Gradient>`** - Beautiful gradient text effects
- **`<BigText>`** - ASCII art logo rendering

### **⚡ Performance & Quality**

- **Zero TypeScript Errors** - Strict compilation with comprehensive types
- **113 API Endpoints** - Complete SmartLead API coverage
- **Production Ready** - Comprehensive error handling and recovery
- **MCP Compliant** - Follows all Model Context Protocol standards
- **Modern Architecture** - Modular, maintainable, and extensible

---

## 📧 Cold Email Features

### **🎯 Complete Cold Email Automation Suite**

SmartLead is the industry leader in cold email marketing, and our MCP server provides complete access to their powerful platform:

#### **🚀 Campaign Management**
- **Multi-sequence campaigns** with A/B testing
- **Smart scheduling** across time zones
- **Automated follow-ups** with customizable delays
- **Campaign analytics** and performance tracking
- **Lead scoring** and engagement metrics

#### **📊 Advanced Analytics & Reporting**
- **Real-time deliverability monitoring**
- **Open and click tracking** with detailed insights
- **Response rate optimization** suggestions
- **Mailbox health monitoring** and reputation management
- **ROI tracking** and conversion analytics

#### **🛡️ Deliverability Optimization**
- **Smart delivery** with placement testing
- **Spam filter analysis** and optimization
- **Domain reputation management**
- **IP warming** and rotation strategies
- **Blacklist monitoring** and recovery

#### **👥 Lead Management**
- **Bulk lead import** from CSV/Excel
- **Lead categorization** and segmentation
- **Unsubscribe handling** and compliance
- **Lead enrichment** and data validation
- **Custom field mapping** and personalization

#### **📧 Email Account Management**
- **Multi-mailbox setup** for scale
- **Automated warmup** sequences
- **Account health monitoring**
- **Connection status tracking**
- **Tag-based organization**

#### **🔗 Integrations & Webhooks**
- **Real-time webhook events** for all activities
- **CRM integrations** (HubSpot, Salesforce, Pipedrive)
- **Zapier connectivity** for workflow automation
- **Custom API integrations** for enterprise needs

### **🎯 Why SmartLead for Cold Email?**

| Feature | SmartLead Advantage |
|---------|-------------------|
| **Deliverability** | Industry-leading inbox placement rates |
| **Scale** | Send thousands of emails daily per mailbox |
| **Compliance** | Built-in CAN-SPAM and GDPR compliance |
| **Analytics** | Deep insights into campaign performance |
| **Support** | 24/7 expert cold email support |
| **Integrations** | Seamless workflow automation |

### **📈 Cold Email Best Practices Built-In**

- **Gradual volume ramping** to build sender reputation
- **Natural sending patterns** to avoid spam filters
- **Personalization at scale** with dynamic variables
- **A/B testing** for subject lines and content
- **Automated list cleaning** and bounce handling
- **Compliance monitoring** for regulations

---

## 🛠️ Available Tools

### 🚀 **PRIORITY: Cold Email Campaign Analytics**
- 📊 `smartlead_get_campaigns_with_analytics` - **Efficient combined endpoint** that fetches cold email campaigns with their performance analytics in one call. Supports client/status filtering for large datasets. **Perfect for cold email performance reporting!**

### 📧 **Cold Email Campaign Management (13+ tools)**
- 🎯 `smartlead_create_campaign` - Create new cold email campaigns with sequences
- ⏰ `smartlead_update_campaign_schedule` - Configure sending schedules across time zones
- ⚙️ `smartlead_update_campaign_settings` - Update campaign configuration and personalization
- 🔄 `smartlead_update_campaign_status` - Start, pause, or stop cold email campaigns
- 📋 `smartlead_list_campaigns` - List all cold email campaigns with filtering
- 🔍 `smartlead_get_campaign` - Get detailed campaign information and metrics
- 📝 `smartlead_save_campaign_sequence` - Set up multi-step email sequences with A/B testing
- 📊 `smartlead_get_campaign_sequence` - Retrieve sequence configuration and performance
- 🗑️ `smartlead_delete_campaign` - Delete campaigns and associated data
- 📤 `smartlead_export_campaign_data` - Export campaign data for analysis
- 🔗 `smartlead_fetch_campaigns_by_lead_id` - Get campaigns associated with specific leads
- 📈 `smartlead_fetch_campaign_analytics_by_date` - Get campaign analytics by date range
- 📊 `smartlead_get_campaign_sequence_analytics` - Get detailed sequence performance analytics

### 👥 **Cold Email Lead Management (17+ tools)**
- 📋 `smartlead_list_leads_by_campaign` - List all prospects by cold email campaign
- 🔍 `smartlead_fetch_lead_categories` - Get lead categories and segmentation
- 📧 `smartlead_fetch_lead_by_email` - Find prospects by email address
- ➕ `smartlead_add_leads_to_campaign` - Import prospects to cold email campaigns
- ▶️ `smartlead_resume_lead_by_campaign` - Resume paused prospects in sequences
- ⏸️ `smartlead_pause_lead_by_campaign` - Pause active prospects temporarily
- 🗑️ `smartlead_delete_lead_by_campaign` - Remove prospects from campaigns
- 🚫 `smartlead_unsubscribe_lead_from_campaign` - Handle unsubscribe requests
- 🚫 `smartlead_unsubscribe_lead_from_all_campaigns` - Global unsubscribe management
- 🚫 `smartlead_add_lead_to_global_blocklist` - Add to global suppression list
- 🌐 `smartlead_fetch_all_leads_from_account` - Get all prospects in account
- 🚫 `smartlead_fetch_leads_from_global_blocklist` - View suppressed prospects
- ✏️ `smartlead_update_lead_by_id` - Update prospect information and data
- 🏷️ `smartlead_update_lead_category` - Change prospect categories and tags
- 💬 `smartlead_fetch_lead_message_history` - Get complete conversation history
- 💬 `smartlead_reply_to_lead_from_master_inbox` - Send personalized replies
- 📧 `smartlead_forward_reply` - Forward prospect responses to team

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

## 💡 Cold Email Usage Examples

Once installed, you can use natural language commands in your AI tool for complete cold email automation:

### 🚀 Cold Email Campaign Setup

```
"Create a new cold email campaign called 'SaaS Outreach Q4' targeting tech executives"
"Set up a 5-step email sequence with 3-day delays between each email"
"Configure the campaign to send between 9 AM and 5 PM in the prospect's timezone"
"Add A/B testing for subject lines to optimize open rates"
```

### 📊 Cold Email Performance Analysis

```
"Show me the performance metrics for my top 5 cold email campaigns"
"Which email sequences have the highest reply rates?"
"Generate a deliverability report for all campaigns this month"
"What's my average open rate compared to industry benchmarks?"
"Show me which prospects opened emails but didn't reply"
```

### 👥 Prospect Management

```
"Import 1000 prospects from my CSV file to the SaaS Outreach campaign"
"Show me all prospects who replied positively to my cold emails"
"Pause all prospects in the 'Not Interested' category"
"Get the complete conversation history for prospect john@startup.com"
"Move all engaged prospects to my 'Hot Leads' category"
```

### 🛡️ Deliverability Optimization

```
"Check the spam score for my latest email template"
"Show me which email accounts need IP warming"
"Run a placement test for my new cold email sequence"
"Monitor my domain reputation across all major email providers"
"Generate a blacklist report for all my sending domains"
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

## 🔒 Security & Cold Email Best Practices

### **🛡️ Technical Security**
✅ **No API keys in code** - Always use environment variables
✅ **Type-safe requests** - Full TypeScript coverage with Zod validation
✅ **Error handling** - Comprehensive error catching and user-friendly messages
✅ **Rate limiting** - Respects SmartLead API rate limits
✅ **Secure defaults** - Production-ready configuration out of the box
✅ **Interactive installer** - No manual config file editing required

### **📧 Cold Email Compliance & Best Practices**

#### **🏛️ Legal Compliance**
✅ **CAN-SPAM Act** - Automatic unsubscribe handling and sender identification
✅ **GDPR Compliance** - Proper consent management and data protection
✅ **CCPA Compliance** - California privacy rights and data handling
✅ **Opt-out Management** - Immediate unsubscribe processing
✅ **Sender Identification** - Clear sender information in all emails

#### **🎯 Deliverability Best Practices**
✅ **Gradual Volume Ramping** - Start with low volumes and increase gradually
✅ **IP Warming** - Proper warmup sequences for new email accounts
✅ **Domain Reputation** - Monitor and maintain sender reputation
✅ **List Hygiene** - Regular cleaning and validation of prospect lists
✅ **Engagement Tracking** - Monitor opens, clicks, and replies
✅ **Spam Testing** - Regular placement tests and spam score monitoring

#### **📝 Content Best Practices**
✅ **Personalization** - Use dynamic variables for relevant messaging
✅ **Value-First Approach** - Focus on prospect benefits, not features
✅ **Clear Call-to-Action** - Single, specific action per email
✅ **Mobile Optimization** - Ensure emails render well on all devices
✅ **A/B Testing** - Test subject lines, content, and send times
✅ **Natural Language** - Avoid spam trigger words and phrases

#### **⚡ Performance Optimization**
✅ **Send Time Optimization** - Respect prospect time zones
✅ **Frequency Management** - Appropriate delays between sequence emails
✅ **Response Monitoring** - Track and analyze reply rates
✅ **Bounce Handling** - Automatic removal of invalid email addresses
✅ **Engagement Scoring** - Prioritize highly engaged prospects
✅ **Campaign Analytics** - Regular performance review and optimization

---

## 📈 Cold Email Success Metrics

### **🎯 Key Performance Indicators (KPIs)**

Track these essential metrics to optimize your cold email campaigns:

| Metric | Good Rate | Excellent Rate | How to Improve |
|--------|-----------|----------------|-----------------|
| **Open Rate** | 20-30% | 40%+ | Better subject lines, sender reputation |
| **Reply Rate** | 1-3% | 5%+ | Personalization, value proposition |
| **Click Rate** | 2-5% | 8%+ | Clear CTAs, relevant content |
| **Bounce Rate** | <2% | <1% | List hygiene, email validation |
| **Unsubscribe Rate** | <0.5% | <0.2% | Better targeting, value delivery |
| **Spam Rate** | <0.1% | <0.05% | Reputation management, content quality |

### **📊 SmartLead Analytics Features**

- **Real-time Performance Tracking** - Monitor campaigns as they run
- **Sequence Analytics** - See which emails in your sequence perform best
- **A/B Testing Results** - Compare subject lines, content, and send times
- **Deliverability Monitoring** - Track inbox placement across providers
- **Engagement Scoring** - Identify your most interested prospects
- **ROI Calculation** - Measure revenue generated per campaign

### **🚀 Optimization Strategies**

1. **Subject Line Testing** - A/B test different approaches
2. **Send Time Optimization** - Find when your prospects are most active
3. **Personalization Scaling** - Use dynamic variables effectively
4. **Sequence Timing** - Optimize delays between emails
5. **Content Iteration** - Continuously improve based on data
6. **List Segmentation** - Target specific prospect groups

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
