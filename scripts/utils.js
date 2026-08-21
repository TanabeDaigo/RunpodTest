/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Utility Functions                                ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   ユーティリティ関数を提供するモジュール                      ║
 * ║   共通のヘルパー関数を管理                                    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルは共通のユーティリティ関数を提供します。
 * 主な機能：
 * - コマンド実行のラッパー関数
 * - エラーハンドリング
 * - ログ出力
 *
 * @file utils.js
 * @module scripts/utils
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * コマンドを実行する関数
 * @param {string} command - 実行するコマンド
 * @param {string} errorMessage - エラーメッセージ
 * @returns {Promise<void>}
 */
export async function runCommand(command, errorMessage) {
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) {
      console.error(stderr);
    }
    if (stdout) {
      console.log(stdout);
    }
  } catch (error) {
    console.error(errorMessage, error);
    throw error;
  }
}
