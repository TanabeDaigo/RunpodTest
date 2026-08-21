/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Logging Module                                   ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive logging utility that provides              ║
 * ║   colorful and structured console output for debugging       ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file logjs.js
 * @description MetroJSのログ出力モジュール
 *
 * 主な機能:
 * - カラー付きのログ出力
 * - モジュール別のログ管理
 * - 開発環境でのデバッグ出力
 * - 構造化されたログフォーマット
 *
 * @example
 * // ロガーの初期化
 * const log = new logjs("app");
 *
 * // 各種ログの出力
 * log.debug("デバッグ情報", {user: "test"});
 * log.info("情報メッセージ");
 * log.warn("警告メッセージ");
 * log.error("エラーメッセージ");
 *
 * // テーブル形式での出力
 * log.table("データ一覧", [
 *   {id: 1, name: "John"},
 *   {id: 2, name: "Jane"}
 * ]);
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import dayjs from "@krono-metro/metrojs/dayjs";

// ANSIカラーコードを定数として定義
const COLORS = {
  BLACK: isDevelopment() ? "\x1b[30m" :"",
  RED: isDevelopment() ? "\x1b[31m" : "",
  GREEN: isDevelopment() ? "\x1b[32m" : "",
  BLUE: isDevelopment() ? "\x1b[34m" : "",
  WHITE: isDevelopment() ? "\x1b[37m" : "",
  RESET: isDevelopment() ? "\x1b[0m" : "",
  PINK: isDevelopment() ? "\x1b[35m" : "",
  DEBUG: isDevelopment()? "\x1b[38;2;50;133;168m" : "",
  ERROR: isDevelopment() ? "\x1b[38;2;250;1;1m" : "",
  INFO: isDevelopment() ? "\x1b[38;2;2;250;151m" : "",
  WARN: isDevelopment() ? "\x1b[38;2;242;129;29m" : "",
};
 
/**
 * 開発環境かどうかを判定する関数
 * @returns {boolean} 開発環境の場合はtrue
 */
function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * テスト環境かどうかを判定する関数
 * @returns {boolean} テスト環境の場合はtrue
 */
function isTest() {
  return process.env.NODE_ENV === "test";
}

/**
 * ログ出力を管理するクラス
 * @class logjs
 * @description モジュール別のログ出力を管理し、カラー付きの構造化されたログを提供します
 */
export class logjs {
  /**
   * @param {string} name - ログのモジュール名
   * @description 新しいロガーインスタンスを作成します
   * @example
   * const log = new logjs("user-service");
   */
  constructor(name) {
    this.module_name = name;
    // モジュール名を含むフォーマットを事前に生成
    this._moduleFormat = `[${this.module_name}] - `;
  }

  /**
   * デフォルトのログフォーマットを生成する
   * @param {string} status - ログのステータス（DEBUG, ERROR, INFO, WARNING）
   * @returns {string} フォーマットされたログ文字列
   * @description タイムスタンプ、ステータス、モジュール名を含む標準的なログフォーマットを生成します
   * @example
   * const log = new logjs("app");
   * const formatted = log.default_format("INFO");
   * // [2024/01/01 12:00:00] INFO [app] -
   */
  default_format(status) {
    return `[${dayjs().format("YYYY/MM/DD HH:mm:ss")}] ${status}${COLORS.RESET} ${this._moduleFormat}`;
  }

  /**
   * デバッグログを出力する（開発環境のみ）
   * @param {string} s - ログメッセージ
   * @param {*} [arr] - 追加のデータ（オプション）
   * @description 開発環境でのみデバッグ情報を出力します
   * @example
   * const log = new logjs("app");
   * log.debug("デバッグ情報", {user: "test", action: "login"});
   */
  debug(s, arr) {
    if (!isDevelopment()) return;

    try {
      console.log(`${this.default_format(COLORS.BLUE + "DEBUG")} ${COLORS.DEBUG}${s}${COLORS.RESET}`);
      if (arr) console.dir(arr);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * エラーログを出力する
   * @param {string} s - エラーメッセージ
   * @param {*} [arr] - 追加のエラー情報（オプション）
   * @description エラー情報を出力し、開発環境の場合はプロセスを終了します
   * @example
   * const log = new logjs("app");
   * log.error("データベース接続エラー", {code: "DB001", message: "接続タイムアウト"});
   */
  error(s, arr) {
    try {
      console.error(`${this.default_format(COLORS.RED + "ERROR")} ${COLORS.ERROR}${s}${COLORS.RESET}`);
      if (arr) console.dir(arr);
      console.trace();
      if (isDevelopment() && !isTest()) {
        //process.exit(1);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * テーブル形式でログを出力する
   * @param {string} s - ログメッセージ
   * @param {Array|Object} arr - テーブルデータ
   * @description 開発環境でのみデータをテーブル形式で出力します
   * @example
   * const log = new logjs("app");
   * log.table("ユーザー一覧", [
   *   {id: 1, name: "John"},
   *   {id: 2, name: "Jane"}
   * ]);
   */
  table(s, arr) {
    //if (isDevelopment()) {
    this.info(s);
    console.table(arr);
    //}
  }

  /**
   * 情報ログを出力する
   * @param {string} s - ログメッセージ
   * @param {*} [arr] - 追加の情報（オプション）
   * @description 一般的な情報メッセージを出力します
   * @example
   * const log = new logjs("app");
   * log.info("ユーザーがログインしました", {userId: "123", timestamp: "2024-01-01"});
   */
  info(s, arr) {
    try {
      console.info(`${this.default_format(COLORS.GREEN + "INFO")} ${COLORS.INFO}${s}${COLORS.RESET}`);
      if (arr) console.dir(arr);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * 警告ログを出力する
   * @param {string} s - 警告メッセージ
   * @param {*} [arr] - 追加の警告情報（オプション）
   * @description 警告メッセージを出力します
   * @example
   * const log = new logjs("app");
   * log.warn("メモリ使用量が高くなっています", {usage: "85%", threshold: "80%"});
   */
  warn(s, arr) {
    try {
      console.warn(`${this.default_format(COLORS.PINK + "WARNING")} ${COLORS.WARN}${s}${COLORS.RESET}`);
      if (arr) console.dir(arr);
    } catch (e) {
      console.error(e);
    }
  }
}

export default logjs;
