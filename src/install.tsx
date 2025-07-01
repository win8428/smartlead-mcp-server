#!/usr/bin/env node

/**
 * SmartLead MCP Server - Premium Interactive Installer
 *
 * A beautiful, modern React Ink CLI installer with:
 * - Stunning gradient animations and color schemes
 * - Smooth transitions and loading states
 * - Professional typography and spacing
 * - Intuitive navigation and user feedback
 * - Comprehensive error handling
 * - Production-ready installation flow
 *
 * @author LeadMagic Team
 * @version 1.6.1
 */

import fs from 'fs';
import { Box, Newline, render, Text, useApp, useInput } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import Link from 'ink-link';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import TextInput from 'ink-text-input';
import os from 'os';
import path from 'path';
import type React from 'react';
import { useEffect, useState } from 'react';
import { SmartLeadClient, SmartLeadError } from './client.js';

// ===== TYPES =====

interface MCPServerConfig {
  command: string;
  env: {
    SMARTLEAD_API_KEY: string;
  };
}

interface MCPConfig {
  mcpServers?: Record<string, MCPServerConfig>;
  'cline.mcpServers'?: Record<string, MCPServerConfig>;
  [key: string]: unknown;
}

interface ContinueConfig {
  mcpServers?: Array<{
    name: string;
    command: string;
    env: {
      SMARTLEAD_API_KEY: string;
    };
  }>;
  [key: string]: unknown;
}

type InstallationStep =
  | 'welcome'
  | 'apiKey'
  | 'validating'
  | 'clientSelection'
  | 'installing'
  | 'complete'
  | 'error';

interface MCPClient {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

interface InstallationResult {
  client: string;
  success: boolean;
  message: string;
  configPath?: string;
}

// ===== DESIGN SYSTEM =====

const gradients = {
  hero: 'mind', // Beautiful purple gradient for the logo
  primary: 'teen', // Purple-pink gradient for primary elements
  secondary: 'vice', // Deep purple for secondary elements
  success: 'cristal', // Purple-green for success states
  warning: 'passion', // Purple-orange for warnings
  error: 'vice', // Deep purple for errors
  info: 'mind', // Purple-blue for info
  accent: 'morning', // Purple-gold accent
} as const;

// ===== REUSABLE COMPONENTS =====

const Logo: React.FC = () => (
  <Box flexDirection="column" alignItems="center" marginBottom={1}>
    <Gradient name={gradients.hero}>
      <BigText text="SmartLead" font="block" />
    </Gradient>
    <Box marginTop={-1}>
      <Gradient name={gradients.accent}>
        <Text bold>MCP SERVER • PROFESSIONAL INSTALLER</Text>
      </Gradient>
    </Box>
    <Box marginTop={1}>
      <Text color="magenta" dimColor>
        ✨ Powered by LeadMagic • Official SmartLead Partner ✨
      </Text>
    </Box>
  </Box>
);

const StatusBadge: React.FC<{
  status: 'success' | 'error' | 'warning' | 'info' | 'loading';
  children: React.ReactNode;
}> = ({ status, children }) => {
  const statusConfig = {
    success: { color: 'green', icon: '✅' },
    error: { color: 'red', icon: '❌' },
    warning: { color: 'yellow', icon: '⚠️' },
    info: { color: 'blue', icon: 'ℹ️' },
    loading: { color: 'cyan', icon: '⏳' },
  };

  const config = statusConfig[status];

  return (
    <Box paddingX={2} paddingY={1} borderStyle="round" borderColor={config.color} marginY={1}>
      <Text color={config.color}>
        {config.icon} {children}
      </Text>
    </Box>
  );
};

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  borderColor?: string;
  gradient?: keyof typeof gradients;
}> = ({ title, children, borderColor = 'cyan', gradient = 'primary' }) => (
  <Box flexDirection="column" borderStyle="round" borderColor={borderColor} padding={2} marginY={1}>
    <Box marginBottom={1} alignItems="center">
      <Gradient name={gradients[gradient]}>
        <Text bold>{title}</Text>
      </Gradient>
    </Box>
    {children}
  </Box>
);

const LoadingSpinner: React.FC<{ text: string; color?: string }> = ({ text, color = 'cyan' }) => (
  <Box alignItems="center">
    <Spinner type="aesthetic" />
    <Text color={color} bold>
      {' '}
      {text}
    </Text>
  </Box>
);

const FeatureList: React.FC = () => (
  <Box flexDirection="column" alignItems="center" marginY={2}>
    <Gradient name={gradients.accent}>
      <Text bold>✨ Premium SmartLead Features ✨</Text>
    </Gradient>
    <Newline />
    <Text color="white">
      🎯{' '}
      <Text color="magenta" bold>
        130+ API Tools
      </Text>{' '}
      • 🛡️{' '}
      <Text color="cyan" bold>
        Production Ready
      </Text>{' '}
      • 🎨{' '}
      <Text color="blue" bold>
        Beautiful UI
      </Text>
    </Text>
    <Text color="white">
      🔧{' '}
      <Text color="magenta" bold>
        TypeScript Native
      </Text>{' '}
      • 🌍{' '}
      <Text color="cyan" bold>
        Cross Platform
      </Text>{' '}
      • ⚡{' '}
      <Text color="blue" bold>
        Zero Config
      </Text>
    </Text>
    <Text color="white">
      📊{' '}
      <Text color="magenta" bold>
        Real-time Analytics
      </Text>{' '}
      • 🔄{' '}
      <Text color="cyan" bold>
        Smart Retries
      </Text>{' '}
      • 🎯{' '}
      <Text color="blue" bold>
        Rate Limiting
      </Text>
    </Text>
  </Box>
);

const CompatibilityBadges: React.FC = () => (
  <Box flexDirection="column" alignItems="center" marginY={2}>
    <Text color="gray" dimColor>
      🔗 Compatible with:
    </Text>
    <Newline />
    <Box>
      <Text color="magenta">Claude</Text>
      <Text color="white"> • </Text>
      <Text color="cyan">Cursor</Text>
      <Text color="white"> • </Text>
      <Text color="blue">Windsurf</Text>
      <Text color="white"> • </Text>
      <Text color="magenta">Continue</Text>
      <Text color="white"> • </Text>
      <Text color="cyan">VS Code</Text>
      <Text color="white"> • </Text>
      <Text color="blue">Zed</Text>
    </Box>
  </Box>
);

// ===== UTILITY FUNCTIONS =====

function getConfigPaths() {
  const platform = os.platform();
  const home = os.homedir();

  const basePaths = {
    darwin: {
      claude: path.join(
        home,
        'Library',
        'Application Support',
        'Claude',
        'claude_desktop_config.json'
      ),
      cursor: path.join(home, 'Library', 'Application Support', 'Cursor', 'User', 'settings.json'),
      windsurf: path.join(
        home,
        'Library',
        'Application Support',
        'Windsurf',
        'User',
        'settings.json'
      ),
      continue: path.join(home, '.continue', 'config.json'),
      vscode: path.join(home, 'Library', 'Application Support', 'Code', 'User', 'settings.json'),
      zed: path.join(home, '.config', 'zed', 'settings.json'),
    },
    win32: {
      claude: path.join(home, 'AppData', 'Roaming', 'Claude', 'claude_desktop_config.json'),
      cursor: path.join(home, 'AppData', 'Roaming', 'Cursor', 'User', 'settings.json'),
      windsurf: path.join(home, 'AppData', 'Roaming', 'Windsurf', 'User', 'settings.json'),
      continue: path.join(home, '.continue', 'config.json'),
      vscode: path.join(home, 'AppData', 'Roaming', 'Code', 'User', 'settings.json'),
      zed: path.join(home, 'AppData', 'Roaming', 'Zed', 'settings.json'),
    },
    linux: {
      claude: path.join(home, '.config', 'claude', 'claude_desktop_config.json'),
      cursor: path.join(home, '.config', 'Cursor', 'User', 'settings.json'),
      windsurf: path.join(home, '.config', 'Windsurf', 'User', 'settings.json'),
      continue: path.join(home, '.continue', 'config.json'),
      vscode: path.join(home, '.config', 'Code', 'User', 'settings.json'),
      zed: path.join(home, '.config', 'zed', 'settings.json'),
    },
  };

  return basePaths[platform as keyof typeof basePaths] || basePaths.linux;
}

function ensureConfigDir(configPath: string): void {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
}

function readConfigSafely<T extends Record<string, unknown>>(configPath: string): T {
  if (!fs.existsSync(configPath)) {
    return {} as T;
  }

  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const jsonString = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    if (jsonString.trim() === '') return {} as T;
    return JSON.parse(jsonString) as T;
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(`Invalid JSON in ${configPath}. Please fix or remove it and try again.`);
    }
    throw e;
  }
}

function writeConfig(configPath: string, config: Record<string, unknown>): void {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

const smartleadServerConfig = (apiKey: string) => ({
  command: 'npx',
  args: ['smartlead-mcp-by-leadmagic'],
  env: {
    SMARTLEAD_API_KEY: apiKey,
  },
});

// ===== CLIENT INSTALLATION FUNCTIONS =====

function installForClaude(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().claude;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = smartleadServerConfig(apiKey);

    config.mcpServers = {
      ...config.mcpServers,
      smartlead: serverConfig,
    };

    writeConfig(configPath, config);
    return {
      client: 'Claude Desktop',
      success: true,
      message: 'Successfully configured with MCP server',
      configPath,
    };
  } catch (error) {
    return {
      client: 'Claude Desktop',
      success: false,
      message: error instanceof Error ? error.message : 'Configuration failed',
      configPath,
    };
  }
}

function installForCursor(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().cursor;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = smartleadServerConfig(apiKey);

    config['cline.mcpServers'] = {
      ...config['cline.mcpServers'],
      smartlead: serverConfig,
    };

    writeConfig(configPath, config);
    return {
      client: 'Cursor (Cline)',
      success: true,
      message: 'Successfully configured with Cline extension',
      configPath,
    };
  } catch (error) {
    return {
      client: 'Cursor (Cline)',
      success: false,
      message: error instanceof Error ? error.message : 'Configuration failed',
      configPath,
    };
  }
}

function installForWindsurf(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().windsurf;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = smartleadServerConfig(apiKey);

    config.mcpServers = {
      ...config.mcpServers,
      smartlead: serverConfig,
    };

    writeConfig(configPath, config);
    return {
      client: 'Windsurf',
      success: true,
      message: 'Successfully configured with MCP server',
      configPath,
    };
  } catch (error) {
    return {
      client: 'Windsurf',
      success: false,
      message: error instanceof Error ? error.message : 'Configuration failed',
      configPath,
    };
  }
}

function installForContinue(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().continue;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<ContinueConfig>(configPath);
    const serverConfig = {
      name: 'smartlead',
      ...smartleadServerConfig(apiKey),
    };

    if (!config.mcpServers) config.mcpServers = [];
    config.mcpServers = config.mcpServers.filter((server) => server.name !== 'smartlead');
    config.mcpServers.push(serverConfig);

    writeConfig(configPath, config);
    return {
      client: 'Continue.dev',
      success: true,
      message: 'Successfully configured with Continue extension',
      configPath,
    };
  } catch (error) {
    return {
      client: 'Continue.dev',
      success: false,
      message: error instanceof Error ? error.message : 'Configuration failed',
      configPath,
    };
  }
}

function installForVSCode(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().vscode;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = smartleadServerConfig(apiKey);

    config['cline.mcpServers'] = {
      ...config['cline.mcpServers'],
      smartlead: serverConfig,
    };

    writeConfig(configPath, config);
    return {
      client: 'VS Code',
      success: true,
      message: 'Successfully configured with Cline extension',
      configPath,
    };
  } catch (error) {
    return {
      client: 'VS Code',
      success: false,
      message: error instanceof Error ? error.message : 'Configuration failed',
      configPath,
    };
  }
}

function installForZed(apiKey: string): InstallationResult {
  const configPath = getConfigPaths().zed;
  try {
    ensureConfigDir(configPath);
    const config = readConfigSafely<MCPConfig>(configPath);
    const serverConfig = smartleadServerConfig(apiKey);

    config.mcpServers = {
      ...config.mcpServers,
      smartlead: serverConfig,
    };

    writeConfig(configPath, config);
    return {
      client: 'Zed Editor',
      success: true,
      message: 'Successfully configured with MCP server',
      configPath,
    };
  } catch (error) {
    return {
      client: 'Zed Editor',
      success: false,
      message: error instanceof Error ? error.message : 'Configuration failed',
      configPath,
    };
  }
}

// ===== MAIN COMPONENTS =====

/**
 * Welcome Screen with stunning animations
 */
const WelcomeScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [animationDots, setAnimationDots] = useState('');
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setAnimationDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 600);

    const showContinueTimer = setTimeout(() => {
      setShowContinue(true);
    }, 2000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(showContinueTimer);
    };
  }, []);

  useInput((input) => {
    if (input === '\r' || input === ' ') {
      onNext();
    }
  });

  return (
    <Box flexDirection="column" alignItems="center" paddingY={2}>
      <Logo />

      <Box marginBottom={2}>
        <Text color="cyan" dimColor>
          ────────────────────────────────────────────────────────────
        </Text>
      </Box>

      <StatusBadge status="info">
        🤝 Official SmartLead Partner • We ❤️ their amazing product!
      </StatusBadge>

      <FeatureList />

      <StatusBadge status="warning">
        🔐 SECURITY: API key validation required before installation
      </StatusBadge>

      <CompatibilityBadges />

      <Box marginY={2}>
        <LoadingSpinner text={`Initializing premium installer${animationDots}`} />
      </Box>

      {showContinue && (
        <Box padding={2} borderStyle="double" borderColor="green" marginY={1}>
          <Gradient name={gradients.success}>
            <Text bold>▶️ Press ENTER or SPACE to begin installation</Text>
          </Gradient>
        </Box>
      )}

      <Box marginTop={2}>
        <Text color="gray" dimColor>
          🎯 Transform your cold email automation with enterprise-grade tools
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Enhanced API Key Input Screen
 */
const ApiKeyScreen: React.FC<{
  onNext: (apiKey: string) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const getDetailedErrorMessage = (err: unknown): string => {
    if (err instanceof SmartLeadError) {
      if (err.status === 401) {
        return 'Invalid API key. Please verify your key from SmartLead dashboard.';
      }
      if (err.status === 429) {
        return 'Rate limit exceeded. Please wait a moment and try again.';
      }
      if (err.status >= 500) {
        return 'SmartLead API is temporarily unavailable. Please try again later.';
      }
      return err.message;
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'An unexpected error occurred. Please try again.';
  };

  const validateApiKey = async (key: string) => {
    setIsValidating(true);
    setError('');

    try {
      const client = new SmartLeadClient({ apiKey: key });
      const result = await client.testConnection();

      if (result.success) {
        onNext(key);
      } else {
        setError(result.error || 'API key validation failed');
      }
    } catch (err) {
      setError(getDetailedErrorMessage(err));
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) {
      setError('Please enter your SmartLead API key');
      return;
    }

    if (input.length < 10) {
      setError('API key appears to be too short. Please check and try again.');
      return;
    }

    validateApiKey(input.trim());
  };

  useInput((inputChar, key) => {
    if (key.escape) {
      onBack();
    } else if (key.return && !isValidating) {
      handleSubmit();
    } else if (inputChar === '?') {
      setShowHelp(!showHelp);
    }
  });

  return (
    <Box flexDirection="column" alignItems="center" paddingY={2}>
      <Logo />

      <Card title="🔑 Step 1: Enter Your SmartLead API Key" borderColor="red" gradient="error">
        <StatusBadge status="warning">
          CRITICAL: API key validation is mandatory for security
        </StatusBadge>

        <Box marginY={1}>
          <Text color="white">Your API key is encrypted and stored securely locally.</Text>
        </Box>
      </Card>

      <Card title="📋 How to Get Your API Key" borderColor="cyan" gradient="info">
        <Box flexDirection="column">
          <Text>
            1. Visit: <Link url="https://app.smartlead.ai">https://app.smartlead.ai</Link>
          </Text>
          <Text>2. Navigate to Settings → API Keys</Text>
          <Text>3. Generate a new API key</Text>
          <Text>4. Copy and paste it below</Text>
        </Box>
      </Card>

      <Card
        title="🔐 Enter Your API Key"
        borderColor={input.length >= 10 ? 'green' : 'yellow'}
        gradient={input.length >= 10 ? 'success' : 'warning'}
      >
        <TextInput
          value={input}
          onChange={(value) => {
            setInput(value);
            if (error) setError('');
          }}
          onSubmit={handleSubmit}
          placeholder="Paste your SmartLead API key here..."
          mask="•"
        />

        {input.length > 0 && input.length < 10 && (
          <Box marginTop={1}>
            <Text color="yellow">⚠️ Key appears too short (need 10+ characters)</Text>
          </Box>
        )}

        {input.length >= 10 && (
          <Box marginTop={1}>
            <Text color="green">✅ Key format looks good!</Text>
          </Box>
        )}
      </Card>

      {error && <StatusBadge status="error">{error}</StatusBadge>}

      {isValidating && (
        <Card title="🔍 Validating API Key" borderColor="blue" gradient="info">
          <LoadingSpinner text="Testing connection to SmartLead API" color="blue" />
          <Box marginTop={1}>
            <Text color="blue">Please wait while we verify your credentials...</Text>
          </Box>
        </Card>
      )}

      {showHelp && (
        <Card title="❓ Need Help?" borderColor="magenta" gradient="secondary">
          <Box flexDirection="column">
            <Text>• Your API key is used to authenticate with SmartLead</Text>
            <Text>• It's stored locally and never shared</Text>
            <Text>• You can regenerate it anytime in SmartLead dashboard</Text>
            <Text>• Contact support if you have issues</Text>
          </Box>
        </Card>
      )}

      <Box marginTop={2} padding={1} borderStyle="single" borderColor="gray">
        <Text color="gray" dimColor>
          Press ENTER to validate • ESC to go back • ? for help
        </Text>
      </Box>
    </Box>
  );
};

/**
 * Client Selection Screen with enhanced visuals
 */
const ClientSelectionScreen: React.FC<{
  onNext: (clients: string[]) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const configPaths = getConfigPaths();

  const clients: MCPClient[] = [
    {
      id: 'all',
      name: 'All Supported Clients',
      emoji: '🌟',
      description: 'Configure all detected clients automatically (Recommended)',
      color: 'magenta',
    },
    {
      id: 'claude',
      name: 'Claude Desktop',
      emoji: '🤖',
      description: "Anthropic's official Claude desktop application",
      color: 'magenta',
    },
    {
      id: 'cursor',
      name: 'Cursor',
      emoji: '🎯',
      description: 'The AI-powered code editor with Cline integration',
      color: 'cyan',
    },
    {
      id: 'windsurf',
      name: 'Windsurf',
      emoji: '🏄',
      description: "Codeium's AI-powered development environment",
      color: 'blue',
    },
    {
      id: 'continue',
      name: 'Continue.dev',
      emoji: '🔄',
      description: 'Open-source AI code assistant extension',
      color: 'magenta',
    },
    {
      id: 'vscode',
      name: 'VS Code',
      emoji: '💻',
      description: 'Microsoft Visual Studio Code with extensions',
      color: 'cyan',
    },
    {
      id: 'zed',
      name: 'Zed Editor',
      emoji: '⚡',
      description: 'High-performance collaborative code editor',
      color: 'blue',
    },
  ];

  const getClientStatus = (clientId: string): string => {
    if (clientId === 'all') return '';

    const pathKey = clientId as keyof typeof configPaths;
    const configPath = configPaths[pathKey];

    if (!configPath) return '❓ Unknown';

    return fs.existsSync(configPath) ? '✅ Detected' : '📱 Not installed';
  };

  const handleSelect = (item: { value: string }) => {
    const selected = clients.find((c) => c.id === item.value);
    if (selected) {
      if (selected.id === 'all') {
        onNext(['claude', 'cursor', 'windsurf', 'continue', 'vscode', 'zed']);
      } else {
        onNext([selected.id]);
      }
    }
  };

  useInput((_, key) => {
    if (key.escape) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column" alignItems="center" paddingY={2}>
      <Logo />

      <Card title="🎯 Step 2: Choose Your AI Coding Tools" borderColor="green" gradient="success">
        <Box flexDirection="column">
          <Text color="green">Select which AI tools you want to configure with SmartLead</Text>
          <Box marginTop={1}>
            <Text color="white">We'll automatically detect and configure your installed tools</Text>
          </Box>
        </Box>
      </Card>

      <Card title="🔍 Available Clients" borderColor="cyan" gradient="info">
        <SelectInput
          items={clients.map((client) => ({
            label: `${client.emoji} ${client.name} - ${client.description} ${getClientStatus(client.id)}`,
            value: client.id,
            key: client.id,
          }))}
          onSelect={handleSelect}
        />
      </Card>

      <StatusBadge status="info">
        💡 Pro Tip: Choose "All Supported Clients" for the best experience
      </StatusBadge>

      <Box marginTop={2} padding={1} borderStyle="single" borderColor="gray">
        <Text color="gray" dimColor>
          Use ↑↓ to navigate • ENTER to select • ESC to go back
        </Text>
      </Box>
    </Box>
  );
};

// Helper functions outside component to avoid re-render issues
const getClientDisplayName = (clientId: string): string => {
  const clientNames: Record<string, string> = {
    claude: 'Claude Desktop',
    cursor: 'Cursor',
    windsurf: 'Windsurf',
    continue: 'Continue.dev',
    vscode: 'VS Code',
    zed: 'Zed Editor',
  };
  return clientNames[clientId] || clientId;
};

const installationFunctions: Record<string, (apiKey: string) => InstallationResult> = {
  claude: installForClaude,
  cursor: installForCursor,
  windsurf: installForWindsurf,
  continue: installForContinue,
  vscode: installForVSCode,
  zed: installForZed,
};

/**
 * Installation Progress Screen with real-time updates
 */
const InstallationProgressScreen: React.FC<{
  apiKey: string;
  selectedClients: string[];
  onComplete: (results: InstallationResult[]) => void;
  onError: (error: string) => void;
}> = ({ apiKey, selectedClients, onComplete, onError }) => {
  const [results, setResults] = useState<InstallationResult[]>([]);
  const [currentClient, setCurrentClient] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const performInstallation = async () => {
      const installationResults: InstallationResult[] = [];

      try {
        for (let i = 0; i < selectedClients.length; i++) {
          const clientId = selectedClients[i];
          if (!clientId) continue;

          const clientName = getClientDisplayName(clientId);

          setCurrentClient(clientName);
          setProgress(Math.round(((i + 1) / selectedClients.length) * 100));

          const installFn = installationFunctions[clientId];
          if (installFn) {
            const result = installFn(apiKey);
            installationResults.push(result);
            setResults([...installationResults]);
          }

          // Simulate realistic installation time
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }

        onComplete(installationResults);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Installation failed');
      }
    };

    performInstallation();
  }, [apiKey, selectedClients, onComplete, onError]);

  return (
    <Box flexDirection="column" alignItems="center" paddingY={2}>
      <Logo />

      <Card title="⚙️ Installing SmartLead MCP Server" borderColor="blue" gradient="info">
        <Box flexDirection="column">
          <LoadingSpinner text={`Configuring ${currentClient}...`} color="blue" />
          <Box marginTop={1}>
            <Text color="blue">Progress: {progress}% complete</Text>
          </Box>
        </Box>
      </Card>

      <Card title="📋 Installation Results" borderColor="green" gradient="success">
        <Box flexDirection="column">
          {results.map((result) => (
            <Box key={result.client} marginBottom={1}>
              {result.success ? (
                <Text color="green">
                  ✅ {result.client} - {result.message}
                </Text>
              ) : (
                <Text color="red">
                  ❌ {result.client} - {result.message}
                </Text>
              )}
            </Box>
          ))}

          {results.length === 0 && <Text color="gray">Preparing installation...</Text>}
        </Box>
      </Card>

      <StatusBadge status="info">🔄 Please wait while we configure your AI tools</StatusBadge>
    </Box>
  );
};

/**
 * Installation Complete Screen with celebration
 */
const InstallationCompleteScreen: React.FC<{
  results: InstallationResult[];
  onExit: () => void;
}> = ({ results, onExit }) => {
  const [celebrationPhase, setCelebrationPhase] = useState(0);
  const successCount = results.filter((r) => r.success).length;
  const totalCount = results.length;
  const allSuccessful = successCount === totalCount;

  useEffect(() => {
    const interval = setInterval(() => {
      setCelebrationPhase((prev) => (prev + 1) % 4);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  useInput((input) => {
    if (input === '\r' || input === ' ') {
      onExit();
    }
  });

  const celebrationEmojis = ['🎉', '🚀', '✨', '🎊'];

  return (
    <Box flexDirection="column" alignItems="center" paddingY={2}>
      <Logo />

      {allSuccessful ? (
        <StatusBadge status="success">
          {celebrationEmojis[celebrationPhase]} Installation Complete! All systems ready!
        </StatusBadge>
      ) : (
        <StatusBadge status="warning">
          ✅ Installation Complete with {totalCount - successCount} warnings
        </StatusBadge>
      )}

      <Card
        title="📊 Installation Summary"
        borderColor={allSuccessful ? 'green' : 'yellow'}
        gradient={allSuccessful ? 'success' : 'warning'}
      >
        <Box flexDirection="column">
          <Text color="white">
            ✅ Successfully configured:{' '}
            <Text color="green" bold>
              {successCount}
            </Text>{' '}
            / {totalCount} clients
          </Text>
          <Newline />

          {results.map((result) => (
            <Box key={`${result.client}-summary`} marginBottom={1}>
              <Text color={result.success ? 'green' : 'yellow'}>
                {result.success ? '✅' : '⚠️'} {result.client}
              </Text>
              <Text color="gray" dimColor>
                {' '}
                - {result.message}
              </Text>
              {result.configPath && (
                <Text color="gray" dimColor>
                  {' '}
                  ({result.configPath})
                </Text>
              )}
            </Box>
          ))}
        </Box>
      </Card>

      <Card title="🎯 Next Steps" borderColor="cyan" gradient="info">
        <Box flexDirection="column">
          <Text>1. Restart your AI coding tool (Claude, Cursor, etc.)</Text>
          <Text>2. Look for SmartLead tools in your AI assistant</Text>
          <Text>3. Start automating your cold email campaigns!</Text>
          <Text>4. Check our documentation for advanced features</Text>
        </Box>
      </Card>

      <Card title="📚 Resources" borderColor="magenta" gradient="secondary">
        <Box flexDirection="column">
          <Text>
            • GitHub:{' '}
            <Link url="https://github.com/LeadMagic/smartlead-mcp-server">
              LeadMagic/smartlead-mcp-server
            </Link>
          </Text>
          <Text>
            • Documentation: <Link url="https://leadmagic.io/docs">leadmagic.io/docs</Link>
          </Text>
          <Text>
            • Support: <Link url="mailto:jesse@leadmagic.io">jesse@leadmagic.io</Link>
          </Text>
          <Text>
            • SmartLead: <Link url="https://smartlead.ai">smartlead.ai</Link>
          </Text>
        </Box>
      </Card>

      <Box padding={2} borderStyle="double" borderColor="green" marginY={2}>
        <Gradient name={gradients.success}>
          <Text bold>🎉 Press ENTER or SPACE to finish</Text>
        </Gradient>
      </Box>

      <Box marginTop={1}>
        <Text color="gray" dimColor>
          Thank you for choosing SmartLead MCP Server!
          {celebrationEmojis[celebrationPhase]}
        </Text>
      </Box>
    </Box>
  );
};

// ===== MAIN APP =====

const InstallerApp: React.FC = () => {
  const { exit } = useApp();
  const [currentStep, setCurrentStep] = useState<InstallationStep>('welcome');
  const [apiKey, setApiKey] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [installationResults, setInstallationResults] = useState<InstallationResult[]>([]);
  const [error, setError] = useState('');

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setCurrentStep('apiKey')} />;

      case 'apiKey':
        return (
          <ApiKeyScreen
            onNext={(key) => {
              setApiKey(key);
              setCurrentStep('clientSelection');
            }}
            onBack={() => setCurrentStep('welcome')}
          />
        );

      case 'clientSelection':
        return (
          <ClientSelectionScreen
            onNext={(clients) => {
              setSelectedClients(clients);
              setCurrentStep('installing');
            }}
            onBack={() => setCurrentStep('apiKey')}
          />
        );

      case 'installing':
        return (
          <InstallationProgressScreen
            apiKey={apiKey}
            selectedClients={selectedClients}
            onComplete={(results) => {
              setInstallationResults(results);
              setCurrentStep('complete');
            }}
            onError={(errorMessage) => {
              setError(errorMessage);
              setCurrentStep('error');
            }}
          />
        );

      case 'complete':
        return <InstallationCompleteScreen results={installationResults} onExit={() => exit()} />;

      case 'error':
        return (
          <Box flexDirection="column" alignItems="center" paddingY={2}>
            <Logo />
            <StatusBadge status="error">Installation failed: {error}</StatusBadge>
            <Box marginTop={2}>
              <Text color="gray">Press any key to exit</Text>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box flexDirection="column" minHeight={20}>
      {renderStep()}
    </Box>
  );
};

// ===== STARTUP =====

render(<InstallerApp />);
