import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

const AGENT_STATUS_MAP = {
  'working': { color: '#FFD700', label: 'WORKING', icon: '⚡' },
  'completed': { color: '#8B9A7E', label: 'COMPLETED', icon: '✅' },
  'failed': { color: '#C47B5C', label: 'FAILED', icon: '❌' },
  'stalled': { color: '#FF6B6B', label: 'STALLED', icon: '⚠️' },
  'spawning': { color: '#87CEEB', label: 'SPAWNING', icon: '🔄' }
}

const POLLING_INTERVAL = 10000 // 10 seconds

export default function AgentMonitoringPage() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Mock data structure - replace with real API calls
  const fetchAgentsData = useCallback(async () => {
    try {
      setLoading(true)
      
      // TODO: Replace with actual OpenClaw sessions API call
      // const response = await fetch('/api/openclaw/sessions')
      // const data = await response.json()
      
      // Mock data for demonstration
      const mockAgents = [
        {
          id: '2062390b-441c-40e2-b4fb-5ef26d980d2d',
          name: 'Constitution V3 Merge',
          status: 'working',
          task: 'Merge Light\'s authentics + Claude\'s strategic expansions',
          progress: 65,
          tokensUsed: 15420,
          tokensLimit: 50000,
          startTime: '2026-02-12T20:16:00Z',
          expectedCompletion: '2026-02-12T21:30:00Z',
          outputPath: '/Users/zonte/.openclaw/workspace/reference/CONSTITUTION-V3.md',
          priority: 'critical',
          lastActivity: '2026-02-12T20:25:00Z'
        },
        {
          id: 'b1d14328-3cc8-4528-9f71-df9063c387a4',
          name: 'Ginger Shot Startup Package',
          status: 'completed',
          task: '30 brand names, market analysis, revenue models, website specs',
          progress: 100,
          tokensUsed: 42300,
          tokensLimit: 50000,
          startTime: '2026-02-12T18:45:00Z',
          completedTime: '2026-02-12T20:15:00Z',
          outputPath: '/Users/zonte/.openclaw/workspace/ginger-shot/STARTUP-PACKAGE-V1.md',
          priority: 'high',
          lastActivity: '2026-02-12T20:15:00Z'
        },
        {
          id: 'dbc6b412-3b18-4cb4-88f2-983eb0668755',
          name: 'Agent Monitoring Dashboard',
          status: 'working',
          task: 'BUILD LIVE AGENT MONITORING DASHBOARD PAGE',
          progress: 45,
          tokensUsed: 8900,
          tokensLimit: 25000,
          startTime: '2026-02-12T20:18:00Z',
          expectedCompletion: '2026-02-12T21:00:00Z',
          outputPath: '/Users/zonte/.openclaw/workspace/dashboard/agent-monitoring-page.jsx',
          priority: 'high',
          lastActivity: '2026-02-12T20:28:00Z'
        }
      ]
      
      setAgents(mockAgents)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh logic
  useEffect(() => {
    fetchAgentsData()
    
    if (autoRefresh) {
      const interval = setInterval(fetchAgentsData, POLLING_INTERVAL)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchAgentsData])

  const getAgentStatus = (agent) => {
    if (agent.progress === 100) return 'completed'
    if (new Date() - new Date(agent.lastActivity) > 300000) return 'stalled' // 5 minutes
    if (agent.tokensUsed > agent.tokensLimit * 0.95) return 'failed'
    return 'working'
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDuration = (start, end = new Date()) => {
    const duration = Math.floor((new Date(end) - new Date(start)) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }

  const handleAgentAction = (agentId, action) => {
    // TODO: Implement actual agent management actions
    console.log(`${action} agent ${agentId}`)
    
    switch (action) {
      case 'respawn':
        // API call to respawn failed/stalled agent
        break
      case 'kill':
        // API call to terminate agent
        break
      case 'logs':
        // Open logs modal/view
        setSelectedAgent(agents.find(a => a.id === agentId))
        break
      default:
        break
    }
  }

  const getStalledAgents = () => {
    return agents.filter(agent => getAgentStatus(agent) === 'stalled').length
  }

  const getFailedAgents = () => {
    return agents.filter(agent => getAgentStatus(agent) === 'failed').length
  }

  return (
    <>
      <Head>
        <title>Agent Monitor | Command Center</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      
      <div className="agent-monitor">
        {/* Header */}
        <div className="monitor-header">
          <div className="header-left">
            <h1 className="page-title">🤖 Live Agent Monitor</h1>
            <div className="update-info">
              Last update: {formatTime(lastUpdate)}
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className={`btn ${autoRefresh ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? '⏹️ Pause' : '▶️ Resume'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={fetchAgentsData}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Alert Bar */}
        {(getStalledAgents() > 0 || getFailedAgents() > 0) && (
          <div className="alert-bar">
            <div className="alert-content">
              ⚠️ <strong>Intervention Required:</strong> 
              {getStalledAgents() > 0 && ` ${getStalledAgents()} stalled agents`}
              {getFailedAgents() > 0 && ` ${getFailedAgents()} failed agents`}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{agents.filter(a => getAgentStatus(a) === 'working').length}</div>
            <div className="stat-label">Working</div>
            <div className="stat-icon">⚡</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{agents.filter(a => getAgentStatus(a) === 'completed').length}</div>
            <div className="stat-label">Completed</div>
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-card alert">
            <div className="stat-value">{getStalledAgents()}</div>
            <div className="stat-label">Stalled</div>
            <div className="stat-icon">⚠️</div>
          </div>
          <div className="stat-card error">
            <div className="stat-value">{getFailedAgents()}</div>
            <div className="stat-label">Failed</div>
            <div className="stat-icon">❌</div>
          </div>
        </div>

        {/* Agent List */}
        <div className="agents-container">
          {loading && agents.length === 0 ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading agents...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>Error loading agents: {error}</p>
              <button className="btn btn-primary" onClick={fetchAgentsData}>
                Retry
              </button>
            </div>
          ) : (
            <div className="agents-grid">
              {agents.map(agent => {
                const status = getAgentStatus(agent)
                const statusConfig = AGENT_STATUS_MAP[status]
                
                return (
                  <div key={agent.id} className={`agent-card ${status}`}>
                    <div className="agent-header">
                      <div className="agent-title">
                        <span className="agent-name">{agent.name}</span>
                        <span 
                          className="agent-status"
                          style={{ color: statusConfig.color }}
                        >
                          {statusConfig.icon} {statusConfig.label}
                        </span>
                      </div>
                      <div className="agent-priority">
                        {agent.priority === 'critical' && '🔴'}
                        {agent.priority === 'high' && '🟡'}
                        {agent.priority === 'normal' && '🟢'}
                      </div>
                    </div>

                    <div className="agent-task">
                      {agent.task}
                    </div>

                    <div className="agent-progress">
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar" 
                          style={{ 
                            width: `${agent.progress}%`,
                            backgroundColor: statusConfig.color 
                          }}
                        />
                      </div>
                      <span className="progress-text">{agent.progress}%</span>
                    </div>

                    <div className="agent-metrics">
                      <div className="metric">
                        <span className="metric-label">Tokens</span>
                        <span className="metric-value">
                          {agent.tokensUsed.toLocaleString()} / {agent.tokensLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Runtime</span>
                        <span className="metric-value">
                          {formatDuration(agent.startTime)}
                        </span>
                      </div>
                    </div>

                    <div className="agent-meta">
                      <div className="agent-output">
                        <span className="output-label">Output:</span>
                        <span className="output-path">{agent.outputPath}</span>
                      </div>
                      <div className="agent-id">
                        ID: {agent.id.slice(0, 8)}...
                      </div>
                    </div>

                    <div className="agent-actions">
                      {status === 'stalled' || status === 'failed' ? (
                        <>
                          <button 
                            className="action-btn respawn"
                            onClick={() => handleAgentAction(agent.id, 'respawn')}
                          >
                            🔄 Respawn
                          </button>
                          <button 
                            className="action-btn kill"
                            onClick={() => handleAgentAction(agent.id, 'kill')}
                          >
                            💀 Kill
                          </button>
                        </>
                      ) : (
                        <button 
                          className="action-btn kill"
                          onClick={() => handleAgentAction(agent.id, 'kill')}
                        >
                          🛑 Stop
                        </button>
                      )}
                      <button 
                        className="action-btn logs"
                        onClick={() => handleAgentAction(agent.id, 'logs')}
                      >
                        📋 Logs
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .agent-monitor {
          padding: 24px;
          min-height: 100vh;
          background: var(--linen, #F5F0EB);
        }

        .monitor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(139, 154, 126, 0.2);
        }

        .page-title {
          font-size: 28px;
          font-weight: 600;
          color: var(--charcoal, #2C2C2C);
          margin-bottom: 4px;
        }

        .update-info {
          font-size: 12px;
          color: rgba(44, 44, 44, 0.6);
          font-family: 'JetBrains Mono', monospace;
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
          font-size: 14px;
        }

        .btn-primary {
          background: var(--sage, #8B9A7E);
          color: white;
        }

        .btn-primary:hover {
          background: #7a8a6e;
        }

        .btn-secondary {
          background: rgba(139, 154, 126, 0.1);
          color: var(--sage, #8B9A7E);
        }

        .btn-secondary:hover {
          background: rgba(139, 154, 126, 0.2);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .alert-bar {
          background: #FFF3CD;
          border: 1px solid #FFE69C;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 24px;
        }

        .alert-content {
          color: #856404;
          font-size: 14px;
          font-weight: 500;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--warm-white, #FEFEFE);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(44, 44, 44, 0.06);
          position: relative;
          overflow: hidden;
        }

        .stat-card.alert {
          border-left: 4px solid #FFD700;
        }

        .stat-card.error {
          border-left: 4px solid #C47B5C;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: var(--sage, #8B9A7E);
          margin-bottom: 4px;
        }

        .stat-card.alert .stat-value {
          color: #FFB000;
        }

        .stat-card.error .stat-value {
          color: #C47B5C;
        }

        .stat-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(44, 44, 44, 0.6);
          font-weight: 500;
        }

        .stat-icon {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 20px;
          opacity: 0.3;
        }

        .loading-state, .error-state {
          text-align: center;
          padding: 48px 24px;
          color: rgba(44, 44, 44, 0.6);
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(139, 154, 126, 0.2);
          border-top: 3px solid var(--sage, #8B9A7E);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        .agent-card {
          background: var(--warm-white, #FEFEFE);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(44, 44, 44, 0.06);
          border-left: 4px solid var(--sage, #8B9A7E);
          transition: all 0.2s ease;
        }

        .agent-card:hover {
          box-shadow: 0 4px 16px rgba(44, 44, 44, 0.1);
        }

        .agent-card.working {
          border-left-color: #FFD700;
        }

        .agent-card.completed {
          border-left-color: var(--sage, #8B9A7E);
        }

        .agent-card.failed, .agent-card.stalled {
          border-left-color: #C47B5C;
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .agent-title {
          flex: 1;
        }

        .agent-name {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: var(--charcoal, #2C2C2C);
          margin-bottom: 4px;
        }

        .agent-status {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .agent-priority {
          font-size: 16px;
        }

        .agent-task {
          font-size: 14px;
          color: rgba(44, 44, 44, 0.7);
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .agent-progress {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          gap: 12px;
        }

        .progress-bar-container {
          flex: 1;
          height: 8px;
          background: rgba(139, 154, 126, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 12px;
          font-weight: 600;
          color: rgba(44, 44, 44, 0.8);
          font-family: 'JetBrains Mono', monospace;
        }

        .agent-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .metric-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: rgba(44, 44, 44, 0.5);
          font-weight: 500;
        }

        .metric-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--charcoal, #2C2C2C);
          font-family: 'JetBrains Mono', monospace;
        }

        .agent-meta {
          margin-bottom: 16px;
          font-size: 12px;
          color: rgba(44, 44, 44, 0.6);
        }

        .agent-output {
          margin-bottom: 8px;
        }

        .output-label {
          font-weight: 500;
        }

        .output-path {
          font-family: 'JetBrains Mono', monospace;
          word-break: break-all;
        }

        .agent-id {
          font-family: 'JetBrains Mono', monospace;
        }

        .agent-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          flex: 1;
          min-width: 80px;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.respawn {
          background: #E3F2FD;
          color: #1976D2;
        }

        .action-btn.respawn:hover {
          background: #BBDEFB;
        }

        .action-btn.kill {
          background: #FFEBEE;
          color: #D32F2F;
        }

        .action-btn.kill:hover {
          background: #FFCDD2;
        }

        .action-btn.logs {
          background: rgba(139, 154, 126, 0.1);
          color: var(--sage, #8B9A7E);
        }

        .action-btn.logs:hover {
          background: rgba(139, 154, 126, 0.2);
        }

        @media (max-width: 768px) {
          .monitor-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .agents-grid {
            grid-template-columns: 1fr;
          }

          .agent-metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}