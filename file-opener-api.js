/**
 * File Opener API - Server-side solution for opening documents
 * Bypasses browser security restrictions for custom protocols
 */

const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Enable CORS for local development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

/**
 * Detect available editors on the system
 */
async function detectAvailableEditors() {
  const editors = [
    {
      name: 'VS Code',
      command: 'code',
      paths: [
        '/usr/local/bin/code',
        '/opt/homebrew/bin/code',
        '/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code'
      ],
      protocol: 'vscode'
    },
    {
      name: 'VS Code Insiders',
      command: 'code-insiders',
      paths: ['/Applications/Visual Studio Code - Insiders.app/Contents/Resources/app/bin/code'],
      protocol: 'vscode-insiders'
    },
    {
      name: 'Cursor',
      command: 'cursor',
      paths: ['/Applications/Cursor.app/Contents/Resources/app/bin/cursor'],
      protocol: 'cursor'
    },
    {
      name: 'Sublime Text',
      command: 'subl',
      paths: [
        '/usr/local/bin/subl',
        '/opt/homebrew/bin/subl',
        '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'
      ],
      protocol: 'sublime'
    },
    {
      name: 'Atom',
      command: 'atom',
      paths: ['/usr/local/bin/atom', '/Applications/Atom.app/Contents/Resources/app/atom.sh'],
      protocol: 'atom'
    }
  ];

  const available = [];
  
  for (const editor of editors) {
    // Check if command exists in PATH
    try {
      await new Promise((resolve, reject) => {
        spawn('which', [editor.command], { stdio: 'pipe' })
          .on('close', (code) => code === 0 ? resolve() : reject());
      });
      available.push({ ...editor, available: true, location: 'PATH' });
      continue;
    } catch {}

    // Check specific paths
    for (const editorPath of editor.paths) {
      if (fs.existsSync(editorPath)) {
        available.push({ ...editor, available: true, location: editorPath });
        break;
      }
    }
  }

  return available;
}

/**
 * Open file with specified editor
 */
async function openFileWithEditor(filePath, editorName = null) {
  const availableEditors = await detectAvailableEditors();
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  let selectedEditor = null;

  if (editorName) {
    selectedEditor = availableEditors.find(e => 
      e.name.toLowerCase().includes(editorName.toLowerCase()) ||
      e.command === editorName
    );
  } else {
    // Default to first available editor (preferring VS Code)
    selectedEditor = availableEditors.find(e => e.name.includes('VS Code')) || 
                    availableEditors[0];
  }

  if (!selectedEditor) {
    // Fallback to system default
    return openWithSystemDefault(filePath);
  }

  const command = selectedEditor.location === 'PATH' ? 
    selectedEditor.command : 
    selectedEditor.location;

  return new Promise((resolve, reject) => {
    const process = spawn(command, [filePath], {
      detached: true,
      stdio: 'ignore'
    });

    process.on('error', (error) => {
      console.error(`Failed to open with ${selectedEditor.name}:`, error);
      // Fallback to system default
      openWithSystemDefault(filePath).then(resolve).catch(reject);
    });

    process.on('spawn', () => {
      process.unref(); // Don't wait for the editor to close
      resolve({
        success: true,
        editor: selectedEditor.name,
        method: 'editor_command'
      });
    });
  });
}

/**
 * Open file with system default application
 */
async function openWithSystemDefault(filePath) {
  const platform = process.platform;
  let command, args;

  switch (platform) {
    case 'darwin': // macOS
      command = 'open';
      args = [filePath];
      break;
    case 'win32': // Windows
      command = 'start';
      args = ['', filePath];
      break;
    default: // Linux
      command = 'xdg-open';
      args = [filePath];
  }

  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      detached: true,
      stdio: 'ignore'
    });

    process.on('error', reject);
    process.on('spawn', () => {
      process.unref();
      resolve({
        success: true,
        editor: 'System Default',
        method: 'system_default'
      });
    });
  });
}

// API Routes

/**
 * GET /api/editors - List available editors
 */
app.get('/api/editors', async (req, res) => {
  try {
    const editors = await detectAvailableEditors();
    res.json({
      success: true,
      editors: editors,
      platform: process.platform
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/open - Open a file
 * Body: { filePath: string, editor?: string }
 */
app.post('/api/open', async (req, res) => {
  try {
    const { filePath, editor } = req.body;
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'filePath is required'
      });
    }

    // Convert relative paths to absolute
    const absolutePath = path.isAbsolute(filePath) ? 
      filePath : 
      path.resolve(process.cwd(), filePath);

    const result = await openFileWithEditor(absolutePath, editor);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/file/exists - Check if file exists
 */
app.post('/api/file/exists', (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'filePath is required'
      });
    }
    
    const absolutePath = path.isAbsolute(filePath) ? 
      filePath : 
      path.resolve(process.cwd(), filePath);
    
    const exists = fs.existsSync(absolutePath);
    const stats = exists ? fs.statSync(absolutePath) : null;
    
    res.json({
      exists,
      path: absolutePath,
      isFile: stats ? stats.isFile() : false,
      isDirectory: stats ? stats.isDirectory() : false,
      size: stats ? stats.size : 0,
      modified: stats ? stats.mtime : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.FILE_OPENER_PORT || 3001;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`📂 File Opener API running on http://127.0.0.1:${PORT}`);
  console.log('🔧 Ready to handle document opening requests');
});

module.exports = app;