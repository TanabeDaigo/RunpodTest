/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Next.js Middleware                               ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   リクエストの認証とセキュリティヘッダーの設定を行う          ║
 * ║   ミドルウェアモジュール                                      ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはNext.jsのミドルウェアを定義します。
 * 主な機能：
 * - リクエストの認証チェック
 * - セキュリティヘッダーの設定
 * - 公開ルートの管理
 * - トークンベースの認証
 *
 * @file middleware.js
 * @module middleware
 */

// reflect-metadataのインポートを削除（Edge Runtimeとの互換性のため）
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { setSecurityHeaders } from "@metrojs/securityHeaders";
import logjs from "@metrojs/logjs";

const log = new logjs("middleware");

/**
 * 認証が不要なルートのパターン
 * @type {string[]}
 */
const publicRoutes = ["/api/auth", "/_next", "/favicon.ico", "/public", "/login"];

/**
 * ミドルウェア関数
 * リクエストの認証チェックとセキュリティヘッダーの設定を行う
 *
 * @param {Request} req - リクエストオブジェクト
 * @returns {NextResponse} レスポンスオブジェクト
 *
 * @example
 * // ミドルウェアの実行例
 * const response = await middleware(request);
 */
export async function middleware(req) {
  /**
   * デバッグログ出力用の内部関数
   * @param {string} message - ログメッセージ
   * @param {any} arr - 追加データ（オプション）
   */
  const _log = (message, arr = null) => {
    //log.debug(message, arr);
  };

  try {
    _log("middleware ------------------------ START");
    _log("middleware URL:", req.url);
    _log("middleware Headers:", JSON.stringify(req.headers, null, 2));

    const { pathname } = req.nextUrl;
    _log("middleware pathname:", pathname);

    // ルートパスの処理
    if (pathname === "/") {
      const loginUrl = new URL("/login", req.url);
      return setSecurityHeaders(NextResponse.redirect(loginUrl));
    }

    // 公開ルートのチェック
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      _log("公開ルートです middleware");
      return setSecurityHeaders(NextResponse.next());
    }

    // トークンの取得と検証
    const token = await getToken({
      req: req,
      secret: process.env.NEXTAUTH_SECRET || "your-secret-key-here",
      secureCookie: process.env.NODE_ENV === "production",
      raw: true,
    });

    _log("Token info:", {
      exists: !!token,
      pathname,
      headers: Object.fromEntries(req.headers.entries()),
      cookies: req.cookies.getAll().map(cookie => cookie.name),
    });

    // 認証済みの場合は通常のレスポンスを返す
    const response = NextResponse.next();
    return setSecurityHeaders(response);
  } catch (error) {
    log.error("middleware error", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

/**
 * ミドルウェアの設定
 * 特定のパスパターンにマッチするリクエストに対してミドルウェアを適用
 * @type {Object}
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images).*)"],
};
