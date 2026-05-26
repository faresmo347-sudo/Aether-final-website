/**
 * Dev Server Keepalive
 * 
 * Ensures the Next.js dev server stays running at all times.
 * Monitors port 3000 and automatically restarts if it goes down.
 * 
 * Run: bun --hot index.ts (in this directory)
 */

const PORT = 3000
const CHECK_INTERVAL = 5000 // Check every 5 seconds
const RESTART_COOLDOWN = 10000 // Wait 10s between restart attempts
const MAX_RESTARTS_PER_MINUTE = 6

let lastRestartTime = 0
let restartCount = 0
let restartCountResetTime = Date.now()
let currentServerProc: ReturnType<typeof Bun.spawn> | null = null

async function isServerRunning(): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:${PORT}`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000),
    })
    return response.status === 200 || response.status === 304
  } catch {
    return false
  }
}

async function startServer(): Promise<void> {
  const now = Date.now()
  
  // Reset restart counter every minute
  if (now - restartCountResetTime > 60000) {
    restartCount = 0
    restartCountResetTime = now
  }
  
  // Rate limit restarts
  if (restartCount >= MAX_RESTARTS_PER_MINUTE) {
    console.log(`[keepalive] Rate limited: ${restartCount} restarts in the last minute. Waiting...`)
    return
  }
  
  // Cooldown between restarts
  if (now - lastRestartTime < RESTART_COOLDOWN) {
    return
  }
  
  console.log(`[keepalive] Starting Next.js dev server on port ${PORT}...`)
  lastRestartTime = now
  restartCount++
  
  // Kill existing process if any
  if (currentServerProc) {
    try {
      currentServerProc.kill()
    } catch {}
  }
  
  // Use Bun.spawn to start the server as a subprocess
  currentServerProc = Bun.spawn([
    'npx',
    'next',
    'dev',
    '-p',
    String(PORT),
  ], {
    cwd: '/home/z/my-project',
    stdout: 'pipe',
    stderr: 'pipe',
  })
  
  console.log(`[keepalive] Dev server started with PID ${currentServerProc.pid}`)
}

async function monitor() {
  console.log(`[keepalive] Starting monitor for port ${PORT}...`)
  console.log(`[keepalive] Checking every ${CHECK_INTERVAL / 1000}s`)
  
  // Do an initial start
  const running = await isServerRunning()
  if (!running) {
    console.log(`[keepalive] Server not running on startup. Starting...`)
    await startServer()
    // Wait for server to initialize
    await new Promise(resolve => setTimeout(resolve, 10000))
  } else {
    console.log(`[keepalive] Server already running on port ${PORT}`)
  }
  
  while (true) {
    try {
      const running = await isServerRunning()
      const timestamp = new Date().toISOString().slice(11, 19)
      
      if (running) {
        // Server is healthy - just log occasionally
        if (Math.random() < 0.02) { // ~every 4 minutes at 5s intervals
          console.log(`[keepalive] ${timestamp} Server healthy on port ${PORT}`)
        }
      } else {
        console.log(`[keepalive] ${timestamp} Server NOT responding on port ${PORT}! Attempting restart...`)
        await startServer()
        
        // Wait a bit longer after restart attempt
        await new Promise(resolve => setTimeout(resolve, 15000))
      }
    } catch (err) {
      console.error(`[keepalive] Monitor error:`, err)
    }
    
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL))
  }
}

// Start monitoring
monitor().catch(console.error)
