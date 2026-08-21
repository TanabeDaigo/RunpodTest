/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Number Utilities                                 ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive number utility library that provides       ║
 * ║   number formatting, conversion, calculation, and            ║
 * ║   validation capabilities                                    ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file number.js
 * @description 数値ユーティリティライブラリ
 *
 * 主な機能:
 * - 数値の変換（文字列、整数、小数点）
 * - 数値のフォーマット（通貨、パーセント、桁区切り）
 * - 数値の計算（四捨五入、切り上げ、切り捨て）
 * - 数値の検証（範囲チェック、最大値、最小値）
 * - 数値の集計（合計、平均）
 *
 * @example
 * import {
 *   format,
 *   round,
 *   inRange,
 *   sum,
 *   average
 * } from '@krono-metro/metrojs/utils/number';
 *
 * // 数値のフォーマット
 * const formatted = format(1234.56, { style: 'currency' }); // "¥1,235"
 *
 * // 数値の四捨五入
 * const rounded = round(123.456, 2); // 123.46
 *
 * // 範囲チェック
 * const isValid = inRange(5, 1, 10); // true
 *
 * // 集計
 * const total = sum(1, 2, 3, 4, 5); // 15
 * const avg = average(1, 2, 3, 4, 5); // 3
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import { isNull } from "./util.js";

// 数値フォーマット用のキャッシュ
const FORMAT_CACHE = new Map();

/**
 * 数値フォーマットを取得します
 * @param {Object} format - フォーマットオプション
 * @returns {Intl.NumberFormat} フォーマッター
 * @example
 * const formatter = getFormat({ style: 'currency' });
 * formatter.format(1234.56) // "¥1,235"
 */
function getFormat(format) {
  if (FORMAT_CACHE.has(format)) {
    return FORMAT_CACHE.get(format);
  }
  const formatter = new Intl.NumberFormat("ja-JP", format);
  FORMAT_CACHE.set(format, formatter);
  return formatter;
}

/**
 * 数値を文字列に変換します
 * @param {number|string|null} num - 変換する数値
 * @returns {string} 変換後の文字列
 * @example
 * toString(123) // "123"
 * toString("123") // "123"
 * toString(null) // "0"
 */
export function toString(num) {
  if (isNull(num)) return "0";
  return String(num);
}

/**
 * 文字列を数値に変換します
 * @param {string|null} str - 変換する文字列
 * @returns {number} 変換後の数値
 * @example
 * toNumber("123") // 123
 * toNumber("123.45") // 123.45
 * toNumber("abc") // 0
 * toNumber(null) // 0
 */
export function toNumber(str) {
  if (isNull(str)) return 0;
  const num = Number(str);
  return isNaN(num) ? 0 : num;
}

/**
 * 数値を整数に変換します
 * @param {number|string|null} value - 変換する値
 * @returns {number} 変換後の整数
 * @example
 * toInteger(123.45) // 123
 * toInteger("123.45") // 123
 * toInteger(null) // 0
 */
export const toInteger = (value) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : Math.trunc(num);
};

/**
 * 数値を四捨五入します
 * @param {number|string|null} value - 変換する値
 * @param {number} [decimals=0] - 小数点以下の桁数
 * @returns {number} 四捨五入後の数値
 * @example
 * round(123.456, 2) // 123.46
 * round("123.456", 1) // 123.5
 * round(null) // 0
 */
export const round = (value, decimals = 0) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  if (isNaN(num)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

/**
 * 数値を切り捨てます
 * @param {number|string|null} value - 変換する値
 * @param {number} [decimals=0] - 小数点以下の桁数
 * @returns {number} 切り捨て後の数値
 * @example
 * floor(123.456, 2) // 123.45
 * floor("123.456", 1) // 123.4
 * floor(null) // 0
 */
export const floor = (value, decimals = 0) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  if (isNaN(num)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.floor(num * factor) / factor;
};

/**
 * 数値を切り上げます
 * @param {number|string|null} value - 変換する値
 * @param {number} [decimals=0] - 小数点以下の桁数
 * @returns {number} 切り上げ後の数値
 * @example
 * ceil(123.456, 2) // 123.46
 * ceil("123.456", 1) // 123.5
 * ceil(null) // 0
 */
export const ceil = (value, decimals = 0) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  if (isNaN(num)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
};

/**
 * 数値を指定形式でフォーマットします
 * @param {number|string|null} value - 変換する値
 * @param {Object} [options={}] - フォーマットオプション
 * @param {string} [options.style='decimal'] - 数値の表示形式
 * @param {string} [options.currency='JPY'] - 通貨コード
 * @param {number} [options.minimumFractionDigits=0] - 小数点以下の最小桁数
 * @param {number} [options.maximumFractionDigits=0] - 小数点以下の最大桁数
 * @param {string} [options.notation='standard'] - 数値の表記方法
 * @param {boolean} [options.useGrouping=true] - 桁区切りを使用するかどうか
 * @returns {string} フォーマットされた文字列
 * @example
 * format(1234.56) // "1,235"
 * format(1234.56, { style: 'currency' }) // "¥1,235"
 * format(0.1234, { style: 'percent', maximumFractionDigits: 2 }) // "12.34%"
 * format(1234567, { notation: 'compact' }) // "123万"
 */
export const format = (value, options = { style: "currency" }) => {
  if (value === null || value === undefined) return "0";
  const num = Number(value);
  if (isNaN(num)) return "0";

  const defaultOptions = {
    style: "decimal",
    currency: "JPY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  // オプションの範囲チェック
  const minDigits = Math.min(Math.max(options.minimumFractionDigits ?? 0, 0), 20);
  const maxDigits = Math.min(Math.max(options.maximumFractionDigits ?? 0, minDigits), 20);

  const formatter = new Intl.NumberFormat("ja-JP", {
    ...defaultOptions,
    ...options,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits,
  });
  return formatter.format(num).replace("￥", "¥");
};

/**
 * 数値が指定された範囲内かどうかを判定します
 * @param {number|string|null} num - 判定する数値
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {boolean} 範囲内の場合はtrue
 * @example
 * inRange(5, 1, 10) // true
 * inRange("5", 1, 10) // true
 * inRange(15, 1, 10) // false
 * inRange(null, 1, 10) // false
 */
export function inRange(num, min, max) {
  if (isNull(num)) return false;
  const n = Number(num);
  return n >= min && n <= max;
}

/**
 * 数値の絶対値を返します
 * @param {number|string|null} value - 変換する値
 * @returns {number} 絶対値
 * @example
 * abs(-123) // 123
 * abs("-123") // 123
 * abs(null) // 0
 */
export const abs = (value) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : Math.abs(num);
};

/**
 * 数値の符号を返します
 * @param {number|string|null} value - 変換する値
 * @returns {number} 符号（1: 正、-1: 負、0: ゼロ）
 * @example
 * sign(123) // 1
 * sign(-123) // -1
 * sign(0) // 0
 * sign(null) // 0
 */
export const sign = (value) => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : Math.sign(num);
};

/**
 * 最大値を返します
 * @param {...number|string} values - 比較する値
 * @returns {number} 最大値
 * @example
 * max(1, 2, 3) // 3
 * max("1", "2", "3") // 3
 * max(1, "abc", 3) // 3
 * max("abc") // 0
 */
export const max = (...values) => {
  const nums = values.map((v) => Number(v)).filter((n) => !isNaN(n));
  return nums.length ? Math.max(...nums) : 0;
};

/**
 * 最小値を返します
 * @param {...number|string} values - 比較する値
 * @returns {number} 最小値
 * @example
 * min(1, 2, 3) // 1
 * min("1", "2", "3") // 1
 * min(1, "abc", 3) // 1
 * min("abc") // 0
 */
export const min = (...values) => {
  const validNums = values
    .filter((v) => v !== null && v !== undefined)
    .map((v) => Number(v))
    .filter((n) => !isNaN(n));
  return validNums.length ? Math.min(...validNums) : 0;
};

/**
 * 合計値を返します
 * @param {...number|string} values - 合計する値
 * @returns {number} 合計値
 * @example
 * sum(1, 2, 3) // 6
 * sum("1", "2", "3") // 6
 * sum(1, "abc", 3) // 4
 * sum("abc") // 0
 */
export const sum = (...values) => {
  return values.reduce((acc, v) => {
    const num = Number(v);
    return acc + (isNaN(num) ? 0 : num);
  }, 0);
};

/**
 * 平均値を返します
 * @param {...number|string} values - 平均を計算する値
 * @returns {number} 平均値
 * @example
 * average(1, 2, 3) // 2
 * average("1", "2", "3") // 2
 * average(1, "abc", 3) // 2
 * average("abc") // 0
 */
export const average = (...values) => {
  const nums = values.map((v) => {
    const num = Number(v);
    return isNaN(num) ? 0 : num;
  });
  const validNums = nums.filter((n) => n !== 0);
  return validNums.length ? validNums.reduce((a, b) => a + b, 0) / validNums.length : 0;
};
