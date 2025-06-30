# Changelog

All notable changes to the SmartLead MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-01

### Added
- Initial release of SmartLead MCP Server
- Campaign management tools (8 core tools implemented)
- Interactive installer for easy setup
- Comprehensive error handling and retry logic
- Type-safe API client with Zod validation
- Support for all major MCP clients (Claude, Cursor, Windsurf, Continue.dev)
- Production-ready logging and debugging
- Graceful shutdown handling
- Cross-platform compatibility

### Campaign Management Tools
- `smartlead_create_campaign` - Create new email campaigns
- `smartlead_update_campaign_schedule` - Update campaign sending schedules
- `smartlead_update_campaign_settings` - Update general campaign settings
- `smartlead_update_campaign_status` - Control campaign execution (START/PAUSE/STOP)
- `smartlead_get_campaign` - Retrieve campaign details
- `smartlead_list_campaigns` - List all campaigns with filtering
- `smartlead_save_campaign_sequence` - Configure email sequences with A/B testing
- `smartlead_get_campaign_sequence` - Retrieve email sequence configuration

### Technical Features
- Built with TypeScript for type safety
- Comprehensive error handling with SmartLeadError class
- Exponential backoff retry logic for API resilience
- Rate limiting and request queuing
- Environment variable configuration
- Interactive React-based installer using Ink
- Professional logging with context and debugging
- Graceful shutdown with proper cleanup

### Documentation
- Comprehensive README with setup instructions
- API documentation with examples
- Configuration guide for all supported MCP clients
- Troubleshooting guide
- Contributing guidelines

## [Unreleased]

### Planned Features
- Lead management tools (8 tools)
- Statistics and analytics tools (6 tools)
- Smart delivery tools (4 tools)
- Webhook management tools (3 tools)
- Client management tools (4 tools)
- Smart senders tools (5 tools)
- Enhanced installer with API key validation
- Configuration file auto-generation
- Health check endpoints
- Metrics and monitoring
- Docker support
- CI/CD pipeline
