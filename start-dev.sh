#!/bin/bash
# Keep-alive launcher for Next.js dev server
cd /home/z/my-project

# Kill any existing server
pkill -f "next dev" 2>/dev/null
sleep 1

# Start the server in background
node node_modules/.bin/next dev -p 3000 &
SERVER_PID=$!

# Keep-alive loop: ping the server every 10 seconds
while true; do
  sleep 10
  if ! ps -p $SERVER_PID > /dev/null 2>&1; then
    echo "$(date): Server died, restarting..." >> /tmp/next-keepalive.log
    node node_modules/.bin/next dev -p 3000 &
    SERVER_PID=$!
    sleep 5
  fi
  # Ping to keep alive
  curl -s -o /dev/null http://localhost:3000/ 2>/dev/null
done
