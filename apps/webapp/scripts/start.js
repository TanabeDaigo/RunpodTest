/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Start Script                                     ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   アプリケーションを起動するスクリプト                        ║
 * ║   サーバー起動モジュール                                      ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはアプリケーションの起動を管理します。
 * 主な機能：
 * - 環境に応じたサーバー起動
 * - 環境変数の設定
 * - エラーハンドリング
 * - プロセス管理
 *
 * @file start.js
 * @module scripts/start
 */

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import dotenv from "dotenv";
import logjs from "@krono-metro/metrojs/logjs";
import { spawn } from "child_process";

const log = new logjs("start.js");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // 環境変数を取得
  const isStaging = process.argv[2] === "staging";
  log.info(`isStaging: ${isStaging}`);

  // プロジェクトのルートディレクトリを取得
  const projectRoot = resolve(__dirname, "../../../");
  log.info(`projectRoot: ${projectRoot}`);

  // 環境変数ファイルのパスを設定
  const envFileName = isStaging ? ".env.staging" : ".env.production";
  const envPath = resolve(projectRoot, "env", envFileName);
  log.info(`envPath: ${envPath}`);

  // 環境変数ファイルの存在確認
  try {
    dotenv.config({ path: envPath });
    log.info("環境変数ファイルを読み込みました");
  } catch (error) {
    log.error(`環境変数ファイルの読み込みに失敗しました: ${envPath}`, error);
    process.exit(1);
  }

  // 環境変数を設定
  const env = {
    ...process.env,
    NODE_ENV: "production",
    NEXT_PUBLIC_NODE_ENV: "production",
    PORT: process.env.PORT || 3000,
    NEXT_TELEMETRY_DISABLED: "1",
    IS_STAGING: isStaging ? "true" : "false",
    LOG_LEVEL: "info",
    NODE_OPTIONS: "--trace-warnings",
  };

  // 環境変数の確認
  log.info("環境変数の設定:");
  log.info(`NODE_ENV: ${env.NODE_ENV}`);
  log.info(`PORT: ${env.PORT}`);
  log.info(`IS_STAGING: ${env.IS_STAGING}`);

  // Next.jsサーバーを起動
  log.info("サーバーを起動します...");
  const nextProcess = spawn("pnpm", ["exec", "next", "start"], {
    stdio: "inherit",
    cwd: resolve(__dirname, ".."),
    env: env,
    shell: true,
  });

  nextProcess.on("error", (err) => {
    log.error("サーバーの起動に失敗しました:", err);
    process.exit(1);
  });

  nextProcess.on("exit", (code) => {
    if (code !== 0) {
      log.error(`サーバーが終了しました。終了コード: ${code}`);
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
  log.error("start.js エラー:", error);
  process.exit(1);
}
