#!/bin/bash
set -euo pipefail

echo "[pod] MetroAI Pod gateway boot (Node.js)"

if [ -d /workspace ]; then
  mkdir -p /workspace/ollama
  export OLLAMA_MODELS=/workspace/ollama
  mkdir -p /root
  rm -rf /root/.ollama 2>/dev/null || true
  ln -sfn /workspace/ollama /root/.ollama
  echo "[pod] OLLAMA_MODELS=/workspace/ollama"
elif [ -d /runpod-volume ]; then
  mkdir -p /runpod-volume/ollama
  export OLLAMA_MODELS=/runpod-volume/ollama
  mkdir -p /root
  rm -rf /root/.ollama 2>/dev/null || true
  ln -sfn /runpod-volume/ollama /root/.ollama
  echo "[pod] OLLAMA_MODELS=/runpod-volume/ollama"
else
  echo "[pod] no volume — models on container disk"
fi

export OLLAMA_HOST="${OLLAMA_HOST:-0.0.0.0:11434}"
export OLLAMA_MODEL="${OLLAMA_MODEL:-llama3.2:1b}"
PORT="${PORT:-${AI_GATEWAY_PORT:-3100}}"
BOOT_PULL="${OLLAMA_BOOT_PULL:-0}"
POD_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "[pod] starting ollama serve..."
ollama serve >/tmp/ollama-serve.log 2>&1 &

READY=0
for i in $(seq 1 90); do
  if curl -sf "http://127.0.0.1:11434/api/tags" >/dev/null; then
    READY=1
    break
  fi
  sleep 1
done

if [ "$READY" -ne 1 ]; then
  echo "[pod] Ollama failed to start"
  tail -n 40 /tmp/ollama-serve.log || true
  exit 1
fi
echo "[pod] Ollama ready"

if [ "${BOOT_PULL}" = "1" ]; then
  if ! ollama list 2>/dev/null | awk '{print $1}' | grep -qx "${OLLAMA_MODEL}"; then
    echo "[pod] boot pull ${OLLAMA_MODEL}"
    ollama pull "${OLLAMA_MODEL}"
  fi
fi

cd "${POD_DIR}"
echo "[pod] starting Node gateway on :${PORT}"
export PORT
exec node server.mjs
