/**
 * サーバーサイドで使用するモジュールをエクスポートするメインファイル
 *
 * @module server
 * @exports {Object} config - 設定関連のモジュール群
 * @exports {Object} logjs - ロギング用のユーティリティクラス
 * @exports {Object} dbjs - データベース操作用のユーティリティクラス
 */

import config from "../config/config.js";
import { Consts } from "../config/index.js";

import { schema as db_schema } from "./db/schema/db_schema.js";

import * as commonUtils from "../utils/index.js";
import metroUtils from "@krono-metro/metrojs/utils";

// ユーティリティ関数のマージ
/** @type {Record<string, any>} */
const utils = {
  // 共通ユーティリティ
  ...commonUtils,
  // MetroJSユーティリティ（共通ユーティリティを上書き）
  ...metroUtils,
};

import models from "./db/models.js";

// ローカルのモジュールをエクスポート
export { config, utils, db_schema, models, Consts };

// 既存のエクスポートに追加
export { default as AbstractObject } from "./AbstractObject.js";
export { default as ActivityLogsService } from "./service/ActivityLogsService.js";
