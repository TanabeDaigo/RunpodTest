/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Validation Utilities                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive validation utility library that provides   ║
 * ║   data validation, type checking, and format verification    ║
 * ║   capabilities for various data types                        ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file valid.js
 * @description バリデーションユーティリティライブラリ
 *
 * 主な機能:
 * - データ型の検証（数値、文字列、日付など）
 * - フォーマットの検証（メールアドレス、電話番号、URL）
 * - 値の範囲チェック（数値範囲、文字列長）
 * - 空値チェック
 * - 正規表現によるパターンマッチング
 * - カスタムバリデーション
 *
 * @example
 * import {
 *   isMailAddress,
 *   isTelNo,
 *   isDate,
 *   isNumber,
 *   isInRange
 * } from '@krono-metro/metrojs/utils/valid';
 *
 * // メールアドレスの検証
 * const isValidEmail = isMailAddress('test@example.com'); // true
 *
 * // 電話番号の検証
 * const isValidTel = isTelNo('03-1234-5678'); // true
 *
 * // 日付の検証
 * const isValidDate = isDate('2024-01-01'); // true
 *
 * // 数値の検証
 * const isValidNumber = isNumber('123'); // true
 *
 * // 範囲チェック
 * const isInValidRange = isInRange(5, 1, 10); // true
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import dayjs from "../lib/dayjs";
import { isNull } from "./util.js";

// 正規表現を事前コンパイル
const ALPHA_NUM_REGEX = /^[0-9a-zA-Z ]*$/;
const ALPHA_NUM_MONEY_REGEX = /^[a-zA-Z0-9!-/:-@¥ [-`{-~]*$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const NUMBER_ONLY_REGEX = /^[0-9]*$/;
const INTL_PHONE_REGEX = /^\+[0-9]+(-[0-9]+){0,3}$/;
const DOMESTIC_PHONE_REGEX = /^[0-9]+(-[0-9]+){0,2}$/;

// キャッシュされた空文字列
const EMPTY_STRING = "";

// 正規表現パターンをキャッシュ
const PATTERN_CACHE = new Map();

/**
 * 正規表現パターンを取得します
 * パフォーマンス向上のため、一度作成したパターンはキャッシュされます
 *
 * @param {string|RegExp} pattern - 正規表現パターン
 * @returns {RegExp} コンパイルされた正規表現オブジェクト
 * @example
 * const regex = getPattern('^[0-9]+$');
 * regex.test('123'); // true
 */
function getPattern(pattern) {
  if (PATTERN_CACHE.has(pattern)) {
    return PATTERN_CACHE.get(pattern);
  }
  const regex = new RegExp(pattern);
  PATTERN_CACHE.set(pattern, regex);
  return regex;
}

/**
 * 英数字のみかどうかチェックする（最適化版）
 * @param {string} value - チェックする文字列
 * @param {boolean} [is_money=false] - 金額として扱うかどうか
 * @returns {boolean} 英数字のみの場合はtrue
 * @example
 * isAlphaNumOnly("abc123") // true
 * isAlphaNumOnly("abc123!") // false
 * isAlphaNumOnly("abc123!", true) // true
 */
export function isAlphaNumOnly(value, is_money = false) {
  const regex = is_money ? ALPHA_NUM_MONEY_REGEX : ALPHA_NUM_REGEX;
  return regex.test(value);
}

/**
 * 日付として正しいかどうかチェックする（最適化版）
 * @param {string|Date} value - チェックする日付
 * @returns {boolean} 日付として正しい場合はtrue
 * @example
 * isDate("2024-01-01") // true
 * isDate("2024/01/01") // true
 * isDate(new Date()) // true
 * isDate("2024-13-01") // false
 */
export function isDate(value) {
  if (isNull(value)) {
    return false;
  }

  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }

  // 日付文字列のパターンをチェック
  const datePattern = /^\d{4}[-/]\d{2}[-/]\d{2}$/;
  if (!datePattern.test(value)) {
    return false;
  }

  // dayjsで日付の妥当性をチェック
  const date = dayjs(value);
  return date.isValid() && date.format("YYYY-MM-DD") === value.replace(/\//g, "-");
}

/**
 * メールアドレスの形式を検証します
 * @param {string} value - 検証する値
 * @returns {boolean}
 * @example
 * isMailAddress("test@example.com") // true
 * isMailAddress("invalid-email") // false
 * isMailAddress(null) // true
 * isMailAddress("") // true
 */
export const isMailAddress = (value) => {
  if (value === null || value === undefined) return true;
  if (value === "") return true;
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(String(value));
};

/**
 * 入力されていないかどうかチェックする（最適化版）
 * @param {any} s - チェックする値
 * @returns {boolean} 入力されていない場合はtrue
 * @example
 * isNotInput(null) // true
 * isNotInput(undefined) // true
 * isNotInput("") // false
 */
export function isNotInput(s) {
  return s == null || s === undefined;
}

/**
 * 値が数値型かどうかチェックする（最適化版）
 * @param {any} obj - チェックする値
 * @returns {boolean} 数値型の場合はtrue
 * @example
 * isNumber(123) // true
 * isNumber("123") // true
 * isNumber("abc") // false
 */
export function isNumber(obj) {
  if (isNull(obj)) {
    return false;
  }

  // 配列は数値として扱わない
  if (Array.isArray(obj)) {
    return false;
  }

  return isFinite(obj);
}

/**
 * 文字列が数字のみで構成されているかチェックする（最適化版）
 * @param {string} value - チェックする文字列
 * @returns {boolean} 数字のみの場合はtrue
 * @example
 * isNumberOnly("123") // true
 * isNumberOnly("123a") // false
 */
export function isNumberOnly(value) {
  return NUMBER_ONLY_REGEX.test(value);
}

/**
 * 電話番号として正しいかどうかチェックする（最適化版）
 * @param {string} tel - 電話番号
 * @returns {boolean} 電話番号として正しい場合はtrue
 * @example
 * isTelNo("03-1234-5678") // true
 * isTelNo("0312345678") // true
 * isTelNo("+81-3-1234-5678") // true
 * isTelNo("abc") // false
 */
export function isTelNo(tel) {
  // nullや空文字列は許可
  if (isNull(tel) || tel === EMPTY_STRING) {
    return true;
  }

  // 記号のみは許可しない
  if (/^[-+]+$/.test(tel)) {
    return false;
  }

  // 国際電話番号の場合
  if (tel.startsWith("+")) {
    if (!INTL_PHONE_REGEX.test(tel)) {
      return false;
    }
    // ハイフンと+を除去して数字のみにする
    const numbers = tel.replace(/[-+]/g, EMPTY_STRING);
    return numbers.length >= 11 && numbers.length <= 13;
  }

  // 国内電話番号の場合
  if (!DOMESTIC_PHONE_REGEX.test(tel)) {
    return false;
  }

  // ハイフンを除去して数字のみにする
  const numbers = tel.replace(/-/g, EMPTY_STRING);
  return numbers.length >= 10 && numbers.length <= 11;
}

/**
 * 日付文字列として正しいかどうかチェックする（最適化版）
 * @param {string} dateString - 日付文字列（YYYY/MM/DD, YYYY-MM-DD, YYYYMMDD形式）
 * @returns {boolean} 日付として正しい場合はtrue
 * @example
 * isValidDateString("2023/12/31") // true
 * isValidDateString("2023-12-31") // true
 * isValidDateString("20231231") // true
 * isValidDateString("2023/13/31") // false
 * isValidDateString("2023/12/32") // false
 */
export function isValidDateString(dateString) {
  if (!dateString || typeof dateString !== "string") {
    return false;
  }

  // YYYYMMDD形式の場合
  if (/^\d{8}$/.test(dateString)) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return isDate(`${year}-${month}-${day}`);
  }

  // YYYY/MM/DDまたはYYYY-MM-DD形式の場合
  const parts = dateString.split(/[/-]/);
  if (parts.length !== 3) {
    return false;
  }

  const [year, month, day] = parts;
  return isDate(`${year}-${month}-${day}`);
}

/**
 * 値が空かどうかを判定します
 * 文字列、配列、オブジェクトの空判定に対応しています
 *
 * @param {any} value - チェックする値
 * @returns {boolean} 空の場合はtrue
 * @example
 * isEmpty("") // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty("abc") // false
 */
export function isEmpty(value) {
  if (isNull(value)) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * 値が整数かどうかを判定します
 *
 * @param {any} value - チェックする値
 * @returns {boolean} 整数の場合はtrue
 * @example
 * isInteger(123) // true
 * isInteger("123") // true
 * isInteger(1.23) // false
 */
export function isInteger(value) {
  if (isNull(value)) return false;
  return Number.isInteger(Number(value));
}

/**
 * 値が正の数かどうかを判定します
 *
 * @param {any} value - チェックする値
 * @returns {boolean} 正の数の場合はtrue
 * @example
 * isPositive(123) // true
 * isPositive(-123) // false
 * isPositive(0) // false
 */
export function isPositive(value) {
  if (isNull(value)) return false;
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

/**
 * 値が負の数かどうかを判定します
 *
 * @param {any} value - チェックする値
 * @returns {boolean} 負の数の場合はtrue
 * @example
 * isNegative(-123) // true
 * isNegative(123) // false
 * isNegative(0) // false
 */
export function isNegative(value) {
  if (isNull(value)) return false;
  const num = Number(value);
  return !isNaN(num) && num < 0;
}

/**
 * 値が指定された範囲内かどうかを判定します
 *
 * @param {any} value - チェックする値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {boolean} 範囲内の場合はtrue
 * @example
 * isInRange(5, 0, 10) // true
 * isInRange(-1, 0, 10) // false
 * isInRange(11, 0, 10) // false
 */
export function isInRange(value, min, max) {
  if (isNull(value)) return false;
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * 値が有効なURLかどうかを判定します
 *
 * @param {any} value - チェックする値
 * @returns {boolean} 有効なURLの場合はtrue
 * @example
 * isUrl("https://example.com") // true
 * isUrl("http://example.com") // true
 * isUrl("invalid-url") // false
 */
export function isUrl(value) {
  if (isNull(value)) return false;
  try {
    const url = new URL(String(value));
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * 値が指定された長さかどうかを判定します
 *
 * @param {any} value - チェックする値
 * @param {number} length - 期待する長さ
 * @returns {boolean} 指定された長さの場合はtrue
 * @example
 * isLength("abc", 3) // true
 * isLength("abc", 4) // false
 */
export function isLength(value, length) {
  if (isNull(value) || typeof value !== "string") return false;
  return value.length === length;
}

/**
 * 値が指定された長さ以上かどうかを判定します
 *
 * @param {any} value - チェックする値
 * @param {number} min - 最小の長さ
 * @returns {boolean} 指定された長さ以上の場合はtrue
 * @example
 * isMinLength("abc", 2) // true
 * isMinLength("abc", 4) // false
 */
export function isMinLength(value, min) {
  if (isNull(value) || typeof value !== "string") return false;
  return value.length >= min;
}

/**
 * 値が指定された長さ以下かどうかを判定します
 *
 * @param {any} value - チェックする値
 * @param {number} max - 最大の長さ
 * @returns {boolean} 指定された長さ以下の場合はtrue
 * @example
 * isMaxLength("abc", 4) // true
 * isMaxLength("abc", 2) // false
 */
export function isMaxLength(value, max) {
  if (isNull(value) || typeof value !== "string") return false;
  return value.length <= max;
}

/**
 * 値が指定されたパターンに一致するかどうかを判定します
 *
 * @param {any} value - チェックする値
 * @param {string|RegExp} pattern - 正規表現パターン
 * @returns {boolean} パターンに一致する場合はtrue
 * @example
 * isMatch("abc123", "^[a-z0-9]+$") // true
 * isMatch("ABC", "^[a-z]+$") // false
 */
export function isMatch(value, pattern) {
  if (isNull(value) || typeof value !== "string") return false;
  const regex = getPattern(pattern);
  return regex.test(value);
}
