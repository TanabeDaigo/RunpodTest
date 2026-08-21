/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Date Utilities Module                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive date manipulation utility that provides     ║
 * ║   powerful date formatting, comparison, and calculation       ║
 * ║   capabilities based on dayjs                                ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file dayjs.js
 * @description MetroJSの日付操作ユーティリティモジュール
 *
 * 主な機能:
 * - 日付のフォーマットとパース
 * - 日付の比較と計算
 * - 期間の判定
 * - 日本語ロケール対応
 *
 * @example
 * // 日付のフォーマット
 * const formatted = dayjs().format('YYYY年MM月DD日');
 *
 * // 日付の比較
 * const isAfter = dayjs('2024-01-01').isAfter('2023-12-31');
 *
 * // 期間の判定
 * const isInRange = dayjs().isBetween('2024-01-01', '2024-12-31');
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import dayjs from "dayjs";
import ja from "dayjs/locale/ja.js";

// 日本語ロケールを設定
dayjs.locale(ja);

// 必要なプラグインをインポート
import isBetween from "dayjs/plugin/isBetween.js";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import utc from "dayjs/plugin/utc.js";

// プラグインを拡張
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);
dayjs.extend(utc);

export default dayjs;
