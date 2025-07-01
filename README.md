# 💜 SmartLead MCP Server

<div align="center">

**🚀 The Premier Model Context Protocol Server for SmartLead's Cold Email Automation Platform**

[![NPM Version](https://img.shields.io/npm/v/smartlead-mcp-by-leadmagic?style=for-the-badge&color=7c3aed)](https://www.npmjs.com/package/smartlead-mcp-by-leadmagic)
[![Downloads](https://img.shields.io/npm/dt/smartlead-mcp-by-leadmagic?style=for-the-badge&color=7c3aed)](https://www.npmjs.com/package/smartlead-mcp-by-leadmagic)
[![License](https://img.shields.io/npm/l/smartlead-mcp-by-leadmagic?style=for-the-badge&color=7c3aed)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-7c3aed?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**✨ 116+ API Tools • 🛡️ Production Ready • 🎨 Zero Config • ⚡ Instant Setup ✨**

</div>

---

## 🌟 What Makes This Special?

This isn't just another MCP server—it's the **complete SmartLead automation suite** that transforms how you interact with cold email campaigns through AI. Built by [LeadMagic](https://leadmagic.io), the official SmartLead partner, this server provides **comprehensive API coverage** with a **beautiful React Ink installer** that makes setup a joy.

### 🎯 **Complete SmartLead API Coverage (116+ Tools)**

| 📂 **Category** | 🔧 **Tools** | 📝 **Description** |
|-----------------|-------------|-------------------|
| **🎯 Campaign Management** | 14 tools | Create, update, manage campaigns and sequences |
| **👥 Lead Management** | 17 tools | Import, organize, track prospects and responses |
| **📧 Email Account Management** | 15 tools | Configure sending accounts and warmup settings |
| **🤖 Smart Senders** | 12 tools | Manage domains, vendors, and deliverability |
| **📊 Smart Delivery** | 11 tools | Optimize sending patterns and timing |
| **📈 Analytics & Statistics** | 18 tools | Track performance, ROI, and campaign metrics |
| **🔗 Webhooks** | 9 tools | Real-time notifications and integrations |
| **👤 Client Management** | 8 tools | Team management and API key handling |
| **🔧 Advanced Tools** | 12+ tools | Enterprise features and automation |

---

## 🚀 **Lightning-Fast Installation**

### **Option 1: NPX (Recommended - Zero Installation)**
```bash
# Beautiful interactive installer
npx smartlead-mcp-by-leadmagic install

# Direct server usage
SMARTLEAD_API_KEY=your-key npx smartlead-mcp-by-leadmagic
```

### **Option 2: Global Installation**
```bash
# Install globally
npm install -g smartlead-mcp-by-leadmagic

# Run beautiful installer
smartlead-mcp-by-leadmagic install

# Or start server directly
SMARTLEAD_API_KEY=your-key smartlead-mcp-by-leadmagic
```

### **Option 3: Local Installation**
```bash
# Install locally
npm install smartlead-mcp-by-leadmagic

# Use via npm scripts
npm run setup
```

---

## 🎨 **Beautiful Interactive Installer**

Our **React Ink installer** is a work of art! It features:

- 💜 **Stunning purple gradients** and smooth animations
- 🔍 **Auto-detection** of all MCP clients (Claude, Cursor, Windsurf, etc.)
- 🔑 **Real-time API key validation** with SmartLead
- ⚡ **Zero-config setup** for all supported clients
- 🎯 **Smart error handling** with helpful messages
- 📱 **Cross-platform support** (macOS, Linux, Windows)

![Installer Demo](https://via.placeholder.com/800x400/7c3aed/ffffff?text=Beautiful+Purple+Installer)

---

## 🔗 **Supported AI Coding Tools**

| 🤖 **Client** | 📱 **Status** | 🔧 **Auto-Config** | 📝 **Notes** |
|---------------|--------------|-------------------|---------------|
| **🤖 Claude Desktop** | ✅ Full Support | ✅ Yes | Anthropic's flagship client |
| **🎯 Cursor** | ✅ Full Support | ✅ Yes | AI-powered code editor |
| **🏄 Windsurf** | ✅ Full Support | ✅ Yes | Codeium's AI IDE |
| **🔄 Continue.dev** | ✅ Full Support | ✅ Yes | Open source coding assistant |
| **💻 VS Code** | ✅ Full Support | ✅ Yes | With MCP extensions |
| **⚡ Zed** | ✅ Full Support | ✅ Yes | High-performance editor |

---

## 🛠️ **API Key Setup**

### **Step 1: Get Your SmartLead API Key**
1. Visit [SmartLead Dashboard](https://app.smartlead.ai)
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key
4. Copy the key (keep it secure!)

### **Step 2: Environment Configuration**
```bash
# Create .env file (optional)
SMARTLEAD_API_KEY=your_smartlead_api_key_here
SMARTLEAD_ADVANCED_TOOLS=true    # Enable enterprise features
SMARTLEAD_ADMIN_TOOLS=true       # Enable admin operations
```

---

## 📋 **Manual Configuration Examples**

### **Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["smartlead-mcp-by-leadmagic"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key_here",
        "SMARTLEAD_ADVANCED_TOOLS": "true",
        "SMARTLEAD_ADMIN_TOOLS": "true"
      }
    }
  }
}
```

### **Cursor** (`~/Library/Application Support/Cursor/User/settings.json`)
```json
{
  "cline.mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["smartlead-mcp-by-leadmagic"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key_here",
        "SMARTLEAD_ADVANCED_TOOLS": "true"
      }
    }
  }
}
```

### **Continue.dev** (`~/.continue/config.json`)
```json
{
  "mcpServers": [
    {
      "name": "smartlead",
      "command": "npx",
      "args": ["smartlead-mcp-by-leadmagic"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key_here"
      }
    }
  ]
}
```

---

## 🔧 **Available Tools & Capabilities**

<details>
<summary><strong>🎯 Campaign Management (14 tools)</strong></summary>

- `smartlead_create_campaign` - Create new campaigns
- `smartlead_get_campaign_details` - Retrieve campaign information
- `smartlead_update_campaign` - Modify campaign settings
- `smartlead_delete_campaign` - Remove campaigns
- `smartlead_get_all_campaigns` - List all campaigns
- `smartlead_add_leads_to_campaign` - Import prospects
- `smartlead_get_campaign_leads` - View campaign prospects
- `smartlead_pause_campaign` - Pause campaign execution
- `smartlead_resume_campaign` - Resume paused campaigns
- `smartlead_duplicate_campaign` - Clone existing campaigns
- `smartlead_update_campaign_schedule` - Modify sending schedules
- `smartlead_get_campaign_statistics` - View performance metrics
- `smartlead_export_campaign_data` - Download campaign data
- `smartlead_get_campaign_sequences` - Manage email sequences

</details>

<details>
<summary><strong>👥 Lead Management (17 tools)</strong></summary>

- `smartlead_add_lead` - Add individual prospects
- `smartlead_bulk_add_leads` - Import multiple prospects
- `smartlead_get_lead_details` - View prospect information
- `smartlead_update_lead` - Modify prospect data
- `smartlead_delete_lead` - Remove prospects
- `smartlead_get_all_leads` - List all prospects
- `smartlead_search_leads` - Find specific prospects
- `smartlead_get_lead_activity` - View prospect interactions
- `smartlead_mark_lead_as_interested` - Update lead status
- `smartlead_mark_lead_as_not_interested` - Update lead status
- `smartlead_add_lead_to_dnc` - Add to do-not-contact list
- `smartlead_remove_lead_from_dnc` - Remove from DNC list
- `smartlead_get_lead_replies` - View prospect responses
- `smartlead_export_leads` - Download prospect data
- `smartlead_import_leads_from_csv` - CSV import functionality
- `smartlead_validate_lead_emails` - Email verification
- `smartlead_get_lead_engagement_score` - Engagement metrics

</details>

<details>
<summary><strong>📧 Email Account Management (15 tools)</strong></summary>

- `smartlead_add_email_account` - Connect sending accounts
- `smartlead_get_email_accounts` - List connected accounts
- `smartlead_update_email_account` - Modify account settings
- `smartlead_delete_email_account` - Remove accounts
- `smartlead_test_email_account` - Verify account connectivity
- `smartlead_get_email_account_health` - Check account status
- `smartlead_configure_warmup_settings` - Setup email warmup
- `smartlead_get_warmup_statistics` - View warmup progress
- `smartlead_pause_email_account` - Temporarily disable accounts
- `smartlead_resume_email_account` - Reactivate accounts
- `smartlead_set_sending_limits` - Configure daily limits
- `smartlead_get_sending_statistics` - View sending metrics
- `smartlead_rotate_email_accounts` - Manage account rotation
- `smartlead_backup_email_settings` - Export configurations
- `smartlead_restore_email_settings` - Import configurations

</details>

<details>
<summary><strong>🤖 Smart Senders (12 tools)</strong></summary>

- `smartlead_search_domain` - Domain reputation lookup
- `smartlead_get_vendors` - List email service providers
- `smartlead_add_domain` - Register new domains
- `smartlead_verify_domain` - Validate domain setup
- `smartlead_get_domain_health` - Check domain reputation
- `smartlead_configure_spf_dkim` - Setup authentication
- `smartlead_get_domain_analytics` - Domain performance metrics
- `smartlead_auto_generate_mailboxes` - Create email accounts
- `smartlead_get_mailbox_suggestions` - Account name suggestions
- `smartlead_validate_domain_setup` - Verify DNS configuration
- `smartlead_get_deliverability_score` - Domain health score
- `smartlead_optimize_sender_reputation` - Reputation management

</details>

<details>
<summary><strong>📊 Smart Delivery (11 tools)</strong></summary>

- `smartlead_optimize_send_times` - AI-powered timing optimization
- `smartlead_get_delivery_analytics` - Delivery performance metrics
- `smartlead_configure_sending_patterns` - Setup sending schedules
- `smartlead_get_timezone_recommendations` - Optimal timezone targeting
- `smartlead_set_daily_limits` - Configure sending volumes
- `smartlead_get_deliverability_insights` - Delivery optimization tips
- `smartlead_configure_reply_tracking` - Setup response monitoring
- `smartlead_get_engagement_analytics` - Interaction metrics
- `smartlead_optimize_subject_lines` - AI subject line optimization
- `smartlead_get_spam_score` - Content spam analysis
- `smartlead_configure_unsubscribe_handling` - Manage opt-outs

</details>

<details>
<summary><strong>📈 Analytics & Statistics (18 tools)</strong></summary>

- `smartlead_get_campaign_analytics` - Comprehensive campaign metrics
- `smartlead_get_email_performance` - Email-level statistics
- `smartlead_get_lead_conversion_rates` - Conversion analytics
- `smartlead_get_reply_rates` - Response rate analysis
- `smartlead_get_open_rates` - Email open statistics
- `smartlead_get_click_rates` - Link click analytics
- `smartlead_get_bounce_rates` - Delivery failure analysis
- `smartlead_get_unsubscribe_rates` - Opt-out statistics
- `smartlead_get_roi_analytics` - Return on investment metrics
- `smartlead_get_comparative_analytics` - Campaign comparisons
- `smartlead_export_analytics_data` - Download analytics reports
- `smartlead_get_real_time_stats` - Live performance monitoring
- `smartlead_get_historical_trends` - Long-term performance trends
- `smartlead_get_segmentation_analytics` - Audience segment performance
- `smartlead_get_deliverability_analytics` - Delivery success metrics
- `smartlead_get_engagement_heatmaps` - Interaction visualization
- `smartlead_get_revenue_attribution` - Sales attribution analysis
- `smartlead_create_custom_reports` - Build custom analytics

</details>

<details>
<summary><strong>🔗 Webhooks (9 tools)</strong></summary>

- `smartlead_create_webhook` - Setup webhook endpoints
- `smartlead_get_webhooks` - List configured webhooks
- `smartlead_update_webhook` - Modify webhook settings
- `smartlead_delete_webhook` - Remove webhooks
- `smartlead_test_webhook` - Verify webhook functionality
- `smartlead_get_webhook_logs` - View webhook activity
- `smartlead_configure_webhook_events` - Setup event triggers
- `smartlead_get_webhook_statistics` - Webhook performance metrics
- `smartlead_retry_failed_webhooks` - Reprocess failed events

</details>

<details>
<summary><strong>👤 Client Management (8 tools)</strong></summary>

- `smartlead_create_client` - Add new team members
- `smartlead_get_clients` - List team members
- `smartlead_update_client` - Modify client information
- `smartlead_delete_client` - Remove team members
- `smartlead_get_client_permissions` - View access levels
- `smartlead_update_client_permissions` - Modify permissions
- `smartlead_get_team_analytics` - Team performance metrics
- `smartlead_manage_api_keys` - API key management

</details>

---

## 🔒 **Security & Best Practices**

### **🛡️ Security Features**
- ✅ **API Key Validation** - Real-time verification with SmartLead
- ✅ **Secure Environment Variables** - No hardcoded credentials
- ✅ **Rate Limiting** - Built-in request throttling
- ✅ **Error Sanitization** - No sensitive data in logs
- ✅ **HTTPS Only** - Encrypted API communications

### **🔐 Environment Security**
```bash
# Recommended .env setup
SMARTLEAD_API_KEY=your_secure_api_key
SMARTLEAD_RATE_LIMIT=100           # Requests per minute
SMARTLEAD_TIMEOUT=30000            # Request timeout (ms)
SMARTLEAD_RETRY_ATTEMPTS=3         # Failed request retries
SMARTLEAD_LOG_LEVEL=info           # Logging verbosity
```

---

## 🚀 **Performance & Optimization**

### **⚡ Built for Speed**
- **TypeScript Native** - Full type safety and IntelliSense
- **Bun Optimized** - Lightning-fast JavaScript runtime
- **Connection Pooling** - Efficient API request management
- **Smart Caching** - Reduced API calls with intelligent caching
- **Async/Await** - Non-blocking operations throughout

### **📊 Monitoring & Debugging**
```bash
# Enable debug mode
DEBUG=smartlead:* npx smartlead-mcp-by-leadmagic

# Verbose logging
SMARTLEAD_LOG_LEVEL=debug npx smartlead-mcp-by-leadmagic

# Performance monitoring
SMARTLEAD_METRICS=true npx smartlead-mcp-by-leadmagic
```

---

## 🆘 **Troubleshooting Guide**

### **Common Issues & Solutions**

<details>
<summary><strong>🔑 API Key Issues</strong></summary>

**Problem**: "Invalid API key" error
**Solution**:
1. Verify your API key in SmartLead dashboard
2. Ensure no extra spaces or characters
3. Check environment variable spelling: `SMARTLEAD_API_KEY`
4. Try regenerating the API key

</details>

<details>
<summary><strong>🔌 Connection Issues</strong></summary>

**Problem**: "Connection failed" error
**Solution**:
1. Check your internet connection
2. Verify SmartLead service status
3. Try increasing timeout: `SMARTLEAD_TIMEOUT=60000`
4. Check firewall settings

</details>

<details>
<summary><strong>🤖 MCP Client Issues</strong></summary>

**Problem**: Tools not appearing in MCP client
**Solution**:
1. Restart your MCP client completely
2. Verify configuration file syntax
3. Check file permissions
4. Run installer again: `npx smartlead-mcp-by-leadmagic install`

</details>

<details>
<summary><strong>🚀 Performance Issues</strong></summary>

**Problem**: Slow response times
**Solution**:
1. Enable caching: `SMARTLEAD_CACHE=true`
2. Reduce concurrent requests: `SMARTLEAD_RATE_LIMIT=50`
3. Use local installation instead of npx
4. Check system resources

</details>

---

## 🔄 **Updates & Maintenance**

### **🆙 Staying Updated**
```bash
# Check current version
npx smartlead-mcp-by-leadmagic --version

# Update to latest version
npm update -g smartlead-mcp-by-leadmagic

# Force reinstall
npm uninstall -g smartlead-mcp-by-leadmagic
npm install -g smartlead-mcp-by-leadmagic
```

### **📋 Version History**
- **v1.6.1** - 116+ tools, React Ink installer, TypeScript improvements
- **v1.5.x** - Enhanced error handling, performance optimizations
- **v1.4.x** - Added webhook support, improved analytics
- **v1.3.x** - Smart delivery features, advanced campaign management
- **v1.2.x** - Lead management tools, email account automation
- **v1.1.x** - Core campaign functionality, basic analytics
- **v1.0.x** - Initial release with essential tools

---

## 🤝 **Support & Community**

### **📞 Get Help**
- 📧 **Email Support**: [jesse@leadmagic.io](mailto:jesse@leadmagic.io)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/LeadMagic/smartlead-mcp-server/issues)
- 💬 **Feature Requests**: [GitHub Discussions](https://github.com/LeadMagic/smartlead-mcp-server/discussions)
- 📚 **Documentation**: [Full API Docs](https://github.com/LeadMagic/smartlead-mcp-server/wiki)

### **🌟 Contributing**
We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **📄 License**
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 **Related Projects**

- **[SmartLead Platform](https://smartlead.ai)** - The leading cold email automation platform
- **[LeadMagic](https://leadmagic.io)** - Advanced lead generation and verification tools
- **[Model Context Protocol](https://modelcontextprotocol.io)** - The standard for AI tool integration

---

<div align="center">

**🚀 Ready to revolutionize your cold email game?**

```bash
npx smartlead-mcp-by-leadmagic install
```

**Made with 💜 by [LeadMagic](https://leadmagic.io) • Official SmartLead Partner**

[![GitHub](https://img.shields.io/badge/GitHub-LeadMagic/smartlead--mcp--server-7c3aed?style=for-the-badge&logo=github)](https://github.com/LeadMagic/smartlead-mcp-server)
[![NPM](https://img.shields.io/badge/NPM-smartlead--mcp--by--leadmagic-7c3aed?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/smartlead-mcp-by-leadmagic)

</div>
