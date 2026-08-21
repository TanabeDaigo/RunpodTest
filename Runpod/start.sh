#!/bin/bash
set -euo pipefail

echo "[start] Runpod Ollama worker boot"

# Network Volume があれば必ずそこへ（コンテナ disk 不足を避ける）
if [ -d /runpod-volume ]; then
  mkdir -p /runpod-volume/ollama
  export OLLAMA_MODELS=/runpod-volume/ollama
  # 旧パスへの誤書き込みを防ぐ
  mkdir -p /root
  rm -rf /root/.ollama
  ln -sfn /runpod-volume/ollama /root/.ollama
  echo "[start] Using Network Volume for models"
else
  echo "[start] WARNING: /runpod-volume not found — models go to container disk (often too small for 14B)"
  echo "[start] Attach a Network Volume to this Endpoint, or increase Container Disk to 50GB+"
fi

export OLLAMA_HOST="${OLLAMA_HOST:-0.0.0.0:11434}"
MODEL="${OLLAMA_MODEL:-llama3.2:1b}"
# 既定は起動時 pull しない（1b と 14b を二重に取って disk を潰さない）
BOOT_PULL="${OLLAMA_BOOT_PULL:-0}"

echo "[start] OLLAMA_MODELS=${OLLAMA_MODELS:-/root/.ollama}"
echo "[start] OLLAMA_MODEL=${MODEL}  OLLAMA_BOOT_PULL=${BOOT_PULL}"
df -h / /root /runpod-volume 2>/dev/null || df -h

echo "[start] starting ollama serve..."
ollama serve >/tmp/ollama-serve.log 2>&1 &
OLLAMA_PID=$!

echo "[start] waiting for Ollama API..."
READY=0
for i in $(seq 1 90); do
  if curl -sf "http://127.0.0.1:11434/api/tags" >/dev/null; then
    READY=1
    break
  fi
  sleep 1
done

if [ "$READY" -ne 1 ]; then
  echo "[start] Ollama failed to become ready"
  tail -n 50 /tmp/ollama-serve.log || true
  exit 1
fi
echo "[start] Ollama ready (pid=${OLLAMA_PID})"

if [ "${BOOT_PULL}" = "1" ]; then
  if ! ollama list 2>/dev/null | awk '{print $1}' | grep -qx "${MODEL}"; then
    echo "[start] boot pull: ${MODEL}"
    ollama pull "${MODEL}"
  else
    echo "[start] model already present: ${MODEL}"
  fi
else
  echo "[start] skip boot pull (models pulled on first generate request)"
fi

echo "[start] launching handler"
exec /opt/venv/bin/python -u /app/handler.py
