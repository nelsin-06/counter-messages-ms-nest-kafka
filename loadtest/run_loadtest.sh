#!/usr/bin/env bash
set -euo pipefail

# Fallback message on error
trap 'echo "[loadtest] Ocurrió un error. Intenta manual con el comando: docker compose up --build (en la carpeta loadtest)" >&2' ERR

# Run loadtest compose stack
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "[loadtest] Building and starting load test stack..."
if command -v docker-compose >/dev/null 2>&1; then
  docker-compose up --build
else
  docker compose up --build
fi
