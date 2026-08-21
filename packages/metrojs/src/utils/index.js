/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Utility Module Index                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive collection of utility functions for        ║
 * ║   common programming tasks and data manipulation             ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file index.js
 * @description MetroJSのユーティリティ関数を集約するエントリーポイント
 *
 * エクスポートされるモジュール:
 * - cast: データ型変換ユーティリティ
 * - crypto: 暗号化・ハッシュ関数
 * - datetime: 日付・時刻操作
 * - html: HTML操作・生成
 * - number: 数値操作・計算
 * - string: 文字列操作・フォーマット
 * - system: システム情報・環境
 * - util: 汎用ユーティリティ
 * - valid: データ検証
 *
 * @example
 * // モジュールのインポート
 * import utils from '@krono-metro/metrojs/utils';
 *
 * // 各ユーティリティの使用
 * const formattedDate = utils.formatDate(new Date());
 * const hashedPassword = utils.hashPassword('password123');
 * const isValid = utils.isValidEmail('user@example.com');
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

// Edge Runtimeで使用可能なユーティリティモジュールをインポート
import * as cast from "./cast.js";
import * as compress from "./compress.js";
import * as datetime from "./datetime.js";
import * as html from "./html.js";
import * as number from "./number.js";
import * as string from "./string.js";
import * as util from "./util.js";
import * as valid from "./valid.js";
//import * as crypto from "./crypto.js";
import * as system from "./system.js";

// すべてのユーティリティ関数を含むオブジェクトを作成
const utils = {
  ...cast,
  ...compress,
  ...datetime,
  ...html,
  ...number,
  ...string,
  ...util,
  ...valid,

  ...system,
};

// 個別のモジュールをエクスポート
export { cast, compress, datetime, html, number, string, util, valid, system };

export default utils;
