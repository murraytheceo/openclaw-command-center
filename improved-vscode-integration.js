/**
 * Improved VS Code Integration - Client-side functions
 * Works with the File Opener API to bypass browser restrictions
 */

// Configuration
const FILE_OPENER_API_BASE = 'http://127.0.0.1:3001/api';
const WORKSPACE_ROOT = '/Users/zonte/.openclaw/workspace';

/**
 * Enhanced document opening with multiple fallback strategies
 */
async function openDocumentEnhanced(path) {
  const fullPath = path.startsWith('/') ? path : `${WORKSPACE_ROOT}/${path}`;
  
  showToast('🔍 Opening document...', 'info');
  
  try {
    // Strategy 1: Use File Opener API (preferred)
    const response = await fetch(`${FILE_OPENER_API_BASE}/open`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        filePath: fullPath,
        editor: 'code' // Prefer VS Code
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        showToast(`💻 Opened in ${result.editor}`, 'success');
        return;
      }
    }
  } catch (error) {
    console.warn('File Opener API failed:', error);
  }
  
  // Strategy 2: Try protocol handlers with better error handling
  try {
    await tryProtocolHandlers(fullPath);
    return;
  } catch (error) {
    console.warn('Protocol handlers failed:', error);
  }
  
  // Strategy 3: Download the file as fallback
  downloadFile(fullPath);
}

/**
 * Try various protocol handlers with timeout and fallbacks
 */
async function tryProtocolHandlers(fullPath) {
  const protocols = [
    { name: 'VS Code', url: `vscode://file${fullPath}` },
    { name: 'Cursor', url: `cursor://file${fullPath}` },
    { name: 'VS Code Insiders', url: `vscode-insiders://file${fullPath}` },
    { name: 'Sublime', url: `subl://open?url=file://${fullPath}` }
  ];
  
  for (const protocol of protocols) {
    try {
      const opened = await tryProtocolWithTimeout(protocol.url, protocol.name, 2000);
      if (opened) {
        showToast(`💻 Opened in ${protocol.name}`, 'success');
        return;
      }
    } catch (error) {
      console.warn(`${protocol.name} protocol failed:`, error);
    }
  }
  
  throw new Error('All protocol handlers failed');
}

/**
 * Try a protocol with timeout to detect if it worked
 */
function tryProtocolWithTimeout(url, editorName, timeout = 2000) {
  return new Promise((resolve, reject) => {
    // Create a hidden iframe to test the protocol
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    let resolved = false;
    
    const cleanup = () => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    };
    
    // Success detection: if the page doesn't lose focus within timeout,
    // assume the protocol didn't work
    const focusLostHandler = () => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(true);
      }
    };
    
    const timeoutHandler = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(false);
      }
    }, timeout);
    
    // Listen for focus changes
    window.addEventListener('blur', focusLostHandler, { once: true });
    
    // Also try direct window.open as fallback
    setTimeout(() => {
      if (!resolved) {
        try {
          const popup = window.open(url, '_blank');
          setTimeout(() => {
            if (popup && !popup.closed) {
              popup.close();
            }
          }, 100);
        } catch (e) {
          // Ignore popup blocker errors
        }
      }
    }, 500);
    
    // Cleanup timeout
    setTimeout(() => {
      window.removeEventListener('blur', focusLostHandler);
      clearTimeout(timeoutHandler);
    }, timeout + 100);
  });
}

/**
 * Download file as last resort
 */
function downloadFile(filePath) {
  const fileName = filePath.split('/').pop();
  
  // Create download link
  const link = document.createElement('a');
  link.href = `file://${filePath}`;
  link.download = fileName;
  link.target = '_blank';
  
  // Try to trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showToast(`📥 Downloaded ${fileName}`, 'warning');
  
  // Show helpful modal
  showFileDownloadModal(fileName, filePath);
}

/**
 * Show modal with instructions after download
 */
function showFileDownloadModal(fileName, filePath) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h3>📄 File Downloaded</h3>
        <button onclick="this.closest('.modal').remove()" style="background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;">×</button>
      </div>
      
      <div class="modal-body">
        <p style="margin-bottom: 16px;">
          <strong>${fileName}</strong> has been downloaded to your Downloads folder.
        </p>
        
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 16px; font-family: 'JetBrains Mono', monospace; font-size: 12px;">
          ${filePath}
        </div>
        
        <p style="color: var(--muted); font-size: 14px;">
          💡 To enable direct opening, install VS Code and run:<br>
          <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">
            code --install
          </code>
        </p>
      </div>
      
      <div class="modal-footer">
        <button onclick="this.closest('.modal').remove()" style="padding: 8px 16px; background: var(--primary); border: none; border-radius: 6px; color: white; cursor: pointer;">
          Got it
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (modal.parentNode) {
      document.body.removeChild(modal);
    }
  }, 10000);
}

/**
 * Get available editors from API
 */
async function getAvailableEditors() {
  try {
    const response = await fetch(`${FILE_OPENER_API_BASE}/editors`);
    if (response.ok) {
      const data = await response.json();
      return data.editors || [];
    }
  } catch (error) {
    console.warn('Failed to get available editors:', error);
  }
  return [];
}

/**
 * Enhanced toast notifications
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const colors = {
    info: 'var(--primary)',
    success: 'var(--green)',
    warning: 'var(--yellow)',
    error: 'var(--red)'
  };
  
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type]};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    z-index: 1000;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    animation: slideInRight 0.3s ease;
    max-width: 300px;
  `;
  
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }
  }, 4000);
}

/**
 * Enhanced document actions with editor selection
 */
async function showDocumentActions(path) {
  const fullPath = path.startsWith('/') ? path : `${WORKSPACE_ROOT}/${path}`;
  const fileName = path.split('/').pop();
  
  // Get available editors
  const editors = await getAvailableEditors();
  
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 450px;">
      <div class="modal-header">
        <h3>📄 Open ${fileName}</h3>
        <button onclick="this.closest('.modal').remove()" style="background:none;border:none;color:var(--muted);font-size:20px;cursor:pointer;">×</button>
      </div>
      
      <div class="modal-body">
        <div style="margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--muted);">
          ${fullPath}
        </div>
        
        <div style="display: grid; gap: 8px;">
          <button onclick="openDocumentEnhanced('${path}'); this.closest('.modal').remove();" 
                  style="padding: 12px; background: var(--primary); border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 8px;">
            💻 Open with Best Available Editor
          </button>
          
          ${editors.length > 0 ? `
            <div style="margin: 16px 0 8px; font-size: 14px; color: var(--muted);">
              Available editors:
            </div>
            ${editors.map(editor => `
              <button onclick="openWithSpecificEditor('${path}', '${editor.command}'); this.closest('.modal').remove();"
                      style="padding: 8px 12px; background: rgba(255,255,255,0.08); border: 1px solid var(--border); border-radius: 6px; color: var(--text); cursor: pointer; text-align: left;">
                ${editor.name} ${editor.location === 'PATH' ? '✓' : `(${editor.location})`}
              </button>
            `).join('')}
          ` : `
            <div style="padding: 8px; background: rgba(255,255,0,0.1); border-radius: 6px; color: var(--yellow); font-size: 13px;">
              ⚠️ No code editors detected. Install VS Code for best experience.
            </div>
          `}
          
          <button onclick="copyToClipboard('${fullPath}'); this.closest('.modal').remove();"
                  style="padding: 8px 12px; background: rgba(255,255,255,0.08); border: 1px solid var(--border); border-radius: 6px; color: var(--text); cursor: pointer;">
            📋 Copy File Path
          </button>
          
          <button onclick="showInFinder('${fullPath}'); this.closest('.modal').remove();"
                  style="padding: 8px 12px; background: rgba(255,255,255,0.08); border: 1px solid var(--border); border-radius: 6px; color: var(--text); cursor: pointer;">
            📁 Show in Finder
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close modal on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

/**
 * Open with specific editor
 */
async function openWithSpecificEditor(path, editor) {
  const fullPath = path.startsWith('/') ? path : `${WORKSPACE_ROOT}/${path}`;
  
  try {
    const response = await fetch(`${FILE_OPENER_API_BASE}/open`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        filePath: fullPath,
        editor: editor
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        showToast(`💻 Opened in ${result.editor}`, 'success');
        return;
      }
    }
    
    throw new Error('API request failed');
  } catch (error) {
    console.error('Failed to open with specific editor:', error);
    showToast('Failed to open file', 'error');
  }
}

/**
 * Copy file path to clipboard
 */
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Path copied to clipboard', 'success');
  }).catch(() => {
    showToast('Failed to copy to clipboard', 'error');
  });
}

/**
 * Show file in Finder (macOS)
 */
function showInFinder(filePath) {
  const directory = filePath.substring(0, filePath.lastIndexOf('/'));
  try {
    window.open(`file://${directory}`);
    showToast('📁 Opening in Finder...', 'info');
  } catch (error) {
    copyToClipboard(directory);
    showToast('📋 Directory path copied', 'warning');
  }
}

// Add CSS animations
if (!document.getElementById('toast-animations')) {
  const style = document.createElement('style');
  style.id = 'toast-animations';
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .modal-content {
      background: var(--card-bg);
      border-radius: var(--radius);
      padding: 0;
      backdrop-filter: blur(20px);
      border: 1px solid var(--border);
      animation: slideIn 0.3s ease;
    }
    
    .modal-header {
      padding: 20px 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .modal-footer {
      padding: 0 20px 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    @keyframes slideIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// Export functions for global use
window.openDocumentEnhanced = openDocumentEnhanced;
window.showDocumentActions = showDocumentActions;
window.openWithSpecificEditor = openWithSpecificEditor;
window.copyToClipboard = copyToClipboard;
window.showInFinder = showInFinder;