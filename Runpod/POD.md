# MetroAI — RunPod Pod（常駐）開発ガイド
#
# ブランチ: MetroAI
# 方針: ローカル MetroJS（画面） → Pod（Ollama + Node HTTP API）
# 実装: **Node.js**（MetroJS / ai-gateway-stub と同系統）
# Serverless（/runsync）は使わない

## 構成

```
ローカル PC                         RunPod Pod
MetroJS Step21                      Ollama + Node.js gateway
  /api/ai/hello|generate              POST /v1/hello
       │                              POST /v1/generate
       │ AI_GATEWAY_BASE_URL          GET  /health
       └─────────────────────────────► :3100
```

レスポンス形は metrojs `ai-gateway` と同じ:

```json
{ "ok": true, "requestId": "...", "durationMs": 0, "usage": null, "data": { ... } }
```

このフォルダ（Node.js）:
- `server.mjs` … HTTP Gateway（依存パッケージなし・Node 18+）
- `package.json` … `"type": "module"`
- `start.sh` … Ollama 起動 + `node server.mjs`
- `Dockerfile` … カスタムイメージ用（任意）

Serverless 用（旧・Python）は親の `Runpod/handler.py` など。

---

## Pod の作成手順（コンソール）

### A. まずは SSH で手早く（推奨・開発向け）

1. [Pods](https://www.console.runpod.io/pods) → **Deploy**
2. GPU を選ぶ
   - 疎通 / `llama3.2:1b`: **16GB** で可
   - 8B〜14B: **24GB（4090 など）**
3. Template
   - 手早い: **RunPod Pytorch** や CUDA 入りの公式テンプレ
   - または後述のカスタム Docker
4. **Container Disk**: 20GB 以上（モデル用。Volume 無しなら 50GB+）
5. **Expose HTTP Ports**: `3100` を公開（Gateway 用）
6. （任意）Network Volume を Deploy 時に選択 → 通常 `/workspace`
7. **Deploy On-Demand**
8. Pod が Running になったら
   - **Connect** → **SSH** または **Web Terminal**
   - **HTTP Service** の URL を控える（`https://xxxxx-3100.proxy.runpod.net` 形式が多い）

### B. SSH 後に入れるもの（手作業・Node）

```bash
# Node 18+（無ければ）
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Ollama（テンプレに無ければ）
curl -fsSL https://ollama.com/install.sh | sh
ollama serve &

# Gateway（このリポの Runpod/pod を clone / scp）
cd ~/metroai-pod   # server.mjs と package.json がある場所
export OLLAMA_MODEL=llama3.2:1b
export PORT=3100
# Volume 利用時
# export OLLAMA_MODELS=/workspace/ollama
node server.mjs
```

疎通:

```bash
curl -s https://<POD_HTTP_3100>/health
curl -s -X POST https://<POD_HTTP_3100>/v1/hello \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello World"}'
```

### C. カスタム Docker で Deploy（慣れたら）

1. `Runpod/pod` を Docker Hub 等に push  
2. Pod 作成時にそのイメージを指定  
3. Port `3100` を公開  
4. `start.sh` が Ollama + Node gateway を起動  

---

## ローカル MetroJS の接続

`env/.env.development`:

```text
# Serverless はオフ（両方あると RUNPOD_* が優先される）
# RUNPOD_API_KEY=
# RUNPOD_ENDPOINT_ID=

AI_GATEWAY_BASE_URL=https://xxxxx-3100.proxy.runpod.net
# AI_GATEWAY_API_KEY=（Pod 側と同じ値を入れた場合）
```

開発サーバ再起動 → Step21:

1. **GPU疎通（Hello）** → `mode: http`
2. **RunPod LLM** → Pod の Ollama で生成

---

## ローカルだけで Gateway を試す

```bash
cd Runpod/pod
node server.mjs
# 別ターミナルで Ollama が 11434 で動いている必要あり（generate 時）
```

hello だけなら Ollama 不要。

---

## 課金・止め方

- Pod **Running 中は GPU 課金が続く**
- 試験が終わったら必ず **Stop**（または Terminate）
- Volume を付けていると Stop 後も容量課金は続く

---

## SSH でよく使う確認

```bash
node -v
ollama list
curl -s localhost:11434/api/tags
curl -s localhost:3100/health
df -h /workspace
```

---

## Serverless との違い

| | Serverless（旧） | Pod（この方式） |
|---|---|---|
| 言語 | Python handler | **Node.js**（MetroJS 系） |
| 入口 | `/runsync` | `/v1/*` HTTP |
| 待ち | IN_QUEUE / Cold start | Pod 起動中は短い |
| 停止 | 自動（Min=0） | **手動 Stop** |
| SSH | ほぼ不可 | **可能** |
