# Security Policy

## Supported Versions

We actively support the following versions of SmartLead MCP Server with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of SmartLead MCP Server seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Create Public Issues

Please **do not** create public GitHub issues for security vulnerabilities. This helps protect users who haven't yet updated to a patched version.

### 2. Report Privately

Send your security report to: **security@leadmagic.io**

Include the following information:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested fixes or mitigations

### 3. Response Timeline

- **Initial Response**: Within 24 hours
- **Vulnerability Assessment**: Within 72 hours
- **Fix Development**: Depends on severity (1-14 days)
- **Release**: As soon as fix is ready and tested

### 4. Disclosure Policy

- We will acknowledge receipt of your report within 24 hours
- We will provide regular updates on our progress
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a fix is released
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables or secure secret management
   - Rotate API keys regularly
   - Limit API key permissions to minimum required

2. **Environment Security**
   - Keep dependencies updated
   - Use the latest version of SmartLead MCP Server
   - Monitor for security advisories
   - Use secure network connections

3. **Configuration Security**
   - Review MCP client configurations
   - Limit server access to trusted clients only
   - Use proper file permissions for configuration files
   - Regularly audit server logs

### For Developers

1. **Code Security**
   - Follow secure coding practices
   - Validate all inputs
   - Use parameterized queries
   - Implement proper error handling

2. **Dependency Security**
   - Regularly update dependencies
   - Use `npm audit` to check for vulnerabilities
   - Pin dependency versions in production
   - Review dependency licenses and security policies

3. **API Security**
   - Implement rate limiting
   - Use HTTPS for all API communications
   - Validate API responses
   - Handle authentication errors properly

## Known Security Considerations

### API Key Exposure

- API keys are passed as environment variables
- Ensure proper process isolation in shared environments
- Consider using secret management systems in production

### Network Security

- All API communications use HTTPS
- No sensitive data is logged by default
- Consider network-level security controls

### Input Validation

- All inputs are validated using Zod schemas
- SQL injection is not applicable (REST API client)
- XSS protection through proper output encoding

## Security Updates

Security updates will be released as patch versions and announced through:

- GitHub Security Advisories
- Release notes
- Email notifications to maintainers

## Contact

For security-related questions or concerns:

- **Email**: support@leadmagic.io
- **GitHub**: Create a private security advisory
- **Website**: https://leadmagic.io

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities to us.
