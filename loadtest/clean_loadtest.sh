#!/usr/bin/env bash
set -euo pipefail

# Clean up loadtest compose stack (containers, networks, volumes)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[loadtest] Stopping and removing containers, networks, and volumes..."
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose down -v
else
  docker compose down -v
fi

echo "[loadtest] Cleanup complete."
