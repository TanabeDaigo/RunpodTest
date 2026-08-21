/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - General Utilities                                ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive general utility library that provides      ║
 * ║   type checking, value conversion, object manipulation,      ║
 * ║   and common helper functions                                ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file util.js
 * @description 汎用ユーティリティライブラリ
 *
 * 主な機能:
 * - 型チェック（数値、文字列、配列、オブジェクトなど）
 * - 値の変換と検証
 * - オブジェクト操作（コピー、マージ、キー操作）
 * - 配列操作
 * - 文字列操作
 * - 共通ヘルパー関数
 *
 * @example
 * import {
 *   getType,
 *   isNumber,
 *   deepClone,
 *   merge,
 *   omit
 * } from '@krono-metro/metrojs/utils/util';
 *
 * // 型チェック
 * const type = getType(123); // "number"
 * const isNum = isNumber("123"); // false
 *
 * // オブジェクト操作
 * const obj = { a: 1, b: { c: 2 } };
 * const copy = deepClone(obj);
 *
 * // オブジェクトのマージ
 * const merged = merge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }
 *
 * // プロパティの除外
 * const filtered = omit({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { b: 2 }
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

// 型チェック用のキャッシュ
const TYPE_CACHE = new Map();

/**
 * 値の型を取得します
 * @param {*} value - 型を取得する値
 * @returns {string} 値の型（小文字）
 * @example
 * getType(123) // "number"
 * getType("text") // "string"
 * getType([]) // "array"
 * getType({}) // "object"
 */
export function getType(value) {
  if (TYPE_CACHE.has(value)) {
    return TYPE_CACHE.get(value);
  }
  const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
  TYPE_CACHE.set(value, type);
  return type;
}

/**
 * nullチェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} nullの場合はtrue、それ以外はfalse
 * @example
 * isNull(null) // true
 * isNull(undefined) // false
 * isNull("") // false
 * isNull(0) // false
 */
export function isNull(value) {
  return value === null || value === undefined;
}

/**
 * 値がnull、undefined、または空かどうかを判定します
 * @param {*} value - チェックする値
 * @returns {boolean} null、undefined、または空の場合はtrue、それ以外はfalse
 * @example
 * isNullOrEmpty(null) // true
 * isNullOrEmpty(undefined) // true
 * isNullOrEmpty("") // true
 * isNullOrEmpty([]) // true
 * isNullOrEmpty({}) // true
 * isNullOrEmpty("text") // false
 * isNullOrEmpty([1, 2, 3]) // false
 * isNullOrEmpty({ a: 1 }) // false
 */
export function isNullOrEmpty(value) {
  return isNull(value) || isEmpty(value);
}

/**
 * 値が空かどうかを判定します
 * @param {*} value - チェックする値
 * @returns {boolean} 空の場合はtrue、それ以外はfalse
 * @example
 * isEmpty("") // true
 */
export function isEmpty(value) {
  if (isNull(value)) {
    return true;
  }
  if (isArray(value)) {
    return value.length === 0;
  }
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }
  return value === "";
}

/**
 * 文字列が空でないかどうかを判定します
 * @param {string} str - チェックする文字列
 * @returns {boolean} 空でない場合はtrue、それ以外はfalse
 * @example
 * isNotEmpty("text") // true
 * isNotEmpty(" ") // true
 * isNotEmpty("") // false
 * isNotEmpty(null) // false
 */
export function isNotEmpty(str) {
  return !isEmpty(str);
}

/**
 * undefinedチェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} undefinedの場合はtrue、それ以外はfalse
 * @example
 * isUndefined(undefined) // true
 * isUndefined(null) // false
 * isUndefined("") // false
 * isUndefined(0) // false
 */
export function isUndefined(value) {
  return value === undefined;
}

/**
 * 数値チェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} 数値の場合はtrue、それ以外はfalse
 * @example
 * isNumber(123) // true
 * isNumber("123") // false
 * isNumber(NaN) // false
 * isNumber(Infinity) // true
 */
export function isNumber(value) {
  return typeof value === "number" && !isNaN(value);
}

/**
 * 文字列チェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} 文字列の場合はtrue、それ以外はfalse
 * @example
 * isString("text") // true
 * isString(123) // false
 * isString(null) // false
 * isString("") // true
 */
export function isString(value) {
  return typeof value === "string";
}

/**
 * 配列チェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} 配列の場合はtrue、それ以外はfalse
 * @example
 * isArray([]) // true
 * isArray([1, 2, 3]) // true
 * isArray({}) // false
 * isArray("array") // false
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * オブジェクトチェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} オブジェクトの場合はtrue、それ以外はfalse
 * @example
 * isObject({}) // true
 * isObject({ a: 1 }) // true
 * isObject([]) // false
 * isObject(null) // false
 */
export function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * 関数チェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} 関数の場合はtrue、それ以外はfalse
 * @example
 * isFunction(() => {}) // true
 * isFunction(function() {}) // true
 * isFunction("function") // false
 * isFunction(null) // false
 */
export function isFunction(value) {
  return typeof value === "function";
}

/**
 * 真偽値チェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} 真偽値の場合はtrue、それ以外はfalse
 * @example
 * isBoolean(true) // true
 * isBoolean(false) // true
 * isBoolean(1) // false
 * isBoolean("true") // false
 */
export function isBoolean(value) {
  return typeof value === "boolean";
}

/**
 * 日付チェックを行います
 * @param {*} value - チェックする値
 * @returns {boolean} 有効な日付の場合はtrue、それ以外はfalse
 * @example
 * isDate(new Date()) // true
 * isDate(new Date("2024-01-01")) // true
 * isDate("2024-01-01") // false
 * isDate(null) // false
 */
export function isDate(value) {
  return value instanceof Date && !isNaN(value);
}

/**
 * オブジェクトの深いコピーを作成します
 * @param {Object|Array} obj - コピーするオブジェクトまたは配列
 * @returns {Object|Array} コピーされたオブジェクトまたは配列
 * @example
 * const obj = { a: 1, b: { c: 2 } }
 * const copy = deepClone(obj)
 * copy.b.c = 3
 * console.log(obj.b.c) // 2
 */
export function deepClone(obj) {
  if (!isObject(obj) && !isArray(obj)) return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * オブジェクトをマージします
 * @param {Object} target - マージ先のオブジェクト
 * @param {Object} source - マージ元のオブジェクト
 * @returns {Object} マージされたオブジェクト
 * @example
 * const target = { a: 1, b: 2 }
 * const source = { b: 3, c: 4 }
 * const result = merge(target, source)
 * console.log(result) // { a: 1, b: 3, c: 4 }
 */
export function merge(target, source) {
  if (!isObject(target) || !isObject(source)) return target;
  return { ...target, ...source };
}

/**
 * オブジェクトのキーを取得します
 * @param {Object} obj - 対象のオブジェクト
 * @returns {string[]} オブジェクトのキーの配列
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const keys = keys(obj)
 * console.log(keys) // ["a", "b", "c"]
 */
export function keys(obj) {
  if (!isObject(obj)) return [];
  return Object.keys(obj);
}

/**
 * オブジェクトの値を取得します
 * @param {Object} obj - 対象のオブジェクト
 * @returns {Array} オブジェクトの値の配列
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const values = values(obj)
 * console.log(values) // [1, 2, 3]
 */
export function values(obj) {
  if (!isObject(obj)) return [];
  return Object.values(obj);
}

/**
 * オブジェクトのエントリを取得します
 * @param {Object} obj - 対象のオブジェクト
 * @returns {Array} オブジェクトのエントリの配列
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const entries = entries(obj)
 * console.log(entries) // [["a", 1], ["b", 2], ["c", 3]]
 */
export function entries(obj) {
  if (!isObject(obj)) return [];
  return Object.entries(obj);
}

/**
 * オブジェクトから指定したキーを除外します
 * @param {Object} obj - 対象のオブジェクト
 * @param {string[]} keys - 除外するキーの配列
 * @returns {Object} キーが除外されたオブジェクト
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const result = omit(obj, ["a", "c"])
 * console.log(result) // { b: 2 }
 */
export function omit(obj, keys) {
  if (!isObject(obj) || !isArray(keys)) return obj;
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * オブジェクトから指定したキーのみを選択します
 * @param {Object} obj - 対象のオブジェクト
 * @param {string[]} keys - 選択するキーの配列
 * @returns {Object} 選択されたキーのみのオブジェクト
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const result = pick(obj, ["a", "c"])
 * console.log(result) // { a: 1, c: 3 }
 */
export function pick(obj, keys) {
  if (!isObject(obj) || !isArray(keys)) return {};
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}

/**
 * 値がnullでないかどうかを判定します
 * @param {*} value - チェックする値
 * @returns {boolean} nullでない場合はtrue、それ以外はfalse
 * @example
 * isNotNull(null) // false
 * isNotNull(undefined) // true
 * isNotNull("") // true
 * isNotNull(0) // true
 */
export function isNotNull(value) {
  return !isNull(value);
}

/**
 * JSONオブジェクトのプロパティ数を取得します
 * @param {Object} json - 対象のJSONオブジェクト
 * @returns {number} プロパティの数
 * @example
 * const json = { a: 1, b: 2, c: 3 }
 * const length = lengthForJson(json)
 * console.log(length) // 3
 */
export function lengthForJson(json) {
  if (isNull(json) == true) {
    return 0;
  }
  return Object.keys(json).length;
}

/**
 * オブジェクトが指定されたプロパティを持っているかどうかを確認します
 * @param {Object} obj - チェックするオブジェクト
 * @param {string} prop - チェックするプロパティ名
 * @returns {boolean} プロパティが存在する場合はtrue
 * @example
 * hasOwn({name: "metro"}, "name") // true
 * hasOwn({name: "metro"}, "age") // false
 */
export function hasOwn(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
