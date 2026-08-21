/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - API Communication Module                          ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A powerful and flexible API communication module that       ║
 * ║   provides seamless integration with backend services         ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file apijs.js
 * @description MetroJSのAPI通信モジュール
 *
 * 主な機能:
 * - RESTful APIリクエストの送信
 * - 自動的なURL生成とSSL対応
 * - エラーハンドリングとログ出力
 * - JSONデータの自動シリアライズ/デシリアライズ
 *
 * @example
 * // APIクライアントの初期化
 * const api = new apijs('users');
 *
 * // POSTリクエストの送信
 * const response = await api.post({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import logjs from "@krono-metro/metrojs/logjs";

// ログ出力用のインスタンスを作成
const log = new logjs("apijs");

/**
 * APIリクエストを行うためのクラス
 * @class apijs
 * @description API通信を管理するクラス。エンドポイントごとにインスタンスを作成して使用します。
 */
export default class apijs {
  /**
   * @param {string} name - APIのエンドポイント名
   * @description 新しいAPIクライアントインスタンスを作成します。
   * @example
   * const api = new apijs('users');
   */
  constructor(name) {
    // コンストラクタ
    this.module_name = name;
    // Content-Typeヘッダーを設定
    this.headers = new Headers({ "Content-Type": "application/json" });
    /*
    this.headers = {
      'Content-Type': 'application/json'
    }
      */

    // URLを生成
    this.url = this.get_url(name);
  }

  /**
   * URLを設定する
   * @param {string} url - 設定するURL
   * @description APIエンドポイントのURLを手動で設定します。
   * @example
   * api.set_url('https://api.example.com/users');
   */
  set_url(url) {
    this.url = url;
  }

  /**
   * APIのURLを生成する
   * @param {string} name - APIのエンドポイント名
   * @returns {string|null} 生成されたURL、またはnull
   * @description 現在のホストとエンドポイント名から完全なURLを生成します。
   * SSLの場合は443ポートを使用します。
   * @example
   * const url = api.get_url('users');
   * // 結果: 'https://example.com:443/users' または 'http://example.com/users'
   */
  get_url(name) {
    // ブラウザ環境かどうかをチェック
    if (typeof window !== "undefined") {
      let host = window.location.origin;
      let isSSL = host.indexOf("https://") == 0;
      // SSLの場合は443ポートを使用
      if (isSSL == true) {
        return host + `:443/${name}`;
      } else {
        return host + `/${name}`;
      }
    } else {
      return null;
    }
  }

  /**
   * POSTリクエストを実行する
   * @param {Object} params - リクエストパラメータ
   * @returns {Promise<Object>} レスポンスのJSONデータ
   * @description 指定されたパラメータでPOSTリクエストを送信し、レスポンスをJSONとして返します。
   * エラーが発生した場合はログに記録されます。
   * @example
   * const response = await api.post({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   * });
   */
  async post(params = {}) {
    // リクエストURLとパラメータをログ出力
    log.debug(`post url:${this.url}`, params);

    try {
      log.debug(`params`, params);
      // fetchを使用してPOSTリクエストを実行
      const res = await fetch(this.url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(params),
      });
      //log.debug(`res`, res);
      // レスポンスのステータスチェック
      if (res.ok == false) {
        throw new Error(`API ERROR url:${this.url}`);
      }

      log.debug(`res`, res);

      // レスポンスをJSONとしてパース
      let json = await res.json();
      log.debug(`res.json`, json);
      //return JSON.parse(json);
      return json;
    } catch (err) {
      // エラー発生時のログ出力
      log.error(`API ERROR url:${this.url}`, err);
    }
  }
}
