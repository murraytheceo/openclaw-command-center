import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isOnline, setIsOnline] = useState(true)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    // Load saved notes
    const savedNotes = localStorage.getItem('dashboard-notes')
    if (savedNotes) setNotes(savedNotes)
  }, [])

  const saveNotes = (value: string) => {
    setNotes(value)
    localStorage.setItem('dashboard-notes', value)
  }

  return (
    <>
      <Head>
        <title>⚡ Command Center</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo">⚡ Command Center</h1>
            <div className={`status ${isOnline ? 'online' : 'offline'}`}>
              <div className="status-dot"></div>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
          </div>

          <nav className="sidebar-nav">
            {['overview', 'agents', 'trading', 'dashboard', 'business'].map(tab => (
              <button
                key={tab}
                className={`nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                <span className="nav-icon">
                  {tab === 'overview' && '📊'}
                  {tab === 'agents' && '🤖'}
                  {tab === 'trading' && '📈'}
                  {tab === 'dashboard' && '⚡'}
                  {tab === 'business' && '🏢'}
                </span>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-header">
            <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="header-actions">
              <button className="btn btn-primary">Deploy</button>
              <button className="btn btn-secondary">Settings</button>
            </div>
          </div>

          <div className="content-body">
            {activeTab === 'overview' && (
              <div className="grid">
                <div className="card">
                  <h3>System Status</h3>
                  <div className="status-grid">
                    <div className="status-item">
                      <span className="status-label">Murray</span>
                      <span className="status-value online">ONLINE</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Telegram</span>
                      <span className="status-value online">CONNECTED</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Browser</span>
                      <span className="status-value online">READY</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3>Quick Stats</h3>
                  <div className="stats-grid">
                    <div className="stat">
                      <div className="stat-value">$400K</div>
                      <div className="stat-label">Liquid Capital</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">3</div>
                      <div className="stat-label">Active Projects</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'agents' && (
              <div className="grid">
                <div className="card">
                  <h3>Agent Status</h3>
                  <div className="agent-list">
                    {['Deep Research', 'QC', 'MuteSwap Growth', 'My Quant', 'Theodore'].map(agent => (
                      <div key={agent} className="agent-item">
                        <span className="agent-name">{agent}</span>
                        <span className="agent-status online">READY</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'business' && (
              <div className="grid">
                <div className="card">
                  <h3>Esca Wallet</h3>
                  <p>Best Monero wallet - Venmo UX for mainstream adoption</p>
                  <div className="progress">
                    <div className="progress-bar" style={{width: '15%'}}></div>
                  </div>
                  <span className="progress-label">Product Spec Complete</span>
                </div>

                <div className="card">
                  <h3>MuteSwap</h3>
                  <p>No-KYC Monero exchange - Partner integration</p>
                  <div className="progress">
                    <div className="progress-bar" style={{width: '75%'}}></div>
                  </div>
                  <span className="progress-label">Live & Growing</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Notes Panel */}
        <aside className="notes-panel">
          <div className="notes-header">
            <h3>📝 Notes</h3>
          </div>
          <textarea
            className="notes-textarea"
            placeholder="Quick notes and thoughts..."
            value={notes}
            onChange={(e) => saveNotes(e.target.value)}
          />
          <div className="notes-footer">
            <span className="save-indicator">Auto-saved</span>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --linen: #F5F0EB;
          --sage: #8B9A7E;
          --terracotta: #C47B5C;
          --brass: #B8860B;
          --charcoal: #2C2C2C;
          --warm-white: #FEFEFE;
          --soft-shadow: 0 2px 8px rgba(44, 44, 44, 0.06);
        }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--linen);
          color: var(--charcoal);
          height: 100vh;
          overflow: hidden;
        }

        .dashboard {
          display: grid;
          grid-template-columns: 240px 1fr 300px;
          height: 100vh;
        }

        /* Sidebar */
        .sidebar {
          background: var(--warm-white);
          border-right: 1px solid rgba(139, 154, 126, 0.1);
          padding: 24px 0;
        }

        .sidebar-header {
          padding: 0 24px 32px;
        }

        .logo {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .status {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 8px;
        }

        .status.online .status-dot {
          background: var(--sage);
        }

        .sidebar-nav {
          padding: 0 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 12px 12px;
          border: none;
          background: none;
          color: var(--charcoal);
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 4px;
        }

        .nav-item:hover {
          background: rgba(139, 154, 126, 0.08);
        }

        .nav-item.active {
          background: rgba(139, 154, 126, 0.12);
          color: var(--sage);
        }

        .nav-icon {
          margin-right: 12px;
          font-size: 16px;
        }

        /* Main Content */
        .main-content {
          padding: 32px;
          overflow-y: auto;
        }

        .content-header {
          display: flex;
          justify-content: between;
          align-items: center;
          margin-bottom: 32px;
        }

        .content-header h2 {
          font-size: 28px;
          font-weight: 600;
        }

        .header-actions {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: var(--sage);
          color: white;
        }

        .btn-secondary {
          background: rgba(139, 154, 126, 0.1);
          color: var(--sage);
        }

        /* Content Body */
        .content-body {
          max-width: none;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .card {
          background: var(--warm-white);
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--soft-shadow);
        }

        .card h3 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .status-grid, .stats-grid {
          display: grid;
          gap: 16px;
        }

        .status-item, .agent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(139, 154, 126, 0.1);
        }

        .status-item:last-child, .agent-item:last-child {
          border-bottom: none;
        }

        .status-value, .agent-status {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-value.online, .agent-status.online {
          color: var(--sage);
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: var(--sage);
        }

        .stat-label {
          font-size: 12px;
          color: rgba(44, 44, 44, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .progress {
          width: 100%;
          height: 6px;
          background: rgba(139, 154, 126, 0.1);
          border-radius: 3px;
          margin: 12px 0 8px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: var(--sage);
          transition: width 0.3s ease;
        }

        .progress-label {
          font-size: 12px;
          color: rgba(44, 44, 44, 0.6);
        }

        /* Notes Panel */
        .notes-panel {
          background: var(--warm-white);
          border-left: 1px solid rgba(139, 154, 126, 0.1);
          padding: 24px;
          display: flex;
          flex-direction: column;
        }

        .notes-header {
          margin-bottom: 16px;
        }

        .notes-header h3 {
          font-size: 16px;
          font-weight: 600;
        }

        .notes-textarea {
          flex: 1;
          border: none;
          outline: none;
          resize: none;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          line-height: 1.6;
          background: rgba(139, 154, 126, 0.03);
          border-radius: 8px;
          padding: 16px;
          color: var(--charcoal);
        }

        .notes-textarea::placeholder {
          color: rgba(44, 44, 44, 0.4);
        }

        .notes-footer {
          margin-top: 16px;
          text-align: center;
        }

        .save-indicator {
          font-size: 11px;
          color: var(--sage);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </>
  )
}