/**
 * OpenClaw Sessions API Integration
 * Handles real-time agent monitoring and management
 */

const OPENCLAW_API_BASE = process.env.OPENCLAW_API_URL || 'http://localhost:3000/api'
const DEFAULT_TIMEOUT = 10000 // 10 seconds

/**
 * API client for OpenClaw sessions management
 */
class OpenClawSessionsAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey || process.env.OPENCLAW_API_KEY
    this.baseURL = OPENCLAW_API_BASE
  }

  /**
   * Make authenticated request to OpenClaw API
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`OpenClaw API Error (${endpoint}):`, error)
      throw error
    }
  }

  /**
   * Get all active sessions/agents
   */
  async getSessions() {
    return await this.request('/sessions')
  }

  /**
   * Get specific session by ID
   */
  async getSession(sessionId) {
    return await this.request(`/sessions/${sessionId}`)
  }

  /**
   * Get session logs
   */
  async getSessionLogs(sessionId, limit = 100) {
    return await this.request(`/sessions/${sessionId}/logs?limit=${limit}`)
  }

  /**
   * Kill/terminate a session
   */
  async killSession(sessionId, reason = 'Manual termination') {
    return await this.request(`/sessions/${sessionId}/kill`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    })
  }

  /**
   * Respawn/restart a failed session
   */
  async respawnSession(sessionId, config = {}) {
    return await this.request(`/sessions/${sessionId}/respawn`, {
      method: 'POST',
      body: JSON.stringify(config)
    })
  }

  /**
   * Get session metrics (tokens, performance, etc.)
   */
  async getSessionMetrics(sessionId) {
    return await this.request(`/sessions/${sessionId}/metrics`)
  }

  /**
   * Create a new session/agent
   */
  async createSession(config) {
    return await this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(config)
    })
  }
}

/**
 * Transform raw session data to dashboard format
 */
export function transformSessionToAgent(session) {
  // Calculate status based on session properties
  const getStatus = (session) => {
    if (session.status === 'completed') return 'completed'
    if (session.status === 'failed' || session.status === 'error') return 'failed'
    if (session.status === 'spawning' || session.status === 'starting') return 'spawning'
    
    // Check for stalled status (no activity in last 5 minutes)
    const lastActivity = new Date(session.lastActivity || session.updatedAt)
    const stalledThreshold = 5 * 60 * 1000 // 5 minutes
    if (new Date() - lastActivity > stalledThreshold) return 'stalled'
    
    return 'working'
  }

  // Calculate progress percentage
  const getProgress = (session) => {
    if (session.progress !== undefined) return session.progress
    if (session.status === 'completed') return 100
    if (session.status === 'failed') return 0
    
    // Estimate based on tokens used vs limit
    if (session.tokensUsed && session.tokensLimit) {
      return Math.min(90, Math.floor((session.tokensUsed / session.tokensLimit) * 100))
    }
    
    // Fallback to time-based estimate
    const startTime = new Date(session.startTime || session.createdAt)
    const expectedDuration = session.expectedDuration || 3600000 // 1 hour default
    const elapsed = new Date() - startTime
    return Math.min(95, Math.floor((elapsed / expectedDuration) * 100))
  }

  return {
    id: session.sessionId || session.id,
    name: session.taskName || session.name || 'Unnamed Agent',
    status: getStatus(session),
    task: session.taskDescription || session.prompt || session.task || 'No description',
    progress: getProgress(session),
    tokensUsed: session.tokensUsed || 0,
    tokensLimit: session.tokensLimit || 50000,
    startTime: session.startTime || session.createdAt,
    completedTime: session.completedTime,
    expectedCompletion: session.expectedCompletion,
    outputPath: session.outputPath || session.workdir,
    priority: session.priority || 'normal',
    lastActivity: session.lastActivity || session.updatedAt,
    channel: session.channel,
    nodeId: session.nodeId,
    parentSession: session.parentSession
  }
}

/**
 * WebSocket connection for real-time updates
 */
export class OpenClawWebSocket {
  constructor(onUpdate, onError) {
    this.onUpdate = onUpdate
    this.onError = onError
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }

  connect() {
    const wsURL = (OPENCLAW_API_BASE.replace('http', 'ws')) + '/sessions/ws'
    
    try {
      this.ws = new WebSocket(wsURL)
      
      this.ws.onopen = () => {
        console.log('OpenClaw WebSocket connected')
        this.reconnectAttempts = 0
      }
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          this.onUpdate(data)
        } catch (error) {
          console.error('WebSocket message parse error:', error)
        }
      }
      
      this.ws.onclose = () => {
        console.log('OpenClaw WebSocket disconnected')
        this.attemptReconnect()
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        this.onError(error)
      }
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      this.onError(error)
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = Math.pow(2, this.reconnectAttempts) * 1000 // Exponential backoff
      
      console.log(`Attempting WebSocket reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`)
      
      setTimeout(() => this.connect(), delay)
    } else {
      console.error('Max WebSocket reconnection attempts reached')
      this.onError(new Error('WebSocket reconnection failed'))
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

/**
 * React hook for agent monitoring
 */
export function useAgentMonitoring(options = {}) {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const api = new OpenClawSessionsAPI(options.apiKey)
  const pollingInterval = options.pollingInterval || 10000
  const useWebSocket = options.useWebSocket !== false

  const fetchAgents = async () => {
    try {
      setLoading(true)
      const sessions = await api.getSessions()
      const transformedAgents = sessions.map(transformSessionToAgent)
      
      setAgents(transformedAgents)
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const agentActions = {
    kill: async (agentId, reason) => {
      await api.killSession(agentId, reason)
      return fetchAgents()
    },
    respawn: async (agentId, config) => {
      await api.respawnSession(agentId, config)
      return fetchAgents()
    },
    getLogs: async (agentId) => {
      return await api.getSessionLogs(agentId)
    },
    getMetrics: async (agentId) => {
      return await api.getSessionMetrics(agentId)
    }
  }

  return {
    agents,
    loading,
    error,
    lastUpdate,
    refresh: fetchAgents,
    actions: agentActions
  }
}

// Default export
const sessionsAPI = new OpenClawSessionsAPI()
export default sessionsAPI