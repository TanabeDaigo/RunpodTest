/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Cache Cleanup Utility                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A utility script for clearing package manager caches        ║
 * ║   and temporary files to resolve dependency issues            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file clear-cache.js
 * @description パッケージマネージャーのキャッシュをクリアするユーティリティスクリプト
 *
 * 主な機能:
 * - pnpmストアのキャッシュクリア
 * - コマンド実行のエラーハンドリング
 * - 詳細なログ出力
 * - コマンドラインからの実行サポート
 *
 * @example
 * // コマンドラインからの実行
 * node clear-cache.js
 *
 * // モジュールとしての使用
 * import clearCache from './clear-cache.js';
 * clearCache();
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import { execSync } from "child_process";
import process from "process";
import { fileURLToPath } from "url";
import logjs from "@krono-metro/metrojs/logjs";

/**
 * パッケージマネージャーのキャッシュをクリアする関数
 * @description 定義されたコマンドを順次実行し、キャッシュをクリアします
 * @example
 * // キャッシュのクリアを実行
 * clearCache();
 * // 出力例:
 * // Running pnpm store prune...
 * // Successfully completed pnpm store prune
 * // Successfully cleared all caches
 */
function clearCache() {
  const logger = new logjs("clear-cache");

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("                                                               ");
  console.log("   キャッシュクリア処理を開始します                    ");
  console.log("                                                               ");
  console.log("═══════════════════════════════════════════════════════════════");
  logger.info("packages/metrojs/src/scripts/clear-cache.js");
  //const commands = [{ cmd: "pnpm store prune --force", name: "pnpm store prune" }];
  const commands = [{ cmd: "pnpm store prune", name: "pnpm store prune" }];

  let hasError = false;

  // 各コマンドを順次実行
  for (const { cmd, name } of commands) {
    try {
      console.log(`Running ${name}...`);
      execSync(cmd, { stdio: "inherit" });
      console.log(`Successfully completed ${name}`);
    } catch (error) {
      logger.error(`Error during ${name}:`, error.message);
      hasError = true;
    }
  }

  // エラーの有無に応じて終了処理
  if (hasError) {
    logger.error("Some cache clearing operations failed");
    process.exit(1);
  } else {
    logger.info("Successfully cleared all caches");
  }
}

// コマンドラインから実行された場合
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  clearCache();
}

export default clearCache;
