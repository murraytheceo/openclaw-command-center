# OpenClaw Sessions API Documentation

## Overview

This document describes the OpenClaw Sessions API integration for the Agent Monitoring Dashboard. The API provides real-time access to agent/session data, metrics, and management capabilities.

## Base Configuration

```javascript
const OPENCLAW_API_BASE = process.env.OPENCLAW_API_URL || 'http://localhost:3000/api'
```

## Authentication

The API supports Bearer token authentication:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
}
```

## API Endpoints

### 1. Get All Sessions

**GET** `/api/sessions`

Returns list of all active and recent sessions/agents.

**Response:**
```json
{
  "sessions": [
    {
      "sessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
      "name": "Constitution V3 Merge",
      "status": "working",
      "taskDescription": "Merge Light's authentics + Claude's strategic expansions",
      "progress": 65,
      "tokensUsed": 15420,
      "tokensLimit": 50000,
      "startTime": "2026-02-12T20:16:00Z",
      "expectedCompletion": "2026-02-12T21:30:00Z",
      "lastActivity": "2026-02-12T20:25:00Z",
      "outputPath": "/Users/zonte/.openclaw/workspace/reference/CONSTITUTION-V3.md",
      "priority": "critical",
      "channel": "telegram",
      "nodeId": "main",
      "parentSession": null
    }
  ],
  "total": 1,
  "timestamp": "2026-02-12T20:28:00Z"
}
```

### 2. Get Session Details

**GET** `/api/sessions/{sessionId}`

Returns detailed information about a specific session.

**Response:**
```json
{
  "session": {
    "sessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
    "name": "Constitution V3 Merge",
    "status": "working",
    "taskDescription": "Merge Light's authentics + Claude's strategic expansions",
    "fullPrompt": "...",
    "progress": 65,
    "tokensUsed": 15420,
    "tokensLimit": 50000,
    "startTime": "2026-02-12T20:16:00Z",
    "lastActivity": "2026-02-12T20:25:00Z",
    "expectedCompletion": "2026-02-12T21:30:00Z",
    "outputPath": "/Users/zonte/.openclaw/workspace/reference/CONSTITUTION-V3.md",
    "priority": "critical",
    "channel": "telegram",
    "nodeId": "main",
    "parentSession": null,
    "childSessions": [],
    "metadata": {
      "requesterSession": "agent:main:main",
      "model": "anthropic/claude-sonnet-4-20250514",
      "host": "Zonte's MacBook Air"
    }
  }
}
```

### 3. Get Session Logs

**GET** `/api/sessions/{sessionId}/logs?limit=100&offset=0`

Returns execution logs for a specific session.

**Query Parameters:**
- `limit`: Number of log entries (default: 100, max: 1000)
- `offset`: Pagination offset (default: 0)
- `level`: Filter by log level (`debug`, `info`, `warn`, `error`)

**Response:**
```json
{
  "logs": [
    {
      "timestamp": "2026-02-12T20:25:00Z",
      "level": "info",
      "message": "Processing constitutional merge request",
      "context": {
        "tokensUsed": 15420,
        "progress": 65
      }
    },
    {
      "timestamp": "2026-02-12T20:24:30Z",  
      "level": "debug",
      "message": "Analyzing constitutional principles",
      "context": {}
    }
  ],
  "total": 45,
  "hasMore": true
}
```

### 4. Get Session Metrics

**GET** `/api/sessions/{sessionId}/metrics`

Returns detailed performance metrics for a session.

**Response:**
```json
{
  "metrics": {
    "tokens": {
      "used": 15420,
      "limit": 50000,
      "percentage": 30.84,
      "ratePer60s": 245.2
    },
    "timing": {
      "startTime": "2026-02-12T20:16:00Z",
      "duration": 720000,
      "expectedDuration": 4500000,
      "estimatedCompletion": "2026-02-12T21:30:00Z"
    },
    "progress": {
      "percentage": 65,
      "tasksCompleted": 7,
      "tasksTotal": 12,
      "currentTask": "Merging strategic expansions"
    },
    "performance": {
      "memoryUsage": 245.7,
      "cpuTime": 12.3,
      "ioOperations": 156
    }
  }
}
```

### 5. Kill Session

**POST** `/api/sessions/{sessionId}/kill`

Terminates a running session.

**Request Body:**
```json
{
  "reason": "Manual termination requested by user",
  "force": false
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
  "status": "terminated",
  "timestamp": "2026-02-12T20:30:00Z"
}
```

### 6. Respawn Session

**POST** `/api/sessions/{sessionId}/respawn`

Restarts a failed or stalled session.

**Request Body:**
```json
{
  "resetProgress": true,
  "newTokenLimit": 75000,
  "priority": "high",
  "reason": "Respawning stalled agent"
}
```

**Response:**
```json
{
  "success": true,
  "originalSessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
  "newSessionId": "3a7f4e8b-552c-41e3-c5fb-6ef37d981e8f", 
  "status": "spawning",
  "timestamp": "2026-02-12T20:32:00Z"
}
```

### 7. Create Session

**POST** `/api/sessions`

Creates a new agent session.

**Request Body:**
```json
{
  "name": "New Agent Task",
  "taskDescription": "Description of the task to perform",
  "prompt": "Full prompt text for the agent",
  "priority": "normal",
  "tokensLimit": 50000,
  "expectedDuration": 3600000,
  "outputPath": "/path/to/output",
  "parentSession": "parent-session-id",
  "metadata": {
    "requester": "user",
    "channel": "telegram"
  }
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "4b8g5f9c-663d-42f4-d6gc-7fg48e892f9g",
  "status": "spawning",
  "timestamp": "2026-02-12T20:35:00Z"
}
```

## WebSocket Events

### Connection

**URL:** `ws://localhost:3000/api/sessions/ws`

### Event Types

#### Session Update
```json
{
  "type": "session_update",
  "data": {
    "sessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
    "status": "working",
    "progress": 70,
    "tokensUsed": 17820,
    "lastActivity": "2026-02-12T20:30:00Z"
  }
}
```

#### Session Complete
```json
{
  "type": "session_complete",
  "data": {
    "sessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
    "status": "completed",
    "completedTime": "2026-02-12T21:15:00Z",
    "finalProgress": 100,
    "totalTokensUsed": 43200
  }
}
```

#### Session Failed
```json
{
  "type": "session_failed", 
  "data": {
    "sessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
    "status": "failed",
    "error": "Token limit exceeded",
    "failedTime": "2026-02-12T20:45:00Z"
  }
}
```

#### Session Stalled
```json
{
  "type": "session_stalled",
  "data": {
    "sessionId": "2062390b-441c-40e2-b4fb-5ef26d980d2d",
    "status": "stalled",
    "lastActivity": "2026-02-12T20:20:00Z",
    "stalledDuration": 600000
  }
}
```

## Data Transformation

The dashboard uses `transformSessionToAgent()` function to convert raw API data to the expected format:

```javascript
export function transformSessionToAgent(session) {
  return {
    id: session.sessionId,
    name: session.name || 'Unnamed Agent',
    status: calculateStatus(session),
    task: session.taskDescription,
    progress: calculateProgress(session),
    tokensUsed: session.tokensUsed || 0,
    tokensLimit: session.tokensLimit || 50000,
    startTime: session.startTime,
    completedTime: session.completedTime,
    expectedCompletion: session.expectedCompletion,
    outputPath: session.outputPath,
    priority: session.priority || 'normal',
    lastActivity: session.lastActivity
  }
}
```

## Status Calculation Logic

```javascript
function calculateStatus(session) {
  // Explicit status from API
  if (session.status === 'completed') return 'completed'
  if (session.status === 'failed') return 'failed'
  if (session.status === 'spawning') return 'spawning'
  
  // Calculate based on activity
  const lastActivity = new Date(session.lastActivity)
  const stalledThreshold = 5 * 60 * 1000 // 5 minutes
  
  if (new Date() - lastActivity > stalledThreshold) {
    return 'stalled'
  }
  
  // Check token exhaustion
  if (session.tokensUsed >= session.tokensLimit * 0.95) {
    return 'failed'
  }
  
  return 'working'
}
```

## Error Handling

### API Errors
```json
{
  "error": {
    "code": "SESSION_NOT_FOUND",
    "message": "Session with ID 2062390b-441c-40e2-b4fb-5ef26d980d2d not found",
    "details": {},
    "timestamp": "2026-02-12T20:30:00Z"
  }
}
```

### Common Error Codes
- `SESSION_NOT_FOUND`: Session ID doesn't exist
- `INVALID_TOKEN_LIMIT`: Token limit exceeds maximum allowed
- `UNAUTHORIZED`: Invalid or missing API key
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SESSION_ALREADY_TERMINATED`: Cannot kill already terminated session
- `RESPAWN_NOT_ALLOWED`: Session cannot be respawned

## Rate Limits

- **General API**: 100 requests per minute per API key
- **WebSocket**: No rate limit (connection-based)
- **Session Creation**: 10 sessions per minute
- **Session Management**: 50 operations per minute

## Environment Configuration

```bash
# Required
OPENCLAW_API_URL=http://localhost:3000/api
OPENCLAW_API_KEY=your_secret_key_here

# Optional  
OPENCLAW_WS_URL=ws://localhost:3000/ws
OPENCLAW_TIMEOUT=10000
OPENCLAW_RETRY_ATTEMPTS=3
```

## Implementation Examples

### Basic Usage
```javascript
import sessionsAPI from './api/openclaw-sessions'

// Get all sessions
const sessions = await sessionsAPI.getSessions()

// Kill a session  
await sessionsAPI.killSession('session-id', 'Manual stop')

// Respawn failed session
await sessionsAPI.respawnSession('session-id', { 
  newTokenLimit: 75000 
})
```

### React Hook Usage
```javascript
import { useAgentMonitoring } from './api/openclaw-sessions'

function AgentDashboard() {
  const { 
    agents, 
    loading, 
    error, 
    refresh, 
    actions 
  } = useAgentMonitoring({
    pollingInterval: 10000,
    useWebSocket: true
  })

  const handleKill = async (agentId) => {
    await actions.kill(agentId, 'User requested stop')
    // Component will auto-refresh
  }
  
  return (
    <div>
      {agents.map(agent => (
        <AgentCard 
          key={agent.id} 
          agent={agent} 
          onKill={handleKill}
        />
      ))}
    </div>
  )
}
```

This API documentation provides everything needed to integrate the agent monitoring dashboard with OpenClaw's session management system.