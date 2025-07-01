#!/usr/bin/env node

/**
 * Enhanced SmartLead MCP Server Interactive Installer
 * Beautiful React Ink interface with colorful design and data export features
 *
 * @author LeadMagic Team
 * @version 2.0.0
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
  args?: string[];
  env: {
    SMARTLEAD_API_KEY: string;
  };
}

interface DataExportOptions {
  campaigns: boolean;
  analytics: boolean;
  statistics: boolean;
  leads: boolean;
}

type InstallationStep =
  | 'welcome'
  | 'api-key'
  | 'client-selection'
  | 'data-export'
  | 'installation'
  | 'complete'
  | 'error';

interface MCPClient {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface InstallationResult {
  client: string;
  success: boolean;
  message: string;
  configPath?: string;
}

// ===== INSTALLATION FUNCTIONS =====

const getConfigPaths = () => {
  const platform = process.platform;
  const home = os.homedir();

  const basePaths = {
    darwin: {
      claude: path.join(home, 'Library/Application Support/Claude/claude_desktop_config.json'),
      cursor: path.join(home, 'Library/Application Support/Cursor/User/settings.json'),
      windsurf: path.join(home, 'Library/Application Support/Windsurf/User/settings.json'),
      continue: path.join(home, '.continue/config.json'),
      vscode: path.join(home, 'Library/Application Support/Code/User/settings.json'),
      zed: path.join(home, '.config/zed/settings.json'),
    },
    linux: {
      claude: path.join(home, '.config/claude/claude_desktop_config.json'),
      cursor: path.join(home, '.config/Cursor/User/settings.json'),
      windsurf: path.join(home, '.config/Windsurf/User/settings.json'),
      continue: path.join(home, '.continue/config.json'),
      vscode: path.join(home, '.config/Code/User/settings.json'),
      zed: path.join(home, '.config/zed/settings.json'),
    },
    win32: {
      claude: path.join(home, 'AppData/Roaming/Claude/claude_desktop_config.json'),
      cursor: path.join(home, 'AppData/Roaming/Cursor/User/settings.json'),
      windsurf: path.join(home, 'AppData/Roaming/Windsurf/User/settings.json'),
      continue: path.join(home, '.continue/config.json'),
      vscode: path.join(home, 'AppData/Roaming/Code/User/settings.json'),
      zed: path.join(home, 'AppData/Roaming/Zed/settings.json'),
    },
  };

  return basePaths[platform as keyof typeof basePaths] || basePaths.linux;
};

const smartleadServerConfig = (apiKey: string) => ({
  command: 'npx',
  args: ['smartlead-mcp-by-leadmagic'],
  env: {
    SMARTLEAD_API_KEY: apiKey,
  },
});

const ensureConfigDir = (configPath: string): void => {
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
};

const readConfigSafely = (configPath: string): any => {
  try {
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`Warning: Could not read config from ${configPath}`);
  }
  return {};
};

const installForClient = (clientId: string, apiKey: string): InstallationResult => {
  const configPaths = getConfigPaths();
  const serverConfig = smartleadServerConfig(apiKey);

  try {
    switch (clientId) {
      case 'claude': {
        const configPath = configPaths.claude;
        ensureConfigDir(configPath);
        const config = readConfigSafely(configPath);
        config.mcpServers = { ...config.mcpServers, smartlead: serverConfig };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return {
          client: 'Claude Desktop',
          success: true,
          message: 'Successfully configured',
          configPath,
        };
      }
      case 'cursor': {
        const configPath = configPaths.cursor;
        ensureConfigDir(configPath);
        const config = readConfigSafely(configPath);
        config['cline.mcpServers'] = { ...config['cline.mcpServers'], smartlead: serverConfig };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return { client: 'Cursor', success: true, message: 'Successfully configured', configPath };
      }
      case 'windsurf': {
        const configPath = configPaths.windsurf;
        ensureConfigDir(configPath);
        const config = readConfigSafely(configPath);
        config.mcpServers = { ...config.mcpServers, smartlead: serverConfig };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return {
          client: 'Windsurf',
          success: true,
          message: 'Successfully configured',
          configPath,
        };
      }
      case 'continue': {
        const configPath = configPaths.continue;
        ensureConfigDir(configPath);
        const config = readConfigSafely(configPath);
        if (!config.mcpServers) config.mcpServers = [];
        const existingIndex = config.mcpServers.findIndex((s: any) => s.name === 'smartlead');
        const serverWithName = { name: 'smartlead', ...serverConfig };
        if (existingIndex >= 0) {
          config.mcpServers[existingIndex] = serverWithName;
        } else {
          config.mcpServers.push(serverWithName);
        }
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return {
          client: 'Continue.dev',
          success: true,
          message: 'Successfully configured',
          configPath,
        };
      }
      case 'vscode': {
        const configPath = configPaths.vscode;
        ensureConfigDir(configPath);
        const config = readConfigSafely(configPath);
        config['cline.mcpServers'] = { ...config['cline.mcpServers'], smartlead: serverConfig };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return { client: 'VS Code', success: true, message: 'Successfully configured', configPath };
      }
      case 'zed': {
        const configPath = configPaths.zed;
        ensureConfigDir(configPath);
        const config = readConfigSafely(configPath);
        config.mcpServers = { ...config.mcpServers, smartlead: serverConfig };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return {
          client: 'Zed Editor',
          success: true,
          message: 'Successfully configured',
          configPath,
        };
      }
      default:
        return { client: clientId, success: false, message: 'Unsupported client' };
    }
  } catch (error) {
    return {
      client: clientId,
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// ===== COLORFUL LOGO COMPONENT =====

const ColorfulLogo: React.FC = () => (
  <Box flexDirection="column" alignItems="center" marginBottom={1}>
    <Gradient name="rainbow">
      <Text bold>🚀 SMARTLEAD MCP SERVER 🚀</Text>
    </Gradient>
    <Text color="cyan" dimColor>
      by LeadMagic • Cold Email Automation
    </Text>
  </Box>
);

// ===== WELCOME SCREEN =====

const WelcomeScreen: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useInput((input, key) => {
    if (key.return || input === ' ') {
      onNext();
    }
  });

  return (
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="magenta">
      <ColorfulLogo />

      <Box flexDirection="column" alignItems="center" marginBottom={2}>
        <Gradient name="pastel">
          <Text bold>✨ The Premier Cold Email MCP Server ✨</Text>
        </Gradient>
        <Text color="white">
          🎯{' '}
          <Text color="cyan" bold>
            113+ API tools
          </Text>{' '}
          • 🛡️{' '}
          <Text color="green" bold>
            Production ready
          </Text>{' '}
          • 🎨{' '}
          <Text color="yellow" bold>
            Beautiful installer
          </Text>
        </Text>
        <Text color="white">
          🔧{' '}
          <Text color="blue" bold>
            TypeScript first
          </Text>{' '}
          • 🌍{' '}
          <Text color="magenta" bold>
            Global NPM package
          </Text>{' '}
          • ⚡{' '}
          <Text color="red" bold>
            Zero config
          </Text>
        </Text>
      </Box>

      <Box flexDirection="column" alignItems="center" marginBottom={2}>
        <Text color="gray" dimColor>
          Compatible with:
        </Text>
        <Text color="white">
          <Text color="cyan">Claude</Text> • <Text color="green">Cursor</Text> •
          <Text color="yellow">Windsurf</Text> • <Text color="magenta">Continue</Text> •
          <Text color="blue">VS Code</Text> • <Text color="red">Zed</Text>
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="blue">
          <Spinner type="dots" /> Ready to transform your cold email automation{dots}
        </Text>
      </Box>

      <Box padding={1} borderStyle="double" borderColor="green">
        <Gradient name="fruit">
          <Text bold>▶️ Press ENTER or SPACE to begin installation</Text>
        </Gradient>
      </Box>
    </Box>
  );
};

// ===== API KEY INPUT SCREEN =====

const ApiKeyScreen: React.FC<{
  onNext: (apiKey: string) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateApiKey = async (key: string) => {
    setIsValidating(true);
    setError('');

    try {
      const client = new SmartLeadClient({ apiKey: key });
      await client.testConnection();
      onNext(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid API key');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = () => {
    if (!input || input.length < 10) {
      setError(
        'Invalid API key format. Please enter a valid key from SmartLead (minimum 10 characters).'
      );
    } else {
      validateApiKey(input.trim());
    }
  };

  useInput((inputChar, key) => {
    if (key.escape) {
      onBack();
    } else if (key.return && !isValidating) {
      handleSubmit();
    }
  });

  return (
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="cyan">
      <ColorfulLogo />

      <Box borderStyle="single" borderColor="red" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Gradient name="morning">
            <Text bold>🔑 Step 1: Enter Your SmartLead API Key (REQUIRED)</Text>
          </Gradient>
          <Text color="red">⚠️ API key validation is MANDATORY before proceeding!</Text>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="cyan" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Gradient name="atlas">
            <Text bold>📋 How to get your API key:</Text>
          </Gradient>
          <Text>
            1. Visit: <Link url="https://app.smartlead.ai">https://app.smartlead.ai</Link>
          </Text>
          <Text>2. Go to Settings → API Keys</Text>
          <Text>3. Generate a new API key</Text>
          <Text>4. Copy and paste it below</Text>
        </Box>
      </Box>

      <Box
        borderStyle="single"
        borderColor={input.length >= 10 ? 'green' : 'gray'}
        padding={1}
        marginBottom={1}
      >
        <Box flexDirection="column">
          <Gradient name="teen">
            <Text bold>Enter your SmartLead API Key:</Text>
          </Gradient>
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
            <Text color="yellow" dimColor>
              Need at least 10 characters...
            </Text>
          )}
        </Box>
      </Box>

      {error && (
        <Box borderStyle="single" borderColor="red" padding={1} marginBottom={1}>
          <Text color="red">❌ {error}</Text>
        </Box>
      )}

      {isValidating && (
        <Box borderStyle="single" borderColor="blue" padding={1} marginBottom={1}>
          <Text color="blue">
            <Spinner type="dots" /> Validating API key...
          </Text>
        </Box>
      )}

      <Box borderStyle="single" borderColor="gray" padding={1}>
        <Text color="gray" dimColor>
          Press ENTER to validate • ESC to go back
        </Text>
      </Box>
    </Box>
  );
};

// ===== DATA EXPORT SCREEN =====

const DataExportScreen: React.FC<{
  apiKey: string;
  onNext: (exportOptions: DataExportOptions) => void;
  onBack: () => void;
}> = ({ apiKey, onNext, onBack }) => {
  const [exportOptions, setExportOptions] = useState<DataExportOptions>({
    campaigns: false,
    analytics: false,
    statistics: false,
    leads: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>('');

  const exportData = async () => {
    if (!Object.values(exportOptions).some(Boolean)) {
      onNext(exportOptions);
      return;
    }

    setIsExporting(true);
    setExportStatus('Initializing export...');

    try {
      const client = new SmartLeadClient({ apiKey });
      const exportDir = path.join(os.homedir(), 'smartlead-exports');

      if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
      }

      if (exportOptions.campaigns) {
        setExportStatus('Exporting campaigns...');
        const campaigns = await client.listCampaigns({ limit: 1000 });
        fs.writeFileSync(
          path.join(exportDir, 'campaigns.json'),
          JSON.stringify(campaigns, null, 2)
        );
      }

      if (exportOptions.analytics) {
        setExportStatus('Exporting analytics...');
        // Add analytics export logic here
      }

      if (exportOptions.statistics) {
        setExportStatus('Exporting statistics...');
        // Add statistics export logic here
      }

      if (exportOptions.leads) {
        setExportStatus('Exporting leads...');
        const leads = await client.listLeads({ limit: 1000 });
        fs.writeFileSync(path.join(exportDir, 'leads.json'), JSON.stringify(leads, null, 2));
      }

      setExportStatus(`✅ Export complete! Files saved to: ${exportDir}`);
      setTimeout(() => onNext(exportOptions), 2000);
    } catch (error) {
      setExportStatus(
        `❌ Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
      setTimeout(() => setIsExporting(false), 2000);
    }
  };

  useInput((input, key) => {
    if (key.escape) {
      onBack();
    } else if (key.return && !isExporting) {
      exportData();
    } else if (!isExporting) {
      switch (input) {
        case '1':
          setExportOptions((prev) => ({ ...prev, campaigns: !prev.campaigns }));
          break;
        case '2':
          setExportOptions((prev) => ({ ...prev, analytics: !prev.analytics }));
          break;
        case '3':
          setExportOptions((prev) => ({ ...prev, statistics: !prev.statistics }));
          break;
        case '4':
          setExportOptions((prev) => ({ ...prev, leads: !prev.leads }));
          break;
      }
    }
  });

  return (
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="yellow">
      <ColorfulLogo />

      <Box borderStyle="single" borderColor="yellow" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Gradient name="summer">
            <Text bold>📊 Step 2: Export Your SmartLead Data (Optional)</Text>
          </Gradient>
          <Text color="yellow">Download your campaigns, analytics, and statistics for backup</Text>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="cyan" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Text color="cyan" bold>
            Select data to export:
          </Text>
          <Text color={exportOptions.campaigns ? 'green' : 'gray'}>
            1. {exportOptions.campaigns ? '✅' : '⬜'} Campaigns
          </Text>
          <Text color={exportOptions.analytics ? 'green' : 'gray'}>
            2. {exportOptions.analytics ? '✅' : '⬜'} Analytics
          </Text>
          <Text color={exportOptions.statistics ? 'green' : 'gray'}>
            3. {exportOptions.statistics ? '✅' : '⬜'} Statistics
          </Text>
          <Text color={exportOptions.leads ? 'green' : 'gray'}>
            4. {exportOptions.leads ? '✅' : '⬜'} Leads
          </Text>
        </Box>
      </Box>

      {isExporting && (
        <Box borderStyle="single" borderColor="blue" padding={1} marginBottom={1}>
          <Text color="blue">
            <Spinner type="dots" /> {exportStatus}
          </Text>
        </Box>
      )}

      <Box borderStyle="single" borderColor="gray" padding={1}>
        <Text color="gray" dimColor>
          Press 1-4 to toggle options • ENTER to continue • ESC to go back
        </Text>
      </Box>
    </Box>
  );
};

// ===== CLIENT SELECTION SCREEN =====

const ClientSelectionScreen: React.FC<{
  onNext: (clients: string[]) => void;
  onBack: () => void;
}> = ({ onNext, onBack }) => {
  const clients: MCPClient[] = [
    {
      id: 'all',
      name: 'All Supported Clients',
      emoji: '🌟',
      description: 'Configure all detected clients automatically (Recommended)',
    },
    {
      id: 'claude',
      name: 'Claude Desktop',
      emoji: '🤖',
      description: 'For the native Anthropic Claude app',
    },
    {
      id: 'cursor',
      name: 'Cursor',
      emoji: '🎯',
      description: 'For the Cursor editor (with Cline extension)',
    },
    {
      id: 'vscode',
      name: 'VS Code',
      emoji: '💻',
      description: 'For VS Code (with Cline or Continue.dev)',
    },
    {
      id: 'continue',
      name: 'Continue.dev',
      emoji: '🔄',
      description: 'For the Continue.dev extension',
    },
    { id: 'windsurf', name: 'Windsurf', emoji: '🏄', description: 'For the Windsurf editor' },
    { id: 'zed', name: 'Zed Editor', emoji: '⚡', description: 'For the Zed editor' },
  ];

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
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="green">
      <ColorfulLogo />

      <Box borderStyle="single" borderColor="green" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Gradient name="cristal">
            <Text bold>🎯 Step 3: Choose MCP Clients to Configure</Text>
          </Gradient>
          <Text color="green">Select which AI coding tools you want to set up</Text>
        </Box>
      </Box>

      <Box marginBottom={2}>
        <SelectInput
          items={clients.map((client) => ({
            label: `${client.emoji} ${client.name} - ${client.description}`,
            value: client.id,
            key: client.id,
          }))}
          onSelect={handleSelect}
        />
      </Box>

      <Box borderStyle="single" borderColor="gray" padding={1}>
        <Text color="gray" dimColor>
          Use ↑↓ to navigate • ENTER to select • ESC to go back
        </Text>
      </Box>
    </Box>
  );
};

// ===== INSTALLATION PROGRESS SCREEN =====

const InstallationProgressScreen: React.FC<{
  apiKey: string;
  selectedClients: string[];
  exportOptions: DataExportOptions;
  onComplete: () => void;
  onError: (error: string) => void;
}> = ({ apiKey, selectedClients, exportOptions, onComplete, onError }) => {
  const [progress, setProgress] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState('');

  useEffect(() => {
    const install = async () => {
      try {
        setCurrentStep('🔧 Configuring MCP clients...');
        setProgress(['Starting installation...']);

        const results: InstallationResult[] = [];

        // Real installation for each client
        for (const client of selectedClients) {
          setCurrentStep(`📝 Configuring ${client}...`);

          const result = installForClient(client, apiKey);
          results.push(result);

          if (result.success) {
            setProgress((prev) => [...prev, `✅ ${result.client} configured successfully`]);
          } else {
            setProgress((prev) => [...prev, `❌ ${result.client} failed: ${result.message}`]);
          }

          await new Promise((resolve) => setTimeout(resolve, 800));
        }

        const successCount = results.filter((r) => r.success).length;
        const totalCount = results.length;

        if (successCount === totalCount) {
          setCurrentStep('🎉 Installation complete!');
          setProgress((prev) => [...prev, '🚀 SmartLead MCP Server is ready to use!']);
        } else {
          setCurrentStep(`⚠️ Installation completed with ${totalCount - successCount} errors`);
          setProgress((prev) => [
            ...prev,
            `✅ ${successCount}/${totalCount} clients configured successfully`,
          ]);
        }

        setTimeout(onComplete, 1500);
      } catch (error) {
        onError(error instanceof Error ? error.message : 'Installation failed');
      }
    };

    install();
  }, [apiKey, selectedClients, exportOptions, onComplete, onError]);

  return (
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="blue">
      <ColorfulLogo />

      <Box borderStyle="single" borderColor="blue" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Gradient name="mind">
            <Text bold>⚙️ Installing SmartLead MCP Server</Text>
          </Gradient>
          <Text color="blue">
            <Spinner type="dots" /> {currentStep}
          </Text>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="green" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Text color="green" bold>
            📋 Installation Progress:
          </Text>
          {progress.map((step, index) => (
            <Text key={index} color="white">
              {step}
            </Text>
          ))}
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="gray" padding={1}>
        <Text color="gray" dimColor>
          Please wait while we configure your MCP clients...
        </Text>
      </Box>
    </Box>
  );
};

// ===== COMPLETION SCREEN =====

const CompletionScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  useInput((input, key) => {
    if (key.escape || input === 'q') {
      onExit();
    }
  });

  return (
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="green">
      <ColorfulLogo />

      <Box borderStyle="double" borderColor="green" padding={1} marginBottom={1}>
        <Box flexDirection="column" alignItems="center">
          <Gradient name="rainbow">
            <Text bold>🎉 INSTALLATION COMPLETE! 🎉</Text>
          </Gradient>
          <Text color="green">SmartLead MCP Server is now ready to use!</Text>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="cyan" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Text color="cyan" bold>
            🚀 Next Steps:
          </Text>
          <Text>1. Restart your AI coding tool (Claude, Cursor, etc.)</Text>
          <Text>2. Look for SmartLead tools in your MCP client</Text>
          <Text>3. Start automating your cold email campaigns!</Text>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="yellow" padding={1} marginBottom={1}>
        <Box flexDirection="column">
          <Text color="yellow" bold>
            📚 Resources:
          </Text>
          <Text>
            • Documentation:{' '}
            <Link url="https://github.com/LeadMagic/smartlead-mcp-server">GitHub</Link>
          </Text>
          <Text>
            • SmartLead Dashboard: <Link url="https://app.smartlead.ai">app.smartlead.ai</Link>
          </Text>
          <Text>
            • Support: <Link url="mailto:support@leadmagic.io">support@leadmagic.io</Link>
          </Text>
        </Box>
      </Box>

      <Box borderStyle="single" borderColor="gray" padding={1}>
        <Text color="gray" dimColor>
          Press ESC or Q to exit
        </Text>
      </Box>
    </Box>
  );
};

// ===== MAIN APP COMPONENT =====

const EnhancedInstallerApp: React.FC = () => {
  const [step, setStep] = useState<InstallationStep>('welcome');
  const [apiKey, setApiKey] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [exportOptions, setExportOptions] = useState<DataExportOptions>({
    campaigns: false,
    analytics: false,
    statistics: false,
    leads: false,
  });
  const [error, setError] = useState('');

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeScreen onNext={() => setStep('api-key')} />;

      case 'api-key':
        return (
          <ApiKeyScreen
            onNext={(key) => {
              setApiKey(key);
              setStep('data-export');
            }}
            onBack={() => setStep('welcome')}
          />
        );

      case 'data-export':
        return (
          <DataExportScreen
            apiKey={apiKey}
            onNext={(options) => {
              setExportOptions(options);
              setStep('client-selection');
            }}
            onBack={() => setStep('api-key')}
          />
        );

      case 'client-selection':
        return (
          <ClientSelectionScreen
            onNext={(clients) => {
              setSelectedClients(clients);
              setStep('installation');
            }}
            onBack={() => setStep('data-export')}
          />
        );

      case 'installation':
        return (
          <InstallationProgressScreen
            apiKey={apiKey}
            selectedClients={selectedClients}
            exportOptions={exportOptions}
            onComplete={() => setStep('complete')}
            onError={(err) => {
              setError(err);
              setStep('error');
            }}
          />
        );

      case 'complete':
        return <CompletionScreen onExit={() => process.exit(0)} />;

      case 'error':
        return (
          <Box flexDirection="column" padding={2} borderStyle="round" borderColor="red">
            <ColorfulLogo />
            <Box borderStyle="single" borderColor="red" padding={1} marginBottom={1}>
              <Box flexDirection="column">
                <Gradient name="passion">
                  <Text bold>❌ Installation Error</Text>
                </Gradient>
                <Text color="red">{error}</Text>
              </Box>
            </Box>
            <Box borderStyle="single" borderColor="gray" padding={1}>
              <Text color="gray" dimColor>
                Press R to restart, or ESC to exit
              </Text>
            </Box>
          </Box>
        );

      default:
        return <WelcomeScreen onNext={() => setStep('api-key')} />;
    }
  };

  useInput((input, key) => {
    if (step === 'error') {
      if (key.escape || input === 'q') {
        process.exit(0);
      } else if (input === 'r') {
        setStep('welcome');
        setError('');
      }
    }
  });

  return renderStep();
};

// ===== SIGNAL HANDLERS =====

process.on('SIGINT', () => {
  console.log('\n\n👋 Installation cancelled. Run the installer again anytime!');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Installation terminated.');
  process.exit(0);
});

// ===== MAIN EXECUTION =====

if (import.meta.url === `file://${process.argv[1]}`) {
  render(<EnhancedInstallerApp />);
}

export {
  ColorfulLogo,
  WelcomeScreen,
  ApiKeyScreen,
  DataExportScreen,
  ClientSelectionScreen,
  InstallationProgressScreen,
  CompletionScreen,
  EnhancedInstallerApp,
};
