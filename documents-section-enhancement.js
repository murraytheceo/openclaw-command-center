// COMPREHENSIVE DOCUMENTS SECTION FOR COMMAND CENTER DASHBOARD
// Add this to the existing command-center.html file

// Document Categories and Inventory
const DOCUMENT_CATEGORIES = {
  'constitutional': {
    name: 'Constitutional Frameworks',
    icon: '📜',
    color: 'var(--primary)',
    documents: [
      {
        name: 'Constitution V3',
        path: 'reference/CONSTITUTION-V3.md',
        size: '39K',
        date: '2026-02-12',
        description: 'Master constitutional document - current version',
        recent: true,
        priority: 'high'
      },
      {
        name: 'Agent Training Answers',
        path: 'AGENT-TRAINING-CLAUDE-ANSWERS.md', 
        size: '34K',
        date: '2026-02-12',
        description: 'Complete agent training survey responses',
        recent: true
      },
      {
        name: 'V3 Training Survey',
        path: 'V3.AGENT-TRAINING-SURVEY-ANSWERS.md',
        size: '41K', 
        date: '2026-02-12',
        description: 'V3 methodology training data',
        recent: true
      },
      {
        name: 'Constitution Answers Q6-38',
        path: 'CONSTITUTION-ANSWERS-Q6-38.md',
        size: '11K',
        date: '2026-02-12',
        description: 'Constitutional framework Q&A',
        recent: true
      },
      {
        name: 'Agent Delegation Protocol',
        path: 'AGENT-DELEGATION-PROTOCOL.md',
        size: '12K',
        date: '2026-02-12',
        description: 'Systematic delegation framework',
        recent: true
      },
      {
        name: 'Content Creator Constitution V2',
        path: 'CONTENT-CREATOR-CONSTITUTION-V2.md',
        size: '18K',
        date: '2026-02-12',
        description: 'Content creation governance',
        recent: true
      }
    ]
  },
  'business': {
    name: 'Business Plans',
    icon: '💼',
    color: 'var(--green)',
    documents: [
      {
        name: 'Ginger Shot Startup Package',
        path: 'ginger-shot/STARTUP-PACKAGE-V1.md',
        size: '32K',
        date: '2026-02-12',
        description: 'Complete business plan with $48K budget',
        recent: true,
        priority: 'high'
      },
      {
        name: 'Ginger Shot Executive Summary',
        path: 'ginger-shot/EXECUTIVE-SUMMARY-ACTION-CHECKLIST.md',
        size: '8K',
        date: '2026-02-12',
        description: 'Action checklist and executive overview',
        recent: true
      },
      {
        name: 'Ginger Shot Google Docs Version',
        path: 'ginger-shot/GOOGLE-DOCS-VERSION.md',
        size: '8.9K',
        date: '2026-02-12',
        description: 'Business plan formatted for Google Docs',
        recent: true
      },
      {
        name: 'Esca Overnight Analysis',
        path: 'esca/OVERNIGHT-ANALYSIS-V1.md',
        size: '12K',
        date: '2026-02-12',
        description: 'Comprehensive brand and market analysis',
        recent: true
      },
      {
        name: 'Esca Brand Assets Review',
        path: 'esca/BRAND-ASSETS-INITIAL-REVIEW.md',
        size: '1.4K',
        date: '2026-02-12',
        description: 'Initial brand assets evaluation',
        recent: true
      }
    ]
  },
  'analysis': {
    name: 'Strategic Analysis',
    icon: '📊',
    color: 'var(--yellow)',
    documents: [
      {
        name: 'Workflow Revolution Strategy',
        path: 'WORKFLOW-REVOLUTION-STRATEGY.md',
        size: '29K',
        date: '2026-02-12',
        description: 'Revolutionary workflow methodology',
        recent: true,
        priority: 'high'
      },
      {
        name: 'V3 Methodology Case Study',
        path: 'reference/V3-METHODOLOGY-BREAKTHROUGH-CASE-STUDY.md',
        size: '11K',
        date: '2026-02-12',
        description: 'Breakthrough methodology documentation',
        recent: true
      },
      {
        name: 'Agent Training V3 Case Study',
        path: 'reference/AGENT-TRAINING-V3-CASE-STUDY.md',
        size: '10K',
        date: '2026-02-12',
        description: 'V3 training methodology analysis',
        recent: true
      },
      {
        name: 'Meta Methodology Complete',
        path: 'reference/META-METHODOLOGY-COMPLETE.md',
        size: '7.1K',
        date: '2026-02-12',
        description: 'Complete meta methodology framework'
      },
      {
        name: 'Brutal Business Validation',
        path: 'BRUTAL_BUSINESS_VALIDATION.md',
        size: '8.7K',
        date: '2026-02-12',
        description: 'Business validation framework',
        recent: true
      },
      {
        name: 'Big 4 Pillars Overview',
        path: 'reference/BIG-4-PILLARS-OVERVIEW.md',
        size: '4.6K',
        date: '2026-02-12',
        description: 'Core methodology pillars'
      }
    ]
  },
  'performance': {
    name: 'Performance & Reviews',
    icon: '📈',
    color: 'var(--red)',
    documents: [
      {
        name: '3-Day Performance Review',
        path: '3-DAY-PERFORMANCE-REVIEW.md',
        size: '5.3K',
        date: '2026-02-12',
        description: 'Recent performance analysis',
        recent: true,
        priority: 'high'
      },
      {
        name: 'Memory (Long-term)',
        path: 'MEMORY.md',
        size: '5.1K',
        date: '2026-02-12',
        description: 'Curated long-term memory',
        recent: true
      },
      {
        name: "Today's Memory",
        path: 'memory/2026-02-12.md',
        size: '8.4K',
        date: '2026-02-12',
        description: "Today's activities and learnings",
        recent: true
      },
      {
        name: 'Active Agent Tracking',
        path: 'ACTIVE-AGENT-TRACKING.md',
        size: '1.6K',
        date: '2026-02-12',
        description: 'Real-time agent performance tracking',
        recent: true
      },
      {
        name: 'Performance Rules',
        path: 'reference/PERFORMANCE-RULES.md',
        size: '1.3K',
        date: '2026-02-12',
        description: 'Performance guidelines and rules'
      }
    ]
  },
  'systems': {
    name: 'System Improvements',
    icon: '🔧',
    color: 'var(--primary)',
    documents: [
      {
        name: 'Dashboard API Documentation',
        path: 'dashboard/API-DOCUMENTATION.md',
        size: '9.8K',
        date: '2026-02-12',
        description: 'Complete API documentation',
        recent: true
      },
      {
        name: 'Dashboard UI Specifications',
        path: 'dashboard/UI-SPECIFICATIONS.md',
        size: '11K',
        date: '2026-02-12',
        description: 'UI design specifications',
        recent: true
      },
      {
        name: 'Dashboard Integration Guide',
        path: 'dashboard/INTEGRATION-GUIDE.md',
        size: '6.7K',
        date: '2026-02-12',
        description: 'Integration implementation guide',
        recent: true
      },
      {
        name: 'Dashboard Deployment Summary',
        path: 'dashboard/DEPLOYMENT-SUMMARY.md',
        size: '8.1K',
        date: '2026-02-12',
        description: 'Deployment status and summary',
        recent: true
      },
      {
        name: 'Command Center HTML',
        path: 'dashboard/command-center.html',
        size: '109K',
        date: '2026-02-12',
        description: 'Main dashboard implementation',
        recent: true,
        priority: 'high'
      }
    ]
  },
  'frameworks': {
    name: 'Development Frameworks',
    icon: '🏗️',
    color: 'var(--green)',
    documents: [
      {
        name: 'Framework Validation Results',
        path: 'FRAMEWORK_VALIDATION_RESULTS.md',
        size: '17K',
        date: '2026-02-12',
        description: 'Complete framework validation',
        recent: true
      },
      {
        name: 'Framework Validation System',
        path: 'FRAMEWORK_VALIDATION_SYSTEM.md',
        size: '13K',
        date: '2026-02-12',
        description: 'Validation system methodology',
        recent: true
      },
      {
        name: 'Rapid Deployment Framework',
        path: 'RAPID_DEPLOYMENT_AGENT_FRAMEWORK.md',
        size: '13K',
        date: '2026-02-12',
        description: 'Agent deployment framework',
        recent: true
      },
      {
        name: 'Implementation Toolkit',
        path: 'IMPLEMENTATION_TOOLKIT.md',
        size: '18K',
        date: '2026-02-12',
        description: 'Complete implementation tools',
        recent: true
      },
      {
        name: 'Framework Iteration 5 (Final)',
        path: 'framework_iteration_5_FINAL.md',
        size: '11K',
        date: '2026-02-12',
        description: 'Final framework iteration',
        recent: true
      }
    ]
  }
};

// Document search and filter functions
function searchDocuments(query) {
  const results = [];
  Object.entries(DOCUMENT_CATEGORIES).forEach(([catKey, category]) => {
    category.documents.forEach(doc => {
      if (doc.name.toLowerCase().includes(query.toLowerCase()) || 
          doc.description.toLowerCase().includes(query.toLowerCase())) {
        results.push({...doc, category: category.name, categoryKey: catKey});
      }
    });
  });
  return results;
}

function getRecentDocuments(days = 7) {
  const recent = [];
  Object.entries(DOCUMENT_CATEGORIES).forEach(([catKey, category]) => {
    category.documents.forEach(doc => {
      if (doc.recent) {
        recent.push({...doc, category: category.name, categoryKey: catKey});
      }
    });
  });
  return recent.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getDocumentsByCategory(categoryKey) {
  return DOCUMENT_CATEGORIES[categoryKey]?.documents || [];
}

// Add this function to the renderSection mapping
function renderDocuments() {
  const totalDocs = Object.values(DOCUMENT_CATEGORIES).reduce((sum, cat) => sum + cat.documents.length, 0);
  const recentDocs = getRecentDocuments();
  const todayDocs = recentDocs.filter(doc => doc.date === '2026-02-12');
  
  let h = `<div class="documents-header">
    <h2 style="font-size:22px;font-weight:700;margin-bottom:20px">📚 All Documents</h2>
    <div class="document-search-bar">
      <input type="text" id="doc-search" placeholder="Search documents..." style="padding:8px 12px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,0.04);width:300px;margin-right:12px;">
      <button onclick="filterDocuments()" style="padding:8px 16px;border-radius:8px;background:var(--primary);border:none;">Search</button>
    </div>
  </div>`;

  // Stats row
  h += `<div class="stat-row" style="margin-bottom:24px;">
    <div class="stat-card">
      <div class="label">Total Documents</div>
      <div class="val">${totalDocs}</div>
    </div>
    <div class="stat-card">
      <div class="label">Recent (This Week)</div>
      <div class="val">${recentDocs.length}</div>
    </div>
    <div class="stat-card">
      <div class="label">Created Today</div>
      <div class="val green">${todayDocs.length}</div>
    </div>
    <div class="stat-card">
      <div class="label">Categories</div>
      <div class="val">${Object.keys(DOCUMENT_CATEGORIES).length}</div>
    </div>
  </div>`;

  // Recent documents highlight
  h += `<div class="card" style="margin-bottom:20px;">
    <h3>🔥 Created Today</h3>
    <div class="recent-docs-grid">`;
  
  todayDocs.slice(0, 6).forEach(doc => {
    h += `<div class="doc-card-mini" onclick="openDocument('${doc.path}')" style="cursor:pointer;">
      <div class="doc-title">${doc.name}</div>
      <div class="doc-meta">${doc.size} • ${doc.category}</div>
      <div class="doc-desc">${doc.description}</div>
    </div>`;
  });
  
  h += `</div></div>`;

  // Categories
  Object.entries(DOCUMENT_CATEGORIES).forEach(([catKey, category]) => {
    const priorityDocs = category.documents.filter(d => d.priority === 'high');
    const recentCount = category.documents.filter(d => d.recent).length;
    
    h += `<div class="card document-category">
      <div class="category-header">
        <h3 style="display:flex;align-items:center;gap:8px;">
          <span style="color:${category.color}">${category.icon}</span>
          ${category.name}
          <span class="doc-count">(${category.documents.length})</span>
          ${recentCount > 0 ? `<span class="recent-badge">${recentCount} recent</span>` : ''}
        </h3>
        <button class="expand-btn" onclick="toggleCategory('${catKey}')" style="background:none;border:none;color:var(--muted);cursor:pointer;">▼</button>
      </div>
      <div class="document-grid" id="cat-${catKey}">`;
    
    category.documents.forEach(doc => {
      const isRecent = doc.recent;
      const isPriority = doc.priority === 'high';
      
      h += `<div class="document-item ${isRecent ? 'recent' : ''} ${isPriority ? 'priority' : ''}" onclick="openDocument('${doc.path}')">
        <div class="doc-header">
          <div class="doc-name">${doc.name}</div>
          <div class="doc-badges">
            ${isPriority ? '<span class="priority-badge">HIGH</span>' : ''}
            ${isRecent ? '<span class="recent-badge">NEW</span>' : ''}
          </div>
        </div>
        <div class="doc-meta">
          <span class="doc-size">${doc.size}</span>
          <span class="doc-date">${doc.date}</span>
        </div>
        <div class="doc-description">${doc.description}</div>
        <div class="doc-actions">
          <button onclick="event.stopPropagation();openDocument('${doc.path}')" class="doc-btn">📂 Open</button>
          <button onclick="event.stopPropagation();copyDocPath('${doc.path}')" class="doc-btn">📋 Copy Path</button>
        </div>
      </div>`;
    });
    
    h += `</div></div>`;
  });

  return h;
}

// Document interaction functions
function openDocument(path) {
  // This would integrate with the actual file system
  alert(`Opening document: ${path}`);
  // In real implementation: window.open(path) or integrate with local file opener
}

function copyDocPath(path) {
  navigator.clipboard.writeText(path);
  // Show toast notification
  showToast('Path copied to clipboard');
}

function filterDocuments() {
  const query = document.getElementById('doc-search').value;
  if (!query.trim()) {
    // Show all categories
    Object.keys(DOCUMENT_CATEGORIES).forEach(catKey => {
      document.getElementById(`cat-${catKey}`).style.display = 'grid';
    });
    return;
  }
  
  const results = searchDocuments(query);
  // Hide all categories first
  Object.keys(DOCUMENT_CATEGORIES).forEach(catKey => {
    const grid = document.getElementById(`cat-${catKey}`);
    const items = grid.querySelectorAll('.document-item');
    items.forEach(item => item.style.display = 'none');
  });
  
  // Show matching documents
  results.forEach(doc => {
    const grid = document.getElementById(`cat-${doc.categoryKey}`);
    const items = Array.from(grid.querySelectorAll('.document-item'));
    const matchingItem = items.find(item => 
      item.querySelector('.doc-name').textContent === doc.name
    );
    if (matchingItem) {
      matchingItem.style.display = 'block';
      grid.style.display = 'grid';
    }
  });
}

function toggleCategory(catKey) {
  const grid = document.getElementById(`cat-${catKey}`);
  const btn = grid.parentElement.querySelector('.expand-btn');
  const isHidden = grid.style.display === 'none';
  
  grid.style.display = isHidden ? 'grid' : 'none';
  btn.textContent = isHidden ? '▼' : '▶';
}

function showToast(message) {
  // Simple toast notification
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position:fixed;top:20px;right:20px;background:var(--green);color:white;
    padding:12px 16px;border-radius:8px;z-index:1000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => document.body.removeChild(toast), 3000);
}

export { renderDocuments, DOCUMENT_CATEGORIES, searchDocuments, getRecentDocuments };