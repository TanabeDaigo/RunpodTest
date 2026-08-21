/**
 * Next.jsアプリケーションのビルドスクリプト
 *
 * 使用例:
 * ```
 * # 開発環境用ビルド
 * node build.js development
 *
 * # 本番環境用ビルド
 * node build.js production
 *
 * # ステージング環境用ビルド
 * node build.js production staging
 * ```
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// ESモジュールでの __filename, __dirname の代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// コマンドライン引数から環境とステージングフラグを取得
const env = process.argv[2] || "development";
const isStaging = process.argv[3] === "staging";

// 環境変数ファイルのパスを解決
const envFile = path.resolve(__dirname, `../../env/.env.${env}`);

// Next.jsのビルドプロセスを開始
const build = spawn("next", ["build"], {
  stdio: "inherit", // 子プロセスの標準入出力を親プロセスに継承
  env: {
    ...process.env,
    NODE_ENV: env,
    ANALYZE: "false",
    IS_STAGING: isStaging ? "true" : "false",
  },
  shell: true,
});

// ビルドエラー時のハンドリング
build.on("error", (err) => {
  console.error("Failed to build application:", err);
  process.exit(1);
});
