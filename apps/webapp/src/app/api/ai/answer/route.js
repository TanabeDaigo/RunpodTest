/**
 * STEP21 API② 回答生成
 * POST /api/ai/answer
 */
import "server-only";
import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { logjs } from "@lib/server";
import { runStep21Answer } from "../../../../server/ask/step21.js";

const log = new logjs("api/ai/answer");

export async function POST(req) {
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
      return NextResponse.json(
        { success: false, error: "JSON ボディが必要です" },
        { status: 400 },
      );
    }

    const result = await runStep21Answer(body);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    log.error("POST /api/ai/answer error", err);
    return NextResponse.json(
      { success: false, error: err.message || String(err) },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
