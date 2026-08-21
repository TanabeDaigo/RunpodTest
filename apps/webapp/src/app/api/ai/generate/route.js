/**
 * 軽量 LLM 生成テスト（RunPod Ollama 向け）
 * POST /api/ai/generate
 *
 * { prompt?, messages?, model? }
 * → AiGatewayClient.generate()（RUNPOD_OPS に generate があれば RunPod）
 */
import "server-only";
import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { logjs } from "@lib/server";
import {
  createAiGatewayClient,
  resolveAiGatewayMode,
  usesRunpodFor,
} from "../../../../server/ask/AiGatewayClient.js";

const log = new logjs("api/ai/generate");

export async function POST(req) {
  const started = Date.now();
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          redirect: "/login",
          message: "セッションが無効です。ログイン画面に遷移します。",
        },
        { status: 401 },
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const prompt =
      String(body.prompt || body.question || "").trim() ||
      "富士山の高さは？短く日本語で答えて。";
    const model =
      String(body.model || process.env.RUNPOD_OLLAMA_MODEL || "llama3.2:1b").trim() ||
      "llama3.2:1b";

    const messages = Array.isArray(body.messages)
      ? body.messages
      : [
          {
            role: "system",
            content: "短い日本語のみで答えてください。絵文字は使わないでください。",
          },
          { role: "user", content: prompt },
        ];

    const ai = createAiGatewayClient();
    const viaRunpod = usesRunpodFor("generate");
    const mode = viaRunpod ? "runpod" : resolveAiGatewayMode();

    const result = await ai.generate({
      model,
      messages,
      options: body.options,
      tenantId: body.tenantId,
    });

    if (!result?.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result?.error || "generate に失敗しました",
          mode,
          viaRunpod,
          model,
          durationMs: Date.now() - started,
          gateway: result,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      success: true,
      mode,
      viaRunpod,
      model: result.data?.model || model,
      answer: result.data?.answer || result.data?.message || "",
      data: result.data,
      requestId: result.requestId,
      gatewayDurationMs: result.durationMs,
      durationMs: Date.now() - started,
      endpointId: viaRunpod
        ? String(process.env.RUNPOD_ENDPOINT_ID || "").trim() || null
        : null,
      note: viaRunpod
        ? "RunPod Ollama 経由（初回はモデル pull で数分かかることがあります）"
        : "ローカル / stub 経由",
    });
  } catch (err) {
    log.error("POST /api/ai/generate error", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || String(err),
        durationMs: Date.now() - started,
      },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
// 初回 pull + 生成で長時間かかる可能性
export const maxDuration = 600;
