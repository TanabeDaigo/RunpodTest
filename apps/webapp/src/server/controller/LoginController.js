/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Login Controller                                 ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   ユーザーログイン処理を管理するコントローラー                ║
 * ║   認証管理モジュール                                          ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはユーザーログイン処理を管理します。
 * 主な機能：
 * - セッション管理
 * - ユーザー認証
 * - アラート情報の更新
 * - セッションデータの取得
 *
 * @file LoginController.js
 * @module server/controller/LoginController
 */
import "reflect-metadata";
import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs } from "@lib/server";

const log = new logjs("LoginController");

/**
 * ログイン処理を管理するコントローラー
 * @extends Abstract
 */
@injectable()
class LoginController extends Abstract {
  /**
   * コンストラクタ
   * 親クラスのコンストラクタを呼び出します
   */
  constructor() {
    super();
  }

  /**
   * ログイン処理を実行します
   *
   * @async
   * @param {Request} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Promise<Object>} セッションユーザー情報
   */
  async exec(req, dbjs) {
    log.debug("LoginController exec");

    try {
      // セッションにユーザー情報を設定
      req.session.user = { name: "login" };

      // アラート情報の更新
      await dbjs.transaction(async function (tx) {
        await dbjs.update("update alerts set type = 4 where alert_id = ?", [1]);
      });

      // アラート情報の取得
      const data = await dbjs.selectOne(
        ` select * from alerts where alert_id = ?;`,
        [1]
      );

      log.debug("data", data);
      log.debug("req.session.user", req.session?.user);

      return req.session.user;
    } catch (e) {
      log.error(e);
    }
  }
}

export default LoginController;
