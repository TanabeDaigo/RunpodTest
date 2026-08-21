/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Abstract Base Class                              ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   コントローラーの基底クラスを提供する                        ║
 * ║   抽象基底クラス                                              ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはコントローラーの基底クラスを定義します。
 * 主な機能：
 * - リクエスト処理の基本実装
 * - トランザクション管理
 * - モジュール依存性の注入
 * - 共通ユーティリティメソッド
 *
 * @file AbstractObject.js
 * @module server/abstract/AbstractObject
 */

import logjs from "@metrojs/logjs";
import utils from "@metrojs/utils";

const log = new logjs("Abstract");

/**
 * コントローラーの基底クラス
 * すべてのコントローラーはこのクラスを継承します
 */
export default class AbstractObject {
  /**
   * コンストラクタ
   * 環境変数とデフォルト値の初期化を行います
   */
  constructor() {
    // 環境変数の読み込みを安全に行う
    this.ENVIRONMENT = typeof process !== "undefined" && process.env ? process.env.NODE_ENV : "development";
    this.DEFAULT_LIMIT = 100;
  }

  /**
   * リクエストを実行し、トランザクションを管理します
   *
   * @async
   * @param {Request} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Promise<Object>} 処理結果
   */
  async execute(req, dbjs) {
    log.debug("execute ---------");
    log.debug("execute - リクエスト開始", {
      url: req.url,
      method: req.method,
      hasDbjs: !!dbjs,
      hasContainer: !!globalThis.container,
    });

    this.req = req;
    this.dbjs = dbjs;
    this.container = globalThis.container;

    try {
      log.debug("execute - リクエストボディを解析中");

      // リクエストボディの存在確認
      const contentType = req.headers.get("content-type");
      log.debug("execute - Content-Type:", contentType);

      // リクエストボディが存在するかチェック
      const contentLength = req.headers.get("content-length");
      log.debug("execute - Content-Length:", contentLength);

      if (!contentLength || parseInt(contentLength) === 0) {
        log.warn("execute - リクエストボディが空です");
        this.params = {};
      } else {
        // リクエストボディを安全に解析
        try {
          this.params = await req.json();
          log.debug("execute - パラメータ取得成功", this.params);
        } catch (jsonError) {
          log.error("execute - JSON解析エラー", jsonError);
          log.error("execute - リクエストボディ:", await req.text());
          this.params = {};
        }
      }

      const is_mode = utils.hasOwn(this.params, "mode");
      log.debug("execute - モードチェック", { is_mode, mode: this.params.mode });

      if (is_mode == true) {
        /**
         * トランザクション処理の説明
         * 1. insert_、update_、delete_、save_ で始まるモードの場合、トランザクションを開始
         * 2. トランザクション内でエラーが発生した場合は、rollbackを実行
         * 3. トランザクションが正常に完了した場合は、commitを実行
         * 4. トランザクションを使用することで、複数のデータベース操作を1つの処理単位として実行
         *    途中でエラーが発生した場合は、すべての操作を取り消すことができる
         */
        const mode_prefixes = ["insert_", "update_", "delete_", "save_", "insert", "update", "delete", "save"];
        const is_valid_mode = mode_prefixes.some(prefix => this.params.mode.startsWith(prefix));
        log.debug("execute - トランザクションチェック", { is_valid_mode, mode: this.params.mode });

        if (is_valid_mode) {
          log.debug("execute - トランザクション開始");
          this.dbjs.startTransaction();
        }

        try {
          log.debug("execute - メソッド実行開始", { method: this.params.mode });
          const data = await this[this.params.mode](req, dbjs);
          //log.debug("execute - メソッド実行完了", { method: this.params.mode, data });

          if (is_valid_mode) {
            log.debug("execute - トランザクションコミット");
            await this.dbjs.commit();
          }
          return data;
        } catch (e) {
          log.error("execute - メソッド実行エラー", e);
          if (is_valid_mode) {
            log.debug("execute - トランザクションロールバック");
            await this.dbjs.rollback();
          }
          throw e;
        }
      }
      log.debug("execute - モードが見つかりません");
      return {};
    } catch (err) {
      log.error("execute - 全体的なエラー", err);
      log.error("execute - エラー詳細", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      throw err;
    }
  }

  /**
   * コンテナからモジュールを取得してインスタンスに設定します
   *
   * @async
   * @param {string[]} module_names - 取得するモジュール名の配列
   */
  async useModules(module_names = []) {
    try {
      for (const name of module_names) {
        if (this[name]) {
          continue;
        }
        this[name] = await this.getModule(name);
      }
    } catch (e) {
      log.error("useModules でエラーが発生しました。servers/index.jsを確認してください。");
      log.error(e);
      throw e;
    }
  }

  /**
   * コンテナからモジュールを取得します
   *
   * @param {string} name - 取得するモジュール名
   * @returns {Object} 取得したモジュールインスタンス
   */
  getModule(name) {
    try {
      log.debug(`getModule - モジュール取得開始: ${name}`);
      log.debug(`getModule - コンテナ存在確認: ${!!this.container}`);
      log.debug(`getModule - 環境: ${this.ENVIRONMENT}`);

      let mdl;

      if (this.ENVIRONMENT === "development") {
        // 開発環境: server/index.jsから直接クラスを取得してインスタンス化
        log.debug(`getModule - 開発環境: server/index.jsからクラスを取得中...`);
        const ModuleClass = this.container.resolve(name);
        log.debug(`getModule - 解決されたクラス:`, ModuleClass);
        log.debug(`getModule - クラスの型: ${typeof ModuleClass}`);
        log.debug(`getModule - コンストラクタ確認: ${typeof ModuleClass === "function"}`);

        if (typeof ModuleClass !== "function") {
          throw new Error(`ModuleClass is not a constructor. Type: ${typeof ModuleClass}`);
        }

        mdl = new ModuleClass();
        log.debug(`getModule - 開発環境: インスタンス作成完了`);
      } else {
        // 本番環境: 従来通りの動作（既存のインスタンスを取得）
        log.debug(`getModule - 本番環境: インスタンスを解決中...`);
        mdl = this.container.resolve(name);
        log.debug(`getModule - 本番環境: インスタンス解決完了`);
      }

      mdl.req = this.req;
      mdl.res = this.res;
      mdl.dbjs = this.dbjs;
      mdl.params = this.params;
      mdl.container = this.container;

      log.debug(`getModule - モジュール設定完了: ${name}`);
      return mdl;
    } catch (e) {
      log.error(`getModule - エラー発生: ${name}`);
      log.error("getModule name:" + name + " が登録さていません。servers/index.jsを確認してください。");
      log.error(e);
      // エラーを再スローして、呼び出し元で適切に処理できるようにする
      throw e;
    }
  }

  /**
   * 値が必須かどうかをチェックします
   *
   * @param {any} value - チェックする値
   * @returns {boolean} 必須の場合はtrue、そうでない場合はfalse
   */
  isRequired(value) {
    if (utils.isNull(value) == true) {
      return false;
    }
    if (value == "") {
      return false;
    }
    return true;
  }
}
