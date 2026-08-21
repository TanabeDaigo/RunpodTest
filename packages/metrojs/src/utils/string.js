/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - String Utilities                                 ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive string utility library that provides       ║
 * ║   case conversion, string manipulation, formatting,          ║
 * ║   and validation capabilities                                ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file string.js
 * @description 文字列操作ユーティリティライブラリ
 *
 * 主な機能:
 * - ケース変換（キャメルケース、パスカルケース、スネークケースなど）
 * - 文字列操作（置換、分割、結合、トリミング）
 * - 文字列フォーマット（パディング、切り詰め、繰り返し）
 * - 文字列検証（正規表現マッチング、文字種チェック）
 * - 文字列変換（大文字/小文字、ブール値）
 *
 * @example
 * import {
 *   camelCase,
 *   replaceAll,
 *   truncate,
 *   padStart
 * } from '@krono-metro/metrojs/utils/string';
 *
 * // ケース変換
 * const camel = camelCase('hello-world'); // "helloWorld"
 *
 * // 文字列置換
 * const replaced = replaceAll('hello world', 'world', 'universe');
 *
 * // 文字列切り詰め
 * const truncated = truncate('Hello, World!', 5); // "Hello..."
 *
 * // パディング
 * const padded = padStart('123', 5, '0'); // "00123"
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import { camelCase as tCamelCase, pascalCase as tPascalCase, snakeCase as tSnakeCase, kebabCase as tKebabCase, titleCase as tTitleCase, sentenceCase as tSentenceCase } from "tiny-case";
import { isNull } from "./util.js";

// 正規表現を事前コンパイル
const CAMEL_CASE_REGEX = /([a-z])([A-Z])/g;
const ALPHA_NUM_REGEX = /[^0-9a-zA-Z ]/gi;
const ALPHA_NUM_SYMBOL_REGEX = /[^a-zA-Z0-9!-/:-@¥ [-`{-~]*$/;
const NUMBER_ONLY_REGEX = /[^0-9]/gi;

// キャッシュされた空文字列
const EMPTY_STRING = "";

// 正規表現パターンをキャッシュ
const PATTERN_CACHE = new Map();

/**
 * 正規表現パターンを取得します
 * @param {string} pattern - 正規表現パターン
 * @returns {RegExp} コンパイルされた正規表現
 * @example
 * const regex = getPattern("\\d+");
 * regex.test("123") // true
 */
function getPattern(pattern) {
  if (PATTERN_CACHE.has(pattern)) {
    return PATTERN_CACHE.get(pattern);
  }
  const regex = new RegExp(pattern, "g");
  PATTERN_CACHE.set(pattern, regex);
  return regex;
}

/**
 * 文字列をキャメルケースに変換します
 * @param {string} value - 変換する文字列
 * @returns {string} キャメルケースに変換された文字列
 * @example
 * camelCase("hello world") // "helloWorld"
 * camelCase("HELLO_WORLD") // "helloWorld"
 */
export const camelCase = tCamelCase;

/**
 * 文字列をパスカルケースに変換します
 * @param {string} value - 変換する文字列
 * @returns {string} パスカルケースに変換された文字列
 * @example
 * pascalCase("hello world") // "HelloWorld"
 * pascalCase("hello_world") // "HelloWorld"
 */
export const pascalCase = tPascalCase;

/**
 * 文字列をスネークケースに変換します
 * @param {string} value - 変換する文字列
 * @returns {string} スネークケースに変換された文字列
 * @example
 * snakeCase("helloWorld") // "hello_world"
 * snakeCase("HelloWorld") // "hello_world"
 */
export const snakeCase = tSnakeCase;

/**
 * 文字列をケバブケースに変換します
 * @param {string} value - 変換する文字列
 * @returns {string} ケバブケースに変換された文字列
 * @example
 * kebabCase("helloWorld") // "hello-world"
 * kebabCase("HelloWorld") // "hello-world"
 */
export const kebabCase = tKebabCase;

/**
 * 文字列をタイトルケースに変換します
 * @param {string} value - 変換する文字列
 * @returns {string} タイトルケースに変換された文字列
 * @example
 * titleCase("hello world") // "Hello World"
 * titleCase("hello_world") // "Hello World"
 */
export const titleCase = tTitleCase;

/**
 * 文字列を文章ケースに変換します
 * @param {string} value - 変換する文字列
 * @returns {string} 文章ケースに変換された文字列
 * @example
 * sentenceCase("hello world") // "Hello world"
 * sentenceCase("HELLO WORLD") // "Hello world"
 */
export const sentenceCase = tSentenceCase;

/**
 * 文字列を単語配列に分割します
 * @param {string} value - 分割する文字列
 * @returns {string[]} 単語の配列
 * @example
 * words("helloWorld") // ["hello", "world"]
 * words("hello-world") // ["hello", "world"]
 */
export function words(value) {
  return value.replace(CAMEL_CASE_REGEX, "$1 $2").replace(/[-_]/g, " ").toLowerCase().split(" ").filter(Boolean);
}

/**
 * 文字列の最初の文字を大文字にします
 * @param {string} value - 変換する文字列
 * @returns {string} 最初の文字が大文字になった文字列
 * @example
 * upperFirst("hello") // "Hello"
 * upperFirst("world") // "World"
 */
export function upperFirst(value) {
  if (!value) return EMPTY_STRING;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * 文字列の全置換を行います
 * @param {string} str - 対象の文字列
 * @param {string} before - 置換前の文字列
 * @param {string} after - 置換後の文字列
 * @returns {string} 置換後の文字列
 * @example
 * replaceAll("hello world", "world", "universe") // "hello universe"
 * replaceAll("hello world world", "world", "universe") // "hello universe universe"
 */
export function replaceAll(str, before, after) {
  // RegExpを使用した置換（split/joinより効率的）
  return str.replace(new RegExp(before.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), after);
}

/**
 * 英数字のみを残して他の文字を削除します
 * @param {string} value - 対象の文字列
 * @param {boolean} [is_kigou=false] - 記号を含めるかどうか
 * @returns {string} 英数字のみの文字列
 * @example
 * replaceAlphaNumOnly("hello123!@#") // "hello123"
 * replaceAlphaNumOnly("hello123!@#", true) // "hello123!@#"
 */
export function replaceAlphaNumOnly(value, is_kigou = false) {
  const regex = is_kigou ? ALPHA_NUM_SYMBOL_REGEX : ALPHA_NUM_REGEX;
  return value.replace(regex, EMPTY_STRING);
}

/**
 * 数字のみを残して他の文字を削除します
 * @param {string} value - 対象の文字列
 * @returns {string} 数字のみの文字列
 * @example
 * replaceNumberOnly("123abc456") // "123456"
 * replaceNumberOnly("abc123def") // "123"
 */
export function replaceNumberOnly(value) {
  return value.replace(NUMBER_ONLY_REGEX, EMPTY_STRING);
}

/**
 * 文字列をブール値に変換します
 * @param {string} str - 変換する文字列
 * @returns {boolean} 変換後のブール値
 * @example
 * toBoolean("true") // true
 * toBoolean("false") // false
 * toBoolean("TRUE") // false
 */
export function toBoolean(str) {
  return str === "true";
}

/**
 * 文字列を指定された文字で分割します
 * @param {string} str - 分割する文字列
 * @param {string} [delimiter=","] - 区切り文字
 * @returns {string[]} 分割された文字列の配列
 * @example
 * split("a,b,c") // ["a", "b", "c"]
 * split("a-b-c", "-") // ["a", "b", "c"]
 */
export function split(str, delimiter = ",") {
  if (isNull(str)) return [];
  return String(str).split(delimiter);
}

/**
 * 配列を指定された文字で結合します
 * @param {Array} array - 結合する配列
 * @param {string} [delimiter=","] - 区切り文字
 * @returns {string} 結合された文字列
 * @example
 * join(["a", "b", "c"]) // "a,b,c"
 * join(["a", "b", "c"], "-") // "a-b-c"
 */
export function join(array, delimiter = ",") {
  if (!Array.isArray(array)) return "";
  return array.join(delimiter);
}

/**
 * 文字列の前後の空白を削除します
 * @param {string} str - 対象の文字列
 * @returns {string} 空白を削除した文字列
 * @example
 * trim("  hello  ") // "hello"
 * trim("  hello world  ") // "hello world"
 */
export function trim(str) {
  if (isNull(str)) return "";
  return String(str).trim();
}

/**
 * 文字列を大文字に変換します
 * @param {string} str - 変換する文字列
 * @returns {string} 大文字に変換された文字列
 * @example
 * toUpperCase("hello") // "HELLO"
 * toUpperCase("Hello World") // "HELLO WORLD"
 */
export function toUpperCase(str) {
  if (isNull(str)) return "";
  return String(str).toUpperCase();
}

/**
 * 文字列を小文字に変換します
 * @param {string} str - 変換する文字列
 * @returns {string} 小文字に変換された文字列
 * @example
 * toLowerCase("HELLO") // "hello"
 * toLowerCase("Hello World") // "hello world"
 */
export function toLowerCase(str) {
  if (isNull(str)) return "";
  return String(str).toLowerCase();
}

/**
 * 文字列の長さを取得します
 * @param {string} str - 対象の文字列
 * @returns {number} 文字列の長さ
 * @example
 * length("hello") // 5
 * length("こんにちは") // 5
 */
export function length(str) {
  if (isNull(str)) return 0;
  return String(str).length;
}

/**
 * 文字列を指定された長さで切り詰めます
 * @param {string} str - 対象の文字列
 * @param {number} [length=100] - 切り詰める長さ
 * @param {string} [suffix="..."] - 末尾に追加する文字列
 * @returns {string} 切り詰められた文字列
 * @example
 * truncate("hello world", 5) // "hello..."
 * truncate("hello world", 5, "!") // "hello!"
 */
export function truncate(str, length = 100, suffix = "...") {
  if (isNull(str)) return "";
  const s = String(str);
  if (s.length <= length) return s;
  return s.slice(0, length) + suffix;
}

/**
 * 文字列の置換を行います
 * @param {string} str - 対象の文字列
 * @param {string} search - 検索する文字列
 * @param {string} replace - 置換する文字列
 * @returns {string} 置換後の文字列
 * @example
 * replace("hello world", "world", "universe") // "hello universe"
 * replace("hello world world", "world", "universe") // "hello universe world"
 */
export const replace = (str, search, replace) => {
  if (str === null || str === undefined) return "";
  if (search === null || search === undefined) return str;
  if (replace === null || replace === undefined) return str;
  const parts = str.split(search);
  return parts[0] + replace + parts.slice(1).join(search);
};

/**
 * 文字列が特定のパターンに一致するか確認します
 * @param {string} str - 対象の文字列
 * @param {string} pattern - 正規表現パターン
 * @returns {boolean} 一致する場合はtrue
 * @example
 * matches("hello123", "\\d+") // true
 * matches("hello", "\\d+") // false
 */
export function matches(str, pattern) {
  if (isNull(str)) return false;
  const regex = getPattern(pattern);
  return regex.test(String(str));
}

/**
 * 文字列を指定された回数繰り返します
 * @param {string} str - 繰り返す文字列
 * @param {number} count - 繰り返し回数
 * @returns {string} 繰り返された文字列
 * @example
 * repeat("hello", 3) // "hellohellohello"
 * repeat("a", 5) // "aaaaa"
 */
export function repeat(str, count) {
  if (isNull(str) || count <= 0) return "";
  return String(str).repeat(count);
}

/**
 * 文字列を指定された長さで左側をパディングします
 * @param {string} str - 対象の文字列
 * @param {number} length - パディング後の長さ
 * @param {string} [padString=" "] - パディングに使用する文字
 * @returns {string} パディングされた文字列
 * @example
 * padStart("123", 5, "0") // "00123"
 * padStart("hello", 10, "-") // "-----hello"
 */
export function padStart(str, length, padString = " ") {
  if (isNull(str)) return "";
  return String(str).padStart(length, padString);
}

/**
 * 文字列を指定された長さで右側をパディングします
 * @param {string} str - 対象の文字列
 * @param {number} length - パディング後の長さ
 * @param {string} [padString=" "] - パディングに使用する文字
 * @returns {string} パディングされた文字列
 * @example
 * padEnd("123", 5, "0") // "12300"
 * padEnd("hello", 10, "-") // "hello-----"
 */
export function padEnd(str, length, padString = " ") {
  if (isNull(str)) return "";
  return String(str).padEnd(length, padString);
}
