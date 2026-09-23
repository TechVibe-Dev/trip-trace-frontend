#!/usr/bin/env bash
set -euo pipefail

log() {
    echo "[start_dev.sh] $1"
}

ensure_env_file() {
    if [ ! -f ".env" ]; then
        log "No .env found, copying from .env.default"
        cp .env.default .env
    fi
}

install_dependencies_if_missing() {
    if [ ! -d "node_modules" ]; then
        log "node_modules not found, running npm install"
        npm install
    else
        log "node_modules already exists, skipping install"
    fi
}

run_dev_server() {
    log "Starting Vite dev server"
    npm run dev
}

main() {
    ensure_env_file
    install_dependencies_if_missing
    run_dev_server
}

main
