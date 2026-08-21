/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Server Module Index                              ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A collection of server-side utilities and database         ║
 * ║   management tools for the MetroJS framework                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file index.js
 * @description MetroJSのサーバーサイドモジュールを集約するエントリーポイント
 *
 * エクスポートされる機能:
 * - dbjs: データベース操作のための高レベルAPI
 * - sqljs: SQLクエリビルダーとデータベース操作ユーティリティ
 *
 * @example
 * // モジュールのインポート
 * import { dbjs, sqljs } from '@krono-metro/metrojs/server';
 *
 * // データベース操作の例
 * const db = new dbjs(config);
 * await db.connect();
 *
 * // SQLクエリの実行
 * const sql = new sqljs();
 * const query = sql.select('users').where('id', 1);
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import dbjs from "./dbjs.js";
import sqljs from "./sqljs.js";
import { MailService, S3Service, OllamaService, QdrantService, PdfService, ChunkService }  from "./service/index.js"
import { Compress } from "./logic/index.js";

const service = {
    MailService,
    S3Service,
    OllamaService,
    QdrantService,
    PdfService,
    ChunkService,
  };

const logic = {
    Compress,
}

export { dbjs, sqljs, service, logic, };
