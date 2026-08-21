/**
 * GPU 疎通確認
 * POST /api/ai/hello
 *
 * → AiGatewayClient.hello()
 *   - RUNPOD_* 設定あり: RunPod /runsync
 *   - AI_GATEWAY_BASE_URL: HTTP stub
 *   - 未設定: in-process
 */
import "server-only";
import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { logjs } from "@lib/server";
import {
  createAiGatewayClient,
  resolveAiGatewayMode,
} from "../../../../server/ask/AiGatewayClient.js";

const log = new logjs("api/ai/hello");

function gatewayTarget() {
  const mode = resolveAiGatewayMode();
  if (mode === "runpod") {
    const id = String(process.env.RUNPOD_ENDPOINT_ID || "").trim();
    return {
      mode,
      baseUrl: id ? `https://api.runpod.ai/v2/${id}/runsync` : null,
      endpointId: id || null,
    };
  }
  if (mode === "http") {
    return {
      mode,
      baseUrl: String(process.env.AI_GATEWAY_BASE_URL || "").replace(/\/$/, "") || null,
      endpointId: null,
    };
  }
  return { mode: "in-process", baseUrl: null, endpointId: null };
}

export async function POST(req) {
  const started = Date.now();
  const target = gatewayTarget();
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

    const ai = createAiGatewayClient();
    const result = await ai.hello({
      message: body.message || "Hello World",
      tenantId: body.tenantId,
    });

    if (!result?.ok) {
      return NextResponse.json(
        {
          success: false,
          error: result?.error || "hello に失敗しました",
          mode: target.mode,
          baseUrl: target.baseUrl,
          endpointId: target.endpointId,
          durationMs: Date.now() - started,
          gateway: result,
        },
        { status: 200 },
      );
    }

    return NextResponse.json({
      success: true,
      mode: target.mode,
      baseUrl: target.baseUrl,
      endpointId: target.endpointId,
      message: result.data?.message || "Hello World",
      data: result.data,
      requestId: result.requestId,
      gatewayDurationMs: result.durationMs,
      durationMs: Date.now() - started,
    });
  } catch (err) {
    log.error("POST /api/ai/hello error", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || String(err),
        mode: target.mode,
        baseUrl: target.baseUrl,
        endpointId: target.endpointId,
        durationMs: Date.now() - started,
      },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
