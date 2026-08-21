/**
 * =========================================================================
 * MetroJS - HTML Utilities
 * =========================================================================
 *
 * HTML操作ユーティリティライブラリ
 * 改行文字の変換やHTMLタグの処理などの機能を提供します
 *
 * Copyright (c) 2019-2024 KronoMetro, Co.
 * All rights reserved.
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import React from "react";
import { isNull } from "./util.js";

// 正規表現を事前コンパイル
const NEWLINE_REGEX = /(\n)/g;
const BR_TAG_REGEX = /(<br \/>)/g;

// メモ化されたbr要素
const BR_ELEMENT = React.createElement("br");

/**
 * 改行文字(\n)をReactのbr要素に変換します（最適化版）
 * @param {string} text 変換する文字列
 * @returns {(string|React.ReactElement[])} 変換後の文字列またはReact要素の配列
 * @example
 * // 改行を含む文字列をbr要素に変換
 * nl2br("Hello\nWorld"); // ["Hello", <br key="1" />, "World"]
 *
 * // 改行を含まない文字列はそのまま返す
 * nl2br("Hello World"); // "Hello World"
 *
 * // nullまたは文字列以外の場合は元の値を返す
 * nl2br(null); // null
 * nl2br(123); // 123
 */
export function nl2br(text) {
  if (isNull(text) || typeof text !== "string") {
    return text;
  }

  // 改行がない場合は早期リターン
  if (!text.includes("\n")) {
    return text;
  }

  // 文字列を分割して配列に変換（メモリ効率改善）
  return text.split(NEWLINE_REGEX).map((line, i) => {
    return line.match(NEWLINE_REGEX)
      ? React.createElement("br", { key: i })
      : line;
  });
}

/**
 * HTML文字列内の<br />タグをReactのbr要素に変換します（最適化版）
 * @param {string} text 変換するHTML文字列
 * @returns {React.ReactElement[]} 変換後のReact要素の配列
 * @example
 * // <br />タグをbr要素に変換
 * breakLine("Hello<br />World"); // ["Hello", <br key="key_1" />, "World"]
 */
export function breakLine(text) {
  // 文字列を分割して配列に変換（メモリ効率改善）
  return text.split(BR_TAG_REGEX).map((line, index) => {
    return line.match(BR_TAG_REGEX)
      ? React.cloneElement(BR_ELEMENT, { key: `key_${index}` })
      : line;
  });
}
