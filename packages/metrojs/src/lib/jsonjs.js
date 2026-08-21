/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - JSON Utilities Module                            ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A powerful JSON manipulation utility that provides          ║
 * ║   comprehensive methods for handling JSON data structures     ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file jsonjs.js
 * @description MetroJSのJSON操作ユーティリティモジュール
 *
 * 主な機能:
 * - JSONオブジェクトの操作と変換
 * - 型安全な値の取得と設定
 * - ディープコピーとマージ
 * - 値の検証と比較
 *
 * @example
 * // 基本的な使用法
 * const json = new jsonjs({name: "metro", version: "1.0.0"});
 *
 * // 値の取得と設定
 * const name = json.get("name");
 * json.set("version", "2.0.0");
 *
 * // 型変換
 * const count = json.getValueAsNumber("count");
 * const isActive = json.getValueAsBoolean("active");
 *
 * // オブジェクトの操作
 * const copy = json.deepClone();
 * const merged = json.deepMerge({newField: "value"});
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import logjs from "./logjs";

// ログ出力用のインスタンスを作成
const _log = new logjs("jsonjs");

/**
 * JSONデータを操作するためのクラス
 * @class jsonjs
 * @description JSONオブジェクトの操作、変換、検証を行うためのユーティリティクラス
 */
export class jsonjs {
  /**
   * @param {Object} targetJson - 操作対象のJSONオブジェクト
   * @description 新しいJSONユーティリティインスタンスを作成します
   * @throws {Error} JSONオブジェクトが指定されていない場合
   */
  constructor(targetJson) {
    if (!targetJson || typeof targetJson !== "object") {
      throw new Error("JSONオブジェクトが指定されていません");
    }
    this.targetJson = targetJson;
  }

  /**
   * 操作対象のJSONオブジェクトを取得する
   * @returns {Object} JSONオブジェクト
   * @throws {Error} JSONオブジェクトが存在しない場合
   * @example
   * const json = new jsonjs({name: "metro"});
   * const target = json.getTargetJson();
   * console.log(target); // {name: "metro"}
   */
  getTargetJson() {
    if (!this.targetJson) {
      throw new Error("JSONオブジェクトが存在しません");
    }
    return this.targetJson;
  }

  /**
   * 指定したキーが存在するか確認する
   * @param {string} key - キー
   * @returns {boolean} キーが存在する場合はtrue
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({name: "metro"});
   * json.hasOwn("name"); // true
   * json.hasOwn("age"); // false
   */
  hasOwn(key) {
    if (!key) {
      throw new Error("キーが指定されていません");
    }
    if (this.targetJson == null) {
      return false;
    }
    return Object.hasOwn(this.targetJson, key);
  }

  /**
   * 指定したキーの値を取得する
   * @param {string} key - キー
   * @param {*} defaultValue - デフォルト値
   * @returns {*} 値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({name: "metro"});
   * json.get("name"); // "metro"
   * json.get("age", 20); // 20
   */
  get(key, defaultValue = null) {
    if (!key) {
      throw new Error("キーが指定されていません");
    }
    if (this.hasOwn(key)) {
      return this.targetJson[key];
    }
    return defaultValue;
  }

  /**
   * 指定したキーに値を設定する
   * @param {string} key - キー
   * @param {*} value - 値
   * @throws {Error} キーまたは値が指定されていない場合
   * @example
   * const json = new jsonjs({name: "metro"});
   * json.set("name", "metrojs");
   * json.get("name"); // "metrojs"
   */
  set(key, value) {
    if (!key) {
      throw new Error("キーが指定されていません");
    }
    if (value === undefined) {
      throw new Error("値が指定されていません");
    }
    if (this.hasOwn(key)) {
      this.targetJson[key] = value;
    }
  }

  /**
   * JSONオブジェクトのキーの数を取得する
   * @returns {number} キーの数
   * @example
   * const json = new jsonjs({name: "metro", version: "1.0.0"});
   * json.length(); // 2
   */
  length() {
    if (!this.targetJson) {
      return 0;
    }
    return Object.keys(this.targetJson).length;
  }

  /**
   * JSONオブジェクトのキーの配列を取得する
   * @returns {Array<string>} キーの配列
   * @example
   * const json = new jsonjs({name: "metro", version: "1.0.0"});
   * json.keys(); // ["name", "version"]
   */
  keys() {
    if (!this.targetJson) {
      return [];
    }
    return Object.keys(this.targetJson);
  }

  /**
   * JSONオブジェクトのディープコピーを作成する
   * @returns {Object} コピーされたJSONオブジェクト
   * @throws {Error} JSONオブジェクトが存在しない場合
   * @example
   * const json = new jsonjs({name: "metro", nested: {value: 1}});
   * const copy = json.deepClone();
   * copy.nested.value = 2;
   * json.get("nested").value; // 1
   */
  deepClone() {
    if (!this.targetJson) {
      throw new Error("JSONオブジェクトが存在しません");
    }
    return JSON.parse(JSON.stringify(this.targetJson));
  }

  /**
   * JSONオブジェクトを深くマージする
   * @param {Object} json - マージするJSONオブジェクト
   * @returns {Object} マージされたJSONオブジェクト
   * @throws {Error} マージするJSONオブジェクトが指定されていない場合
   * @example
   * const json = new jsonjs({name: "metro", nested: {value: 1}});
   * const merged = json.deepMerge({nested: {newValue: 2}});
   * merged.nested; // {value: 1, newValue: 2}
   */
  deepMerge(json) {
    if (!json || typeof json !== "object") {
      throw new Error("マージするJSONオブジェクトが指定されていません");
    }
    const result = { ...this.targetJson };
    for (const key in json) {
      if (Object.hasOwn(json, key)) {
        if (
          typeof json[key] === "object" &&
          json[key] !== null &&
          typeof result[key] === "object" &&
          result[key] !== null
        ) {
          result[key] = { ...result[key], ...json[key] };
        } else {
          result[key] = json[key];
        }
      }
    }
    return result;
  }

  /**
   * JSONオブジェクトが等しいか比較する
   * @param {Object} json - 比較するJSONオブジェクト
   * @returns {boolean} 等しい場合はtrue
   * @throws {Error} 比較するJSONオブジェクトが指定されていない場合
   * @example
   * const json1 = new jsonjs({name: "metro"});
   * const json2 = new jsonjs({name: "metro"});
   * json1.equals(json2.getTargetJson()); // true
   */
  equals(json) {
    if (!json || typeof json !== "object") {
      throw new Error("比較するJSONオブジェクトが指定されていません");
    }
    return JSON.stringify(this.targetJson) === JSON.stringify(json);
  }

  /**
   * JSONオブジェクトが空かどうか確認する
   * @returns {boolean} 空の場合はtrue
   * @example
   * const json = new jsonjs({});
   * json.isEmpty(); // true
   * json.set("name", "metro");
   * json.isEmpty(); // false
   */
  isEmpty() {
    if (!this.targetJson) {
      return true;
    }
    return Object.keys(this.targetJson).length === 0;
  }

  /**
   * 指定したキーの値を文字列として取得する
   * @param {string} key - キー
   * @param {string} separator - 配列の場合の区切り文字
   * @returns {string|null} 文字列化された値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({name: "metro", numbers: [1, 2, 3]});
   * json.getValueAsString("name"); // "metro"
   * json.getValueAsString("numbers"); // "1,2,3"
   * json.getValueAsString("numbers", "|"); // "1|2|3"
   */
  getValueAsString(key, separator = ",") {
    if (!key) {
      throw new Error("キーが指定されていません");
    }
    if (this.hasOwn(key)) {
      const value = this.targetJson[key];
      if (value === null || value === undefined) {
        return null;
      }
      if (Array.isArray(value)) {
        return value.join(separator);
      }
      return String(value);
    }
    return null;
  }

  /**
   * 指定したキーの値を数値として取得する
   * @param {string} key - キー
   * @returns {number|undefined} 数値化された値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({count: "42", active: true});
   * json.getValueAsNumber("count"); // 42
   * json.getValueAsNumber("active"); // 1
   */
  getValueAsNumber(key) {
    if (!key) throw new Error("キーが指定されていません");
    const value = this.get(key);
    if (value === null || value === undefined) return undefined;
    const num = Number(value);
    if (isNaN(num)) throw new Error("数値に変換できない値です");
    return num;
  }

  /**
   * 指定したキーの値を真偽値として取得する
   * @param {string} key - キー
   * @returns {boolean|undefined} 真偽値化された値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({active: "true", enabled: 1});
   * json.getValueAsBoolean("active"); // true
   * json.getValueAsBoolean("enabled"); // true
   */
  getValueAsBoolean(key) {
    if (!key) {
      throw new Error("キーが指定されていません");
    }
    if (this.hasOwn(key)) {
      const value = this.targetJson[key];
      if (value === null || value === undefined) {
        return undefined;
      }
      return Boolean(value);
    }
    return undefined;
  }

  /**
   * 指定したキーの値を日付として取得する
   * @param {string} key - キー
   * @returns {Date|undefined} 日付化された値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({date: "2024-01-01"});
   * json.getValueAsDate("date"); // Date object
   */
  getValueAsDate(key) {
    if (!key) throw new Error("キーが指定されていません");
    const value = this.get(key);
    if (value === null || value === undefined) return undefined;
    const date = new Date(value);
    if (isNaN(date.getTime())) throw new Error("日付に変換できない値です");
    return date;
  }

  /**
   * 指定したキーの値を配列として取得する
   * @param {string} key - キー
   * @returns {Array|undefined} 配列化された値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({tags: "tag1,tag2,tag3"});
   * json.getValueAsArray("tags"); // ["tag1", "tag2", "tag3"]
   */
  getValueAsArray(key) {
    if (!key) throw new Error("キーが指定されていません");
    const value = this.get(key);
    if (value === null || value === undefined) return [];
    return Array.isArray(value) ? value : [];
  }

  /**
   * 指定したキーの値をオブジェクトとして取得する
   * @param {string} key - キー
   * @returns {Object|undefined} オブジェクト化された値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({config: {theme: "dark"}});
   * json.getValueAsObject("config"); // {theme: "dark"}
   */
  getValueAsObject(key) {
    if (!key) throw new Error("キーが指定されていません");
    const value = this.get(key);
    if (value === null || value === undefined) return {};
    return typeof value === "object" && value !== null ? value : {};
  }

  /**
   * 指定したキーの値をJSON文字列として取得する
   * @param {string} key - キー
   * @returns {string|undefined} JSON文字列化された値
   * @throws {Error} キーが指定されていない場合
   * @example
   * const json = new jsonjs({data: {name: "metro"}});
   * json.getValueAsJson("data"); // '{"name":"metro"}'
   */
  getValueAsJson(key) {
    if (!key) throw new Error("キーが指定されていません");
    const value = this.get(key);
    if (value === null || value === undefined) return {};
    return typeof value === "object" && value !== null ? value : {};
  }
}
