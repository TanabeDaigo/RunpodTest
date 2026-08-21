/**
 *
 * KronoMetro
 *
 * Copyright © 2024-present KronoMetro, Co. All rights reserved.
 *
 */
import "reflect-metadata";
import "server-only";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "../auth/[...nextauth]/route";
import { pascalCase } from "tiny-case";
import { logjs } from "@lib/server";

// コントローラーを直接インポート（development環境用）
import * as controllers from "../../../server/index.js";

const log = new logjs("api/[name]/route");

function getControllerName(req) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];
  return pascalCase(lastSegment) + "Controller";
}

async function handleRequest(req) {
  log.debug(`handleRequest ----------- `);

  try {
    // コントローラー名を取得
    let name = getControllerName(req);
    log.debug(`getControllerName :${name}`);

    // セッション情報を取得
    const session = await auth();
    log.debug(`session:`, session);
    if (!session) {
      log.error("Unauthorized - No session found");
      // 401エラーの代わりに、ログイン画面へのリダイレクト情報を含むレスポンスを返す
      return NextResponse.json(
        {
          error: "Unauthorized",
          redirect: "/login",
          message: "セッションが無効です。ログイン画面に遷移します。",
        },
        { status: 401 }
      );
    }
    req.session = session; // リクエストオブジェクトにセッション情報を設定

    // DBコネクションを取得
    let dbjs;
    try {
      dbjs = globalThis.container.resolve("dbjs"); // DIコンテナからDBコネクションを取得
      log.debug("DB connection resolved successfully");
    } catch (dbError) {
      log.error("Failed to resolve DB connection:", dbError);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }

    try {
      let controller;

      // 環境に応じてコントローラーの取得方法を切り替え
      if (process.env.NODE_ENV === "development") {
        // development環境: 毎回newしてインスタンスを作成
        log.debug("Development mode: Creating new controller instance");

        // コントローラークラスを取得
        const ControllerClass = controllers[name];
        if (!ControllerClass) {
          log.error(`Controller not found: ${name}`);
          log.error("Available controllers:", Object.keys(controllers));
          return NextResponse.json({ error: "Controller not found" }, { status: 404 });
        }

        log.debug("毎回新しいインスタンスを作成");
        controller = new ControllerClass();
        log.debug(`Executing controller: ${name} (new instance)`);
      } else {
        // production/staging環境: DIコンテナから取得
        log.debug("Production/Staging mode: Using DI container");

        // DIコンテナの状態確認
        log.debug("DIコンテナの状態確認", {
          hasGlobalContainer: !!globalThis.container,
          containerType: typeof globalThis.container,
          isRegistered: globalThis.container ? globalThis.container.isRegistered(name) : false,
        });

        // コントローラーの存在確認
        if (!globalThis.container.isRegistered(name)) {
          log.error(`Controller not found: ${name}`);
          log.error("Available controllers:", globalThis.container.getAllRegisteredNames());
          return NextResponse.json({ error: "Controller not found" }, { status: 404 });
        }

        controller = globalThis.container.resolve(name);
        log.debug(`Executing controller: ${name} (DI container)`);
      }

      if (!controller || typeof controller.execute !== "function") {
        log.error(`Invalid controller: ${name}`, {
          controller: controller,
          hasExecute: controller && typeof controller.execute === "function",
        });
        return NextResponse.json({ error: "Invalid controller" }, { status: 500 });
      }

      const result = await controller.execute(req, dbjs); // リクエストを実行
      //g.debug(`Controller execution completed: ${name}`, result);

      return NextResponse.json(result, { status: 200 }); // 結果を返却
    } catch (e) {
      log.error(`Controller execution error for ${name}:`, e);
      log.error("Error details:", {
        message: e.message,
        stack: e.stack,
        name: e.name,
        controller: name,
      });
      if (dbjs && typeof dbjs.close === "function") {
        //await dbjs.close();
      }
      return NextResponse.json(
        {
          error: e.message,
          controller: name,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      ); // エラーレスポンスを返却
    }
  } catch (e) {
    log.error("handleRequest error:", e);
    log.error("Error details:", {
      message: e.message,
      stack: e.stack,
      name: e.name,
    });
    return NextResponse.json(
      {
        error: e.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export const POST = handleRequest;
export const GET = handleRequest;
export const runtime = "nodejs"; // Node.jsランタイムを明示的に指定（SafieLogicでfs/promises等を使用するため）
