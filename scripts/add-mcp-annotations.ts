#!/usr/bin/env node
/**
 * Script to add proper MCP tool annotations to all SmartLead tools
 * 
 * This script adds the recommended MCP annotations to improve compliance
 * with MCP best practices as outlined in the official documentation.
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('@typescript-eslint/parser');

// MCP Tool Categories and their annotations
const toolAnnotations = {
  // Read-only tools (don't modify state)
  'get_': {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true
  },
  'list_': {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true
  },
  'fetch_': {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: true
  },
  
  // Create operations (non-destructive)
  'create_': {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true
  },
  'add_': {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true
  },
  
  // Update operations (non-destructive)
  'update_': {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true
  },
  'save_': {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true
  },
  
  // Delete operations (destructive)
  'delete_': {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true
  },
  'remove_': {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: true
  },
  
  // Default for other operations
  'default': {
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true
  }
};

// Function to get annotations for a specific tool
function getAnnotationsForTool(toolName: string) {
  const baseAnnotations = {
    'mcp.name': toolName,
    'mcp.description': `A tool for ${toolName.replace(/_/g, ' ')}.`,
    'mcp.io.input': `Parameters for the ${toolName} tool.`,
    'mcp.io.output': `The result of the ${toolName} operation.`
  };

  const dynamicAnnotations = {
    'smartlead-mcp.tool.name': toolName,
    'smartlead-mcp.tool.category': toolName.split('_')[0],
    'smartlead-mcp.tool.version': '1.5.0',
    'smartlead-mcp.api.endpoint': `/api/v1/${toolName.replace(/_/g, '/')}`,
    'smartlead-mcp.api.method': 'GET', // Default, can be adjusted
    'smartlead-mcp.ui.displayName': toolName
      .replace('smartlead_', '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l: string) => l.toUpperCase()),
    'smartlead-mcp.ui.description': `Manage and view ${toolName.replace(/_/g, ' ')}.`,
  };

  return { ...baseAnnotations, ...dynamicAnnotations };
}

// Function to add annotations to a file
function addAnnotationsToFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const sourceCode = fs.readFileSync(filePath, 'utf-8');
  let modifiedCode = sourceCode;

  const ast = parse(sourceCode, {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    range: true,
  });

  for (const node of ast.body) {
    if (node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'FunctionDeclaration') {
      const func = node.declaration;
      if (func && func.id && func.range) {
        // Add the full annotation block
        const toolName = func.id.name;
        const annotations = getAnnotationsForTool(toolName);
        const annotationBlock = Object.entries(annotations)
          .map(([key, value]) => `   * @${key} ${value}`)
          .join('\n');

        const newFunctionDef = `/**\n${annotationBlock}\n   */\n${sourceCode.slice(func.range[0], func.range[1])}`;
        modifiedCode = modifiedCode.replace(sourceCode.slice(func.range[0], func.range[1]), newFunctionDef);
      }
    }
  }
  fs.writeFileSync(filePath, modifiedCode, 'utf-8');
}

// Main script execution
const toolsDir = path.resolve(__dirname, '../src/tools');
if (fs.existsSync(toolsDir)) {
  const files = fs.readdirSync(toolsDir);
  files.forEach((file: string) => {
    if (file.endsWith('.ts')) {
      addAnnotationsToFile(path.join(toolsDir, file));
    }
  });
  console.log('\n✅ MCP annotations added successfully!');
  console.log('📋 Summary:');
  console.log(`   - Processed ${files.length} tool files`);
} else {
  console.error(`Tools directory not found: ${toolsDir}`);
}
