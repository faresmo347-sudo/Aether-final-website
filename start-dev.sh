#!/bin/bash
# Keep-alive wrapper for Next.js dev server
# Restarts the server automatically if it crashes

cd /home/z/my-project

MAX_RESTARTS=10
RESTART_COUNT=0
RESTART_WINDOW=60  # seconds
FIRST_RESTART_TIME=0

while true; do
  echo "=== Starting dev server at $(date) ==="
  
  # Start the dev server
  npx next dev -p 3000 2>&1 | tee -a /home/z/my-project/dev.log &
  SERVER_PID=$!
  
  echo "Dev server PID: $SERVER_PID"
  
  # Wait for the server to exit
  wait $SERVER_PID
  EXIT_CODE=$?
  
  echo "=== Dev server exited with code $EXIT_CODE at $(date) ==="
  
  # Rate limiting
  NOW=$(date +%s)
  if [ $RESTART_COUNT -eq 0 ]; then
    FIRST_RESTART_TIME=$NOW
  fi
  
  RESTART_COUNT=$((RESTART_COUNT + 1))
  
  # Reset counter if outside the window
  if [ $((NOW - FIRST_RESTART_TIME)) -gt $RESTART_WINDOW ]; then
    RESTART_COUNT=1
    FIRST_RESTART_TIME=$NOW
  fi
  
  if [ $RESTART_COUNT -ge $MAX_RESTARTS ]; then
    echo "Too many restarts ($RESTART_COUNT) in $RESTART_WINDOW seconds. Waiting 60s..."
    sleep 60
    RESTART_COUNT=0
  fi
  
  # Brief pause before restarting
  sleep 3
done
