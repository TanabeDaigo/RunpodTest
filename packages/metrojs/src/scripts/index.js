/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Scripts Module Index                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A collection of utility scripts for development and        ║
 * ║   maintenance tasks in the MetroJS framework                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file index.js
 * @description MetroJSのユーティリティスクリプトを集約するモジュール
 *
 * エクスポートされる機能:
 * - clean: ビルド成果物の削除
 * - clearCache: パッケージマネージャーのキャッシュクリア
 * - generateDbSchema: データベーススキーマの生成
 *
 * @example
 * // モジュールのインポート
 * import { clean, clearCache, generateDbSchema } from '@krono-metro/metrojs/scripts';
 *
 * // 各機能の使用
 * await clean(['dist', 'build']);
 * await clearCache();
 * await generateDbSchema(dbConfig);
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import clean from "./clean.js";
import clearCache from "./clear-cache.js";
import { generateDbSchema } from "./generate_db_schema.js";

export { clean, clearCache, generateDbSchema };
