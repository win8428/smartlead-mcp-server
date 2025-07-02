# 📁 SmartLead MCP Server - Project Structure

## 🏗️ **Root Directory Structure**

```
smartlead-mcp-server/
├── 📄 README.md                    # Main project documentation
├── 📄 INSTALLATION.md              # Installation guide
├── 📄 CHANGELOG.md                 # Version history and changes
├── 📄 SECURITY.md                  # Security guidelines and policies
├── 📄 LICENSE                      # MIT license
├── 📄 package.json                 # NPM package configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 biome.json                   # Biome linter/formatter config
├── 📄 .eslintrc.json               # ESLint configuration (legacy)
├── 📄 .env.example                 # Environment variables template
├── 📄 mcp-settings-example.json    # MCP client configuration example
├── 📁 src/                         # Source code directory
├── 📁 scripts/                     # Build and utility scripts
├── 📁 .vscode/                     # VS Code workspace settings
├── 📁 .cursor/                     # Cursor IDE rules and settings
├── 📁 dist/                        # Compiled JavaScript output
└── 📁 node_modules/                # Dependencies (auto-generated)
```

---

## 🎯 **Source Code Architecture (`src/`)**

### **📂 Core Files**
```
src/
├── 📄 index.ts                     # Main entry point & CLI router
├── 📄 server.ts                    # MCP server implementation
├── 📄 client.ts                    # Legacy SmartLead API client
├── 📄 installer.tsx                # Beautiful React Ink installer
└── 📄 types.ts                     # Global TypeScript types & Zod schemas
```

### **📂 Client Architecture (`src/client/`)**
```
src/client/
├── 📄 index.ts                     # Modern SmartLead client (main)
└── 📄 base.ts                      # Base client with HTTP handling
```

### **📂 API Modules (`src/modules/`)**
```
src/modules/
├── 📄 analytics/client.ts          # Analytics & reporting API
├── 📄 campaigns/client.ts          # Campaign management API
├── 📄 client-management/client.ts  # Team & client management API
├── 📄 email-accounts/client.ts     # Email account management API
├── 📄 leads/client.ts              # Lead & prospect management API
├── 📄 smart-delivery/client.ts     # Deliverability & placement API
├── 📄 smart-senders/client.ts      # Domain & sender management API
├── 📄 statistics/client.ts         # Statistics & metrics API
└── 📄 webhooks/client.ts           # Webhook management API
```

### **📂 MCP Tools (`src/tools/`)**
```
src/tools/
├── 📄 index.ts                     # Tool registration exports
├── 📄 analytics.ts                 # Analytics MCP tools (18 tools)
├── 📄 campaigns.ts                 # Campaign MCP tools (14 tools)
├── 📄 client-management.ts         # Client management MCP tools (8 tools)
├── 📄 email-accounts.ts            # Email account MCP tools (15 tools)
├── 📄 leads.ts                     # Lead management MCP tools (17 tools)
├── 📄 smart-delivery.ts            # Smart delivery MCP tools (11 tools)
├── 📄 smart-senders.ts             # Smart senders MCP tools (12 tools)
├── 📄 statistics.ts                # Statistics MCP tools (18 tools)
└── 📄 webhooks.ts                  # Webhook MCP tools (9 tools)
```

### **📂 Type Definitions (`src/types/`)**
```
src/types/
└── 📄 config.ts                    # MCP configuration types
```

---

## 🔧 **Configuration Files**

### **📄 TypeScript Configuration (`tsconfig.json`)**
- **Target**: ES2022 with modern features
- **Module**: ESNext with bundler resolution
- **Strict**: Full TypeScript strict mode enabled
- **Output**: Compiled to `dist/` directory
- **JSX**: React JSX for installer components

### **📄 Package Configuration (`package.json`)**
- **Name**: `smartlead-mcp-by-leadmagic`
- **Version**: 1.6.2
- **Type**: ESM module
- **Engines**: Node.js >=20.0.0
- **Dependencies**: MCP SDK, React Ink, Axios, Zod
- **Scripts**: Build, lint, format, test, publish

### **📄 Biome Configuration (`biome.json`)**
- **Linting**: TypeScript-aware with strict rules
- **Formatting**: Consistent code style
- **Imports**: Organized and sorted
- **Rules**: Production-ready standards

---

## 🚀 **Build System**

### **📁 Scripts Directory (`scripts/`)**
```
scripts/
└── 📄 add-mcp-annotations.ts       # MCP tool annotation utility
```

### **📁 Build Output (`dist/`)**
```
dist/
├── 📁 src/                         # Compiled TypeScript
├── 📁 scripts/                     # Compiled utility scripts
└── 📄 *.js.map                     # Source maps for debugging
```

### **Build Process**
1. **Clean**: Remove old build artifacts
2. **Compile**: TypeScript → JavaScript (ESM)
3. **Post-build**: Set executable permissions
4. **Package**: Create NPM package (.tgz)

---

## 🎨 **Development Environment**

### **📁 VS Code Settings (`.vscode/`)**
```
.vscode/
├── 📄 settings.json                # Workspace settings
└── 📄 extensions.json              # Recommended extensions
```

### **📁 Cursor Rules (`.cursor/`)**
```
.cursor/
└── 📁 rules/
    ├── 📄 project-overview.mdc     # Project structure guide
    ├── 📄 api-patterns.mdc         # API development patterns
    ├── 📄 mcp-tools.mdc            # MCP tool development guide
    └── 📄 typescript-standards.mdc # TypeScript coding standards
```

---

## 📊 **Code Metrics**

### **📈 File Count by Category**
- **Core Files**: 5 files
- **API Modules**: 9 files (116+ tools total)
- **MCP Tools**: 10 files
- **Type Definitions**: 2 files
- **Configuration**: 8 files
- **Documentation**: 5 files

### **📏 Lines of Code (Estimated)**
- **TypeScript Source**: ~15,000 lines
- **Configuration**: ~500 lines
- **Documentation**: ~2,000 lines
- **Total Project**: ~17,500 lines

---

## 🔗 **Dependency Architecture**

### **📦 Core Dependencies**
- **@modelcontextprotocol/sdk**: MCP protocol implementation
- **axios**: HTTP client for SmartLead API
- **zod**: Runtime type validation
- **dotenv**: Environment variable management

### **🎨 UI Dependencies**
- **react**: React framework for installer
- **ink**: Terminal UI components
- **ink-***: Specialized terminal components

### **🛠️ Development Dependencies**
- **typescript**: TypeScript compiler
- **@biomejs/biome**: Linting and formatting
- **@types/***: TypeScript type definitions

---

## 🚦 **Entry Points**

### **📍 Main Entry Point (`src/index.ts`)**
- **CLI Router**: Handles install vs server mode
- **Environment Setup**: Loads configuration
- **Error Handling**: Graceful startup/shutdown

### **📍 MCP Server (`src/server.ts`)**
- **Tool Registration**: Registers all 116+ tools
- **Client Management**: Handles MCP connections
- **Error Handling**: Production-ready error responses

### **📍 Installer (`src/installer.tsx`)**
- **React Ink UI**: Beautiful terminal interface
- **Auto-detection**: Finds MCP clients automatically
- **Configuration**: Zero-config setup for all clients

---

## 🔒 **Security Architecture**

### **🛡️ API Security**
- **Environment Variables**: No hardcoded secrets
- **Input Validation**: Zod schemas for all inputs
- **Error Sanitization**: No sensitive data in logs
- **Rate Limiting**: Respects SmartLead API limits

### **🔐 Configuration Security**
- **File Permissions**: Secure config file handling
- **API Key Validation**: Real-time verification
- **HTTPS Only**: Encrypted API communications

---

## 📝 **Documentation Structure**

### **📚 User Documentation**
- **README.md**: Marketing-optimized overview
- **INSTALLATION.md**: Detailed setup guide
- **SECURITY.md**: Security best practices

### **📋 Developer Documentation**
- **CHANGELOG.md**: Version history
- **PROJECT_STRUCTURE.md**: This file
- **Cursor Rules**: IDE-specific guidance

---

## 🎯 **Best Practices Implemented**

### **🏗️ Architecture Patterns**
- **Modular Design**: Separated concerns by functionality
- **Type Safety**: Comprehensive TypeScript coverage
- **Error Handling**: Consistent error patterns
- **Configuration**: Environment-based setup

### **📦 Package Management**
- **Semantic Versioning**: Clear version strategy
- **Dependency Pinning**: Stable dependency versions
- **Build Optimization**: Efficient compilation
- **Distribution**: NPM package ready

### **🔧 Development Workflow**
- **Linting**: Automated code quality checks
- **Formatting**: Consistent code style
- **Type Checking**: Zero TypeScript errors
- **Testing**: Validation scripts 