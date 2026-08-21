/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Type Casting Utilities                           ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive type casting utility library that          ║
 * ║   provides safe and reliable type conversions for            ║
 * ║   dates, numbers, strings, and boolean values                ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file cast.js
 * @description 型変換ユーティリティライブラリ
 *
 * 主な機能:
 * - 日付の変換（Date、文字列、配列間の相互変換）
 * - 数値の変換（文字列との相互変換）
 * - 真偽値の変換（文字列との相互変換）
 * - 型安全性の確保とエラーハンドリング
 *
 * @example
 * import { dateToArray, stringToNumber, stringToBoolean } from '@krono-metro/metrojs/utils/cast';
 *
 * // 日付の変換
 * const dateArray = dateToArray('2024-01-01'); // [2024, 1, 1]
 *
 * // 数値の変換
 * const number = stringToNumber('123.45'); // 123.45
 *
 * // 真偽値の変換
 * const bool = stringToBoolean('true'); // true
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import dayjs from "dayjs";

// 正規表現を事前コンパイル
const DATE_REGEX = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/;

/**
 * 日付を配列に変換します
 * @param {Date|string} date - 変換する日付（Dateオブジェクトまたは日付文字列）
 * @returns {number[]} [年, 月, 日]の配列
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * dateToArray(new Date(2024, 0, 1)) // [2024, 1, 1]
 * dateToArray("2024-01-01") // [2024, 1, 1]
 * dateToArray("2024/01/01") // [2024, 1, 1]
 */
export function dateToArray(date) {
  if (!date) {
    throw new Error("日付が指定されていません");
  }

  let d;
  if (typeof date === "string") {
    const match = DATE_REGEX.exec(date);
    if (!match) {
      throw new Error("無効な日付形式です");
    }
    const [, year, month, day] = match;
    // 一度だけdayjsインスタンスを生成
    d = dayjs(`${year}-${month}-${day}`);
    if (!d.isValid() || month < 1 || month > 12 || day < 1 || day > d.daysInMonth()) {
      throw new Error("無効な日付形式です");
    }
  } else {
    d = dayjs(date);
    if (!d.isValid()) {
      throw new Error("無効な日付形式です");
    }
  }

  return [d.year(), d.month() + 1, d.date()];
}

/**
 * 日付文字列をDateオブジェクトに変換します
 * @param {string} dateStr - 変換する日付文字列
 * @param {string} separator - 日付の区切り文字
 * @returns {Date} 変換されたDateオブジェクト
 * @throws {Error} 日付文字列が無効な場合にスロー
 * @example
 * stringToDate("2024-01-01", "-") // Dateオブジェクト
 * stringToDate("2024/01/01", "/") // Dateオブジェクト
 * stringToDate("20240101", "") // Dateオブジェクト
 */
export function stringToDate(dateStr, separator = undefined) {
  if (!dateStr) {
    throw new Error("日付文字列が指定されていません");
  }
  if (separator === null || separator === undefined || separator === "") {
    throw new Error("区切り文字が指定されていません");
  }
  const arr = dateStr.split(separator);
  if (arr.length !== 3) {
    throw new Error("無効な日付形式です");
  }
  const [year, month, day] = arr.map(Number);
  if (month < 1 || month > 12) {
    throw new Error("無効な日付です");
  }
  const d = dayjs(`${year}-${month}-${day}`);
  if (!d.isValid() || day < 1 || day > d.daysInMonth()) {
    throw new Error("無効な日付です");
  }
  return d.toDate();
}

/**
 * 日時文字列をDateオブジェクトに変換します
 * @param {string} dateTime - 変換する日時文字列（YYYY-MM-DD HH:mm:ss形式）
 * @returns {Date} 変換されたDateオブジェクト
 * @throws {Error} 日時文字列が無効な場合にスロー
 * @example
 * stringToDateForDateTime("2024-01-01 12:00:00") // Dateオブジェクト
 * stringToDateForDateTime("2024/01/01 12:00:00") // Dateオブジェクト
 */
export function stringToDateForDateTime(dateTime) {
  if (!dateTime) {
    throw new Error("日時文字列が指定されていません");
  }
  const match = dateTime.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2}) (\d{2}):(\d{2}):(\d{2})$/);
  if (!match) {
    throw new Error("無効な日時形式です");
  }
  const [, year, month, day, hour, minute, second] = match.map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    throw new Error("無効な日時形式です");
  }
  const d = dayjs(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
  if (!d.isValid() || day > d.daysInMonth()) {
    throw new Error("無効な日時形式です");
  }
  return d.toDate();
}

/**
 * 文字列を数値に変換します
 * @param {string} str - 変換する文字列
 * @returns {number} 変換された数値
 * @throws {Error} 文字列が数値に変換できない場合にスロー
 * @example
 * stringToNumber("123") // 123
 * stringToNumber("123.45") // 123.45
 * stringToNumber("-123") // -123
 */
export function stringToNumber(str) {
  if (!str) {
    throw new Error("文字列が指定されていません");
  }
  const num = Number(str);
  if (isNaN(num)) {
    throw new Error("数値に変換できない文字列です");
  }
  return num;
}

/**
 * 数値を文字列に変換します
 * @param {number} num - 変換する数値
 * @returns {string} 変換された文字列
 * @throws {Error} 数値が無効な場合にスロー
 * @example
 * numberToString(123) // "123"
 * numberToString(123.45) // "123.45"
 * numberToString(-123) // "-123"
 */
export function numberToString(num) {
  if (num === undefined || num === null) {
    throw new Error("数値が指定されていません");
  }
  if (typeof num !== "number") {
    throw new Error("数値以外の型が指定されています");
  }
  return String(num);
}

/**
 * 文字列を真偽値に変換します
 * @param {string} str - 変換する文字列
 * @returns {boolean} 変換された真偽値
 * @throws {Error} 文字列が真偽値に変換できない場合にスロー
 * @example
 * stringToBoolean("true") // true
 * stringToBoolean("false") // false
 * stringToBoolean("1") // true
 * stringToBoolean("0") // false
 */
export function stringToBoolean(str) {
  if (!str) {
    throw new Error("文字列が指定されていません");
  }
  if (typeof str !== "string") {
    throw new Error("文字列以外の型が指定されています");
  }
  const lowerStr = str.toLowerCase();
  if (lowerStr === "true" || lowerStr === "1") {
    return true;
  }
  if (lowerStr === "false" || lowerStr === "0") {
    return false;
  }
  throw new Error("真偽値に変換できない文字列です");
}

/**
 * 真偽値を文字列に変換します
 * @param {boolean} bool - 変換する真偽値
 * @returns {string} 変換された文字列
 * @throws {Error} 真偽値が無効な場合にスロー
 * @example
 * booleanToString(true) // "true"
 * booleanToString(false) // "false"
 */
export function booleanToString(bool) {
  if (bool === undefined || bool === null) {
    throw new Error("ブール値が指定されていません");
  }
  if (typeof bool !== "boolean") {
    throw new Error("ブール値以外の型が指定されています");
  }
  return String(bool);
}
