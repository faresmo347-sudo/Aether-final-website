#!/bin/bash
cd /home/z/my-project
exec >> dev.log 2>&1
while true; do
  echo "=== Starting dev server at $(date) ==="
  npx next dev -p 3000
  EXIT_CODE=$?
  echo "=== Server exited with code $EXIT_CODE, restarting in 3s ==="
  sleep 3
done
