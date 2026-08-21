/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Development Server Script                        ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   Next.js開発サーバーを起動するスクリプト                    ║
 * ║   開発環境設定モジュール                                      ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはNext.js開発サーバーの起動を管理します。
 * 主な機能：
 * - 環境変数の設定
 * - 開発サーバーの起動
 * - エラーハンドリング
 * - プロセス管理
 *
 * @file dev.js
 * @module scripts/dev
 */

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import logjs from "@krono-metro/metrojs/logjs";
import { spawn } from "child_process";

const log = new logjs("dev.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // 環境変数ファイルのパスを設定
  const envPath = resolve(process.cwd(), "../../env/.env.development");

  // 環境変数を読み込む
  dotenv.config({ path: envPath });

  // 環境変数を設定
  const env = {
    ...process.env,
    NODE_ENV: "development",
    NEXT_PUBLIC_NODE_ENV: "development",
    PORT: process.env.PORT || 3000,
    NEXT_TELEMETRY_DISABLED: "1",
  };

  console.log(`envPath:${envPath}`);

  // Next.js開発サーバーを起動（Turbopackとno-lintオプションを追加）
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const nextProcess = spawn(npmCmd, ["exec", "next", "dev", "--turbo", "--no-lint"], {
    stdio: "inherit",
    cwd: resolve(__dirname, ".."),
    env: process.env,
    shell: true,
  });

  nextProcess.on("error", (err) => {
    log.error("開発サーバーの起動に失敗しました:", err);
    process.exit(1);
  });

  nextProcess.on("exit", (code) => {
    if (code !== 0) {
      log.error(`開発サーバーが終了しました。終了コード: ${code}`);
      process.exit(code);
    }
  });

  // シグナルハンドリング
  const handleSignal = (signal) => {
    log.info(`${signal} を受信しました。シャットダウン中...`);
    nextProcess.kill(signal);
  };

  process.on("SIGINT", () => handleSignal("SIGINT"));
  process.on("SIGTERM", () => handleSignal("SIGTERM"));
} catch (error) {
  log.error("dev.js エラー:", error);
  process.exit(1);
}
