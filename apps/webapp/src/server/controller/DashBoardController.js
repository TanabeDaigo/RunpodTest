/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Dashboard Controller                             ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   ダッシュボード機能を管理するコントローラー                  ║
 * ║   ユーザー情報管理モジュール                                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはダッシュボード機能を管理します。
 * 主な機能：
 * - ユーザー情報の取得
 * - セッション管理
 * - テスト機能の提供
 *
 * @file DashBoardController.js
 * @module server/controller/DashBoardController
 */

import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs } from "@lib/server";

const log = new logjs("DashBoardController");

/**
 * ダッシュボード機能を管理するコントローラー
 * @extends Abstract
 */
@injectable()
class DashBoardController extends Abstract {
  /**
   * コンストラクタ
   * 親クラスのコンストラクタを呼び出します
   */
  constructor() {
    log.debug("DashBoardController constructor START!!");
    super();
  }

  /**
   * テスト機能を実行します
   *
   * @async
   * @param {Request} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Promise<Object>} ユーザー情報
   */
  async handle_test(req, dbjs) {
    log.debug("DashBoardController handle_test");

    log.debug(`params`, this.params);
    log.debug(`session`, this.req.session);

    const result = await this.dbjs.selectOne(
      " select * from tm0030_user_info where tm0030_user_id = ? ",
      ["okapiso27"]
    );

    return { result };
  }
}

export default DashBoardController;
