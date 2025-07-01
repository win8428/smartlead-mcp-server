# 💜 SmartLead MCP Server - Cold Email Automation for AI

<div align="center">

**🚀 The #1 Model Context Protocol Server for SmartLead Cold Email Platform**

[![NPM](https://img.shields.io/npm/v/smartlead-mcp-by-leadmagic?style=for-the-badge&color=7c3aed&logo=npm)](https://www.npmjs.com/package/smartlead-mcp-by-leadmagic)
[![Downloads](https://img.shields.io/npm/dt/smartlead-mcp-by-leadmagic?style=for-the-badge&color=7c3aed)](https://www.npmjs.com/package/smartlead-mcp-by-leadmagic)
[![GitHub](https://img.shields.io/github/stars/LeadMagic/smartlead-mcp-server?style=for-the-badge&color=7c3aed&logo=github)](https://github.com/LeadMagic/smartlead-mcp-server)
[![License](https://img.shields.io/badge/License-MIT-7c3aed?style=for-the-badge)](LICENSE)

**✨ 116+ API Tools • 🎨 Beautiful Installer • ⚡ 1-Click Setup • 🛡️ Enterprise Ready ✨**

*Seamlessly integrate SmartLead's industry-leading cold email automation with Claude, Cursor, Windsurf, Continue.dev, VS Code, and all AI coding assistants*

</div>

---

## 🎯 **Why Choose SmartLead MCP Server?**

Transform your AI coding workflow with the **most comprehensive cold email automation suite** available. Built by [LeadMagic](https://leadmagic.io) (official SmartLead partner), this server delivers **complete SmartLead API access** through a **gorgeous React Ink installer**.

### **🔥 Key Benefits**
- **💜 Beautiful Setup Experience** - Stunning purple gradient installer that users love
- **🚀 Complete API Coverage** - All 116+ SmartLead endpoints in one package  
- **⚡ Zero Configuration** - Auto-detects and configures all MCP clients instantly
- **🛡️ Production Ready** - TypeScript, error handling, security best practices
- **🎯 AI-Optimized** - Perfect integration with Claude, Cursor, and all AI tools

---

## 🚀 **Quick Start (30 seconds)**

### **Option 1: NPX (Recommended)**
```bash
# Beautiful interactive installer
npx smartlead-mcp-by-leadmagic install

# Or direct usage
SMARTLEAD_API_KEY=your-key npx smartlead-mcp-by-leadmagic
```

### **Option 2: Global Install**
```bash
npm install -g smartlead-mcp-by-leadmagic
smartlead-mcp-by-leadmagic install
```

**🔑 Get your SmartLead API key**: [app.smartlead.ai](https://app.smartlead.ai) → Settings → API Keys

---

## 💜 **Beautiful Interactive Installer**

Our **React Ink installer** is a masterpiece of UX design:

- 💜 **Stunning purple gradients** matching SmartLead's brand
- 🔍 **Smart auto-detection** of Claude, Cursor, Windsurf, Continue, VS Code, Zed
- 🔑 **Real-time API validation** with SmartLead servers
- ⚡ **One-click configuration** for all MCP clients
- 🎯 **Intelligent error handling** with helpful guidance
- 📱 **Cross-platform** support (macOS, Linux, Windows)

---

## 🔗 **Supported AI Tools**

| Tool | Status | Auto-Config | Notes |
|------|--------|-------------|-------|
| **🤖 Claude Desktop** | ✅ Full | ✅ Yes | Anthropic's flagship |
| **🎯 Cursor** | ✅ Full | ✅ Yes | AI code editor |
| **🏄 Windsurf** | ✅ Full | ✅ Yes | Codeium IDE |
| **🔄 Continue.dev** | ✅ Full | ✅ Yes | Open source |
| **💻 VS Code** | ✅ Full | ✅ Yes | With MCP extensions |
| **⚡ Zed** | ✅ Full | ✅ Yes | High-performance |

---

## 🛠️ **Complete SmartLead API (116+ Tools)**

| Category | Tools | Description |
|----------|-------|-------------|
| **🎯 Campaign Management** | 14 | Create, manage, optimize campaigns |
| **👥 Lead Management** | 17 | Import, track, engage prospects |
| **📧 Email Accounts** | 15 | Configure sending & warmup |
| **🤖 Smart Senders** | 12 | Domain & deliverability management |
| **📊 Smart Delivery** | 11 | Optimize timing & placement |
| **📈 Analytics** | 18 | Performance & ROI tracking |
| **🔗 Webhooks** | 9 | Real-time integrations |
| **👤 Team Management** | 8 | Client & API key management |
| **🔧 Advanced Tools** | 12+ | Enterprise automation |

<details>
<summary><strong>🎯 Campaign Tools (Click to expand)</strong></summary>

- `smartlead_create_campaign` - Create new cold email campaigns
- `smartlead_update_campaign` - Modify campaign settings
- `smartlead_get_campaign_analytics` - Performance metrics
- `smartlead_pause_campaign` - Pause/resume campaigns
- `smartlead_duplicate_campaign` - Clone successful campaigns
- `smartlead_export_campaign_data` - Download campaign data
- And 8 more campaign management tools...

</details>

<details>
<summary><strong>👥 Lead Management Tools (Click to expand)</strong></summary>

- `smartlead_add_leads_to_campaign` - Import prospects
- `smartlead_get_lead_replies` - View responses
- `smartlead_update_lead_status` - Manage prospect status
- `smartlead_export_leads` - Download prospect data
- `smartlead_validate_emails` - Email verification
- And 12 more lead management tools...

</details>

---

## 📋 **Configuration Examples**

### **Claude Desktop**
```json
{
  "mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["smartlead-mcp-by-leadmagic"],
      "env": {
        "SMARTLEAD_API_KEY": "your_api_key",
        "SMARTLEAD_ADVANCED_TOOLS": "true"
      }
    }
  }
}
```

### **Cursor/VS Code**
```json
{
  "cline.mcpServers": {
    "smartlead": {
      "command": "npx",
      "args": ["smartlead-mcp-by-leadmagic"],
      "env": { "SMARTLEAD_API_KEY": "your_api_key" }
    }
  }
}
```

---

## 🔒 **Enterprise Security**

- ✅ **API Key Validation** - Real-time verification
- ✅ **Environment Variables** - No hardcoded secrets
- ✅ **Rate Limiting** - Respects API limits
- ✅ **Error Sanitization** - No data leaks
- ✅ **HTTPS Only** - Encrypted communications

---

## 🚀 **Performance**

- **⚡ Lightning Fast** - TypeScript + Bun optimized
- **🎯 Smart Caching** - Reduced API calls
- **📊 Monitoring** - Built-in performance tracking
- **🔄 Auto-Retry** - Resilient error handling
- **📱 Cross-Platform** - Works everywhere

---

## 🆘 **Quick Troubleshooting**

| Issue | Solution |
|-------|----------|
| **API Key Error** | Verify key at [app.smartlead.ai](https://app.smartlead.ai) |
| **Tools Missing** | Restart your AI client completely |
| **Connection Failed** | Check internet & firewall settings |
| **Slow Performance** | Use global install vs npx |

---

## 🔄 **Updates**

```bash
# Check version
npx smartlead-mcp-by-leadmagic --version

# Update
npm update -g smartlead-mcp-by-leadmagic

# Reinstall
npm uninstall -g smartlead-mcp-by-leadmagic
npm install -g smartlead-mcp-by-leadmagic
```

---

## 🤝 **Support & Links**

- 📧 **Support**: [jesse@leadmagic.io](mailto:jesse@leadmagic.io)
- 🐛 **Issues**: [GitHub Issues](https://github.com/LeadMagic/smartlead-mcp-server/issues)
- 📚 **Docs**: [Full Documentation](https://github.com/LeadMagic/smartlead-mcp-server/wiki)
- 🌐 **SmartLead**: [smartlead.ai](https://smartlead.ai)
- 🔧 **LeadMagic**: [leadmagic.io](https://leadmagic.io)

---

## 📄 **License & Contributing**

MIT License - see [LICENSE](LICENSE) file. Contributions welcome via [GitHub](https://github.com/LeadMagic/smartlead-mcp-server).

---

<div align="center">

**🚀 Ready to automate your cold email campaigns with AI?**

```bash
npx smartlead-mcp-by-leadmagic install
```

**Made with 💜 by [LeadMagic](https://leadmagic.io) • Official SmartLead Partner**

[![NPM](https://img.shields.io/badge/NPM-smartlead--mcp--by--leadmagic-7c3aed?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/smartlead-mcp-by-leadmagic)
[![GitHub](https://img.shields.io/badge/GitHub-LeadMagic%2Fsmartlead--mcp--server-7c3aed?style=for-the-badge&logo=github)](https://github.com/LeadMagic/smartlead-mcp-server)

**Keywords**: SmartLead, MCP, Model Context Protocol, Cold Email, Email Marketing, AI Tools, Claude, Cursor, Windsurf, Continue, VS Code, Campaign Management, Lead Generation, Email Automation, Sales Automation, TypeScript, React Ink

</div>
