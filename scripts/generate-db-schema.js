/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - DB Schema Generator                              ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   データベーススキーマを生成するスクリプト                    ║
 * ║   環境に応じたDBスキーマの自動生成モジュール                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはデータベーススキーマの生成を管理します。
 * 主な機能：
 * - 環境（staging/prod）に応じたDBスキーマの生成
 * - 適切な環境変数ファイルの使用
 * - ディレクトリの自動切り替え
 * - エラーハンドリング
 *
 * @file generate-db-schema.js
 * @module scripts/generate-db-schema
 */

import path from "path";
import { fileURLToPath } from "url";
import { runCommand } from "./utils.js";

// ES Modules用の__dirname相当の設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateDBSchema(env = "staging") {
  console.log(`${env}環境のDB生成を開始します...`);
  const commonPath = path.join(process.cwd(), "packages", "common");

  // 現在のディレクトリを保存
  const originalDir = process.cwd();

  try {
    // ディレクトリを変更
    process.chdir(commonPath);
    console.log(`現在のディレクトリ: ${process.cwd()}`);

    // DB生成スクリプトの実行
    await runCommand(`node -r dotenv/config ./scripts/generate_db.js dotenv_config_path=../../env/.env.${env}`, "DB生成中にエラーが発生しました");
  } finally {
    // 元のディレクトリに戻る
    process.chdir(originalDir);
    console.log(`元のディレクトリに戻りました: ${process.cwd()}`);
  }
}

// スクリプトが直接実行された場合
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = process.argv[2] || "staging";
  generateDBSchema(env).catch(console.error);
}

export default generateDBSchema;
