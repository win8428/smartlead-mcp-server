#!/usr/bin/env node
/**
 * Script to add proper MCP tool annotations to all SmartLead tools
 * 
 * This script adds the recommended MCP annotations to improve compliance
 * with MCP best practices as outlined in the official documentation.
 */

import fs from 'fs';
import path from 'path';

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

function getAnnotationsForTool(toolName) {
  // Remove 'smartlead_' prefix for analysis
  const cleanName = toolName.replace('smartlead_', '');
  
  // Find matching pattern
  for (const [pattern, annotations] of Object.entries(toolAnnotations)) {
    if (pattern !== 'default' && cleanName.startsWith(pattern)) {
      return annotations;
    }
  }
  
  return toolAnnotations.default;
}

function addAnnotationsToFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Find all server.registerTool calls
  const toolRegex = /server\.registerTool\(\s*'([^']+)',\s*\{([^}]+)\},/g;
  
  content = content.replace(toolRegex, (match, toolName, toolConfig) => {
    // Check if annotations already exist
    if (toolConfig.includes('annotations:')) {
      return match; // Skip if already has annotations
    }
    
    const annotations = getAnnotationsForTool(toolName);
    const annotationsStr = `      annotations: {
        title: '${toolName.replace('smartlead_', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}',
        readOnlyHint: ${annotations.readOnlyHint},
        destructiveHint: ${annotations.destructiveHint},
        idempotentHint: ${annotations.idempotentHint},
        openWorldHint: ${annotations.openWorldHint}
      }`;
    
    // Insert annotations before the closing brace
    const updatedConfig = toolConfig.trim() + ',\n' + annotationsStr;
    modified = true;
    
    return `server.registerTool(\n    '${toolName}',\n    {\n${updatedConfig}\n    },`;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Added annotations to: ${filePath}`);
  } else {
    console.log(`⏭️  No changes needed: ${filePath}`);
  }
}

// Process all tool files
const toolsDir = 'src/tools';
const toolFiles = fs.readdirSync(toolsDir)
  .filter(file => file.endsWith('.ts') && file !== 'index.ts')
  .map(file => path.join(toolsDir, file));

console.log('🚀 Adding MCP tool annotations...\n');

toolFiles.forEach(addAnnotationsToFile);

console.log('\n✅ MCP annotations added successfully!');
console.log('📋 Summary:');
console.log(`   - Processed ${toolFiles.length} tool files`);
console.log('   - Added proper readOnlyHint, destructiveHint, idempotentHint, and openWorldHint annotations');
console.log('   - Improved MCP compliance and user experience');
