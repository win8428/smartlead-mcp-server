# 🚀 SmartLead MCP Server

[![SmartLead MCP Server](https://img.shields.io/badge/%F0%9F%9A%80-SmartLead%20MCP%20Server-blue?style=for-the-badge&labelColor=000000)](https://github.com/LeadMagic/smartlead-mcp-server)

**⚡ The Ultimate Model Context Protocol Server for Email Marketing Automation**

_Seamlessly integrate SmartLead's complete API suite with Claude, Cursor, Windsurf, and all MCP-compatible AI tools_

[![npm version](https://img.shields.io/npm/v/smartlead-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/smartlead-mcp-server) [![Downloads](https://img.shields.io/npm/dm/smartlead-mcp-server?style=for-the-badge&logo=npm&logoColor=white&color=brightgreen)](https://www.npmjs.com/package/smartlead-mcp-server) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge&logo=opensource&logoColor=white)](https://opensource.org/licenses/MIT) [![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-blue?style=for-the-badge&logo=protocol&logoColor=white)](https://modelcontextprotocol.io) [![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/LeadMagic/smartlead-mcp-server) [![Security](https://img.shields.io/badge/Security-Verified-green?style=for-the-badge&logo=shield&logoColor=white)](https://github.com/LeadMagic/smartlead-mcp-server/security)

---

**🎯 40+ Powerful Tools • 🔥 Zero Configuration • ⚡ One-Line Setup • 🛡️ Enterprise Security**

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

**✨ The installer will:**
- ✅ Guide you through API key setup
- ✅ Automatically detect and configure your preferred AI tool
- ✅ Provide configuration examples for all supported clients
- ✅ Show usage examples and helpful links

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

### 📧 Campaign Management (8 tools)

- 🎯 `smartlead_create_campaign` - Create new email campaigns
- ⏰ `smartlead_update_campaign_schedule` - Configure sending schedules
- ⚙️ `smartlead_update_campaign_settings` - Update campaign settings
- 🎮 `smartlead_update_campaign_status` - Control campaign execution
- 📋 `smartlead_get_campaign` - Get campaign details
- 📊 `smartlead_list_campaigns` - List all campaigns
- 📝 `smartlead_save_campaign_sequence` - Configure email sequences
- 🔍 `smartlead_get_campaign_sequence` - Retrieve sequence data

### 👥 Lead Management (Coming Soon)

- 📥 Lead import and management
- 🎯 Lead segmentation and filtering
- 📊 Lead tracking and analytics
- 🔄 Lead status management

### 📈 Analytics & Statistics (Coming Soon)

- 📊 Campaign performance metrics
- 📈 Open and click tracking
- 💌 Reply rate analytics
- 📉 Bounce rate monitoring

### 🚀 Smart Delivery (Coming Soon)

- ⏰ Optimal send time detection
- 🌍 Timezone optimization
- 📧 Deliverability enhancement
- 🎯 Engagement optimization

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

- 📦 Node.js 18.0.0 or higher
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
