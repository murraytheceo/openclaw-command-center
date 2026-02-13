import { useState } from 'react'

const AGENT_STATUS_MAP = {
  'working': { color: '#FFD700', label: 'WORKING', icon: '⚡' },
  'completed': { color: '#8B9A7E', label: 'COMPLETED', icon: '✅' },
  'failed': { color: '#C47B5C', label: 'FAILED', icon: '❌' },
  'stalled': { color: '#FF6B6B', label: 'STALLED', icon: '⚠️' },
  'spawning': { color: '#87CEEB', label: 'SPAWNING', icon: '🔄' }
}

export default function AgentCard({ agent, onAction }) {
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  const status = agent.status || 'working'
  const statusConfig = AGENT_STATUS_MAP[status] || AGENT_STATUS_MAP['working']

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDuration = (start, end = new Date()) => {
    if (!start) return 'N/A'
    const duration = Math.floor((new Date(end) - new Date(start)) / 1000)
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }

  const handleShowLogs = async () => {
    if (!showLogs) {
      setLoadingLogs(true)
      try {
        const agentLogs = await onAction(agent.id, 'logs')
        setLogs(agentLogs || [])
      } catch (error) {
        console.error('Failed to load logs:', error)
        setLogs([{ 
          timestamp: new Date().toISOString(), 
          level: 'error', 
          message: 'Failed to load logs: ' + error.message 
        }])
      } finally {
        setLoadingLogs(false)
      }
    }
    setShowLogs(!showLogs)
  }

  const getTokenUsageColor = () => {
    const usage = agent.tokensUsed / agent.tokensLimit
    if (usage > 0.9) return '#C47B5C' // Red
    if (usage > 0.7) return '#FFD700' // Yellow
    return '#8B9A7E' // Green
  }

  return (
    <div className={`agent-card ${status}`}>
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
          {agent.priority === 'low' && '⚪'}
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
          <span className="metric-value" style={{ color: getTokenUsageColor() }}>
            {agent.tokensUsed?.toLocaleString() || 0} / {agent.tokensLimit?.toLocaleString() || 'N/A'}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Runtime</span>
          <span className="metric-value">
            {formatDuration(agent.startTime)}
          </span>
        </div>
        {agent.expectedCompletion && (
          <div className="metric">
            <span className="metric-label">ETA</span>
            <span className="metric-value">
              {formatTime(agent.expectedCompletion)}
            </span>
          </div>
        )}
      </div>

      <div className="agent-meta">
        <div className="agent-output">
          <span className="output-label">Output:</span>
          <span className="output-path" title={agent.outputPath}>
            {agent.outputPath ? 
              agent.outputPath.split('/').pop() || agent.outputPath : 
              'No output path'
            }
          </span>
        </div>
        <div className="agent-id">
          ID: {agent.id ? agent.id.slice(0, 8) + '...' : 'Unknown'}
        </div>
        <div className="agent-last-activity">
          Last activity: {formatTime(agent.lastActivity)}
        </div>
      </div>

      <div className="agent-actions">
        {status === 'stalled' || status === 'failed' ? (
          <>
            <button 
              className="action-btn respawn"
              onClick={() => onAction(agent.id, 'respawn')}
            >
              🔄 Respawn
            </button>
            <button 
              className="action-btn kill"
              onClick={() => onAction(agent.id, 'kill')}
            >
              💀 Kill
            </button>
          </>
        ) : status === 'working' ? (
          <button 
            className="action-btn kill"
            onClick={() => onAction(agent.id, 'kill')}
          >
            🛑 Stop
          </button>
        ) : null}
        
        <button 
          className="action-btn logs"
          onClick={handleShowLogs}
          disabled={loadingLogs}
        >
          📋 {showLogs ? 'Hide' : 'Show'} Logs
        </button>
      </div>

      {showLogs && (
        <div className="logs-container">
          <div className="logs-header">
            <h4>Execution Logs</h4>
            <button 
              className="logs-close"
              onClick={() => setShowLogs(false)}
            >
              ✕
            </button>
          </div>
          <div className="logs-content">
            {loadingLogs ? (
              <div className="logs-loading">Loading logs...</div>
            ) : logs.length === 0 ? (
              <div className="logs-empty">No logs available</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`log-entry log-${log.level}`}>
                  <span className="log-time">
                    {formatTime(log.timestamp)}
                  </span>
                  <span className={`log-level level-${log.level}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="log-message">
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .agent-card {
          background: var(--warm-white, #FEFEFE);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(44, 44, 44, 0.06);
          border-left: 4px solid var(--sage, #8B9A7E);
          transition: all 0.2s ease;
          position: relative;
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

        .agent-card.spawning {
          border-left-color: #87CEEB;
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

        .agent-id, .agent-last-activity {
          margin-bottom: 4px;
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

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-btn.respawn {
          background: #E3F2FD;
          color: #1976D2;
        }

        .action-btn.respawn:hover:not(:disabled) {
          background: #BBDEFB;
        }

        .action-btn.kill {
          background: #FFEBEE;
          color: #D32F2F;
        }

        .action-btn.kill:hover:not(:disabled) {
          background: #FFCDD2;
        }

        .action-btn.logs {
          background: rgba(139, 154, 126, 0.1);
          color: var(--sage, #8B9A7E);
        }

        .action-btn.logs:hover:not(:disabled) {
          background: rgba(139, 154, 126, 0.2);
        }

        .logs-container {
          margin-top: 16px;
          border-top: 1px solid rgba(139, 154, 126, 0.1);
          padding-top: 16px;
        }

        .logs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .logs-header h4 {
          font-size: 14px;
          font-weight: 600;
          color: var(--charcoal, #2C2C2C);
        }

        .logs-close {
          background: none;
          border: none;
          font-size: 14px;
          cursor: pointer;
          color: rgba(44, 44, 44, 0.6);
        }

        .logs-content {
          max-height: 200px;
          overflow-y: auto;
          background: rgba(139, 154, 126, 0.03);
          border-radius: 6px;
          padding: 8px;
        }

        .logs-loading, .logs-empty {
          text-align: center;
          color: rgba(44, 44, 44, 0.5);
          font-style: italic;
          padding: 16px;
        }

        .log-entry {
          display: grid;
          grid-template-columns: auto auto 1fr;
          gap: 8px;
          padding: 4px 0;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
        }

        .log-time {
          color: rgba(44, 44, 44, 0.5);
        }

        .log-level {
          font-weight: 600;
          text-transform: uppercase;
        }

        .level-debug {
          color: #666;
        }

        .level-info {
          color: #2196F3;
        }

        .level-warn {
          color: #FF9800;
        }

        .level-error {
          color: #F44336;
        }

        .log-message {
          color: var(--charcoal, #2C2C2C);
        }

        @media (max-width: 768px) {
          .agent-metrics {
            grid-template-columns: 1fr;
          }
          
          .action-btn {
            min-width: 60px;
            font-size: 10px;
            padding: 4px 8px;
          }
        }
      `}</style>
    </div>
  )
}