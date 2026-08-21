/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Configuration Script                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   環境設定を管理するスクリプト                               ║
 * ║   設定管理モジュール                                          ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルは環境設定を管理します。
 * 主な機能：
 * - 環境変数ファイルのパス設定
 * - 環境変数の設定
 * - 環境別の設定管理
 *
 * @file config.js
 * @module scripts/config
 */

import { join } from "path";
import { fileURLToPath } from "url";

/**
 * ディレクトリパスの設定
 * スクリプトの実行ディレクトリとルートディレクトリを設定
 */
const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "../");

/**
 * 環境設定オブジェクト
 * 各環境（開発、ステージング、本番）の設定を定義
 */
const config = {
  env: {
    development: join(rootDir, "../../env/.env.development"),
    staging: join(rootDir, "../../env/.env.staging"),
    production: join(rootDir, "../../env/.env.production"),
  },
  envVars: {
    development: "cross-env ANALYZE=false IS_STAGING=false",
    staging: "cross-env ANALYZE=false IS_STAGING=true",
    production: "cross-env ANALYZE=false IS_STAGING=false",
  },
};

export default config;
