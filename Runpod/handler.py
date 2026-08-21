"""
RunPod Serverless worker: Hello + Ollama generate.

input examples:
  { "op": "hello", "message": "Hello World" }
  {
    "op": "generate",
    "model": "qwen2.5:14b",
    "messages": [{"role":"user","content":"富士山の高さは？短く"}]
  }
"""

from __future__ import annotations

import os
import time
from typing import Any

import requests
import runpod

OLLAMA_BASE = os.environ.get("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
DEFAULT_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2:1b")
PULL_TIMEOUT = float(os.environ.get("OLLAMA_PULL_TIMEOUT_SEC", "1800"))
CHAT_TIMEOUT = float(os.environ.get("OLLAMA_TIMEOUT_SEC", "600"))


def _hello(job_input: dict[str, Any]) -> dict[str, Any]:
    message = str(job_input.get("message") or "Hello World").strip() or "Hello World"
    return {
        "ok": True,
        "op": "hello",
        "message": message,
        "service": "runpod-hello",
        "note": "Hello OK",
    }


def _build_messages(job_input: dict[str, Any]) -> list[dict[str, str]]:
    messages = job_input.get("messages")
    if isinstance(messages, list) and messages:
        out: list[dict[str, str]] = []
        for m in messages:
            if not isinstance(m, dict):
                continue
            role = str(m.get("role") or "user")
            content = str(m.get("content") or "")
            if content:
                out.append({"role": role, "content": content})
        if out:
            return out

    prompt = str(job_input.get("prompt") or job_input.get("question") or "").strip()
    if not prompt:
        raise ValueError("messages または prompt が必要です")

    out = []
    system = str(job_input.get("system") or "").strip()
    if system:
        out.append({"role": "system", "content": system})
    out.append({"role": "user", "content": prompt})
    return out


def _model_present(model: str) -> bool:
    res = requests.get(f"{OLLAMA_BASE}/api/tags", timeout=30)
    res.raise_for_status()
    names = {str(m.get("name") or "") for m in (res.json().get("models") or [])}
    if model in names:
        return True
    # tag 省略や :latest 揺れをある程度許容
    base = model.split(":")[0]
    return any(n == model or n.startswith(base + ":") for n in names if n == model)


def _ensure_model(model: str) -> dict[str, Any]:
    """未取得なら ollama pull（初回のみ時間がかかる）."""
    if _model_present(model):
        return {"pulled": False, "model": model}

    # stream=False で完了まで待つ
    res = requests.post(
        f"{OLLAMA_BASE}/api/pull",
        json={"name": model, "stream": False},
        timeout=PULL_TIMEOUT,
    )
    if res.status_code >= 400:
        raise RuntimeError(f"Ollama pull failed HTTP {res.status_code}: {res.text[:500]}")

    if not _model_present(model):
        # pull 応答は成功でも tags 反映が遅れる場合がある
        time.sleep(1)
    return {"pulled": True, "model": model, "pullBody": res.text[:200]}


def _chat(model: str, messages: list[dict[str, str]], options: dict | None) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "stream": False,
    }
    if options:
        payload["options"] = options

    res = requests.post(
        f"{OLLAMA_BASE}/api/chat",
        json=payload,
        timeout=CHAT_TIMEOUT,
    )
    return res


def _generate(job_input: dict[str, Any]) -> dict[str, Any]:
    model = str(job_input.get("model") or DEFAULT_MODEL).strip() or DEFAULT_MODEL
    messages = _build_messages(job_input)
    options = job_input.get("options") if isinstance(job_input.get("options"), dict) else None
    auto_pull = job_input.get("autoPull")
    if auto_pull is None:
        auto_pull = True

    started = time.time()
    pull_info: dict[str, Any] = {"pulled": False, "model": model}

    res = _chat(model, messages, options)
    if res.status_code == 404 and auto_pull:
        pull_info = _ensure_model(model)
        res = _chat(model, messages, options)

    if res.status_code >= 400:
        raise RuntimeError(f"Ollama HTTP {res.status_code}: {res.text[:500]}")

    data = res.json()
    msg = data.get("message") or {}
    answer = str(msg.get("content") or "")

    note = f"generate OK via Ollama ({model})"
    if pull_info.get("pulled"):
        note += " / model was pulled on demand"

    return {
        "ok": True,
        "op": "generate",
        "answer": answer,
        "message": answer,
        "model": data.get("model") or model,
        "service": "runpod-ollama",
        "pulled": bool(pull_info.get("pulled")),
        "totalDurationMs": int((time.time() - started) * 1000),
        "evalCount": data.get("eval_count"),
        "promptEvalCount": data.get("prompt_eval_count"),
        "note": note,
    }


def handler(job: dict[str, Any]):
    job_input = job.get("input") if isinstance(job, dict) else {}
    if not isinstance(job_input, dict):
        job_input = {}

    op = str(job_input.get("op") or "hello").strip().lower()
    try:
        if op in ("hello", "ping", "health"):
            return _hello(job_input)
        if op in ("generate", "chat", "llm"):
            return _generate(job_input)
        return {
            "ok": False,
            "error": f"unsupported op: {op} (supported: hello, generate)",
            "op": op,
        }
    except Exception as err:  # noqa: BLE001
        return {
            "ok": False,
            "op": op,
            "error": str(err),
            "service": "runpod-ollama",
        }


runpod.serverless.start({"handler": handler})
