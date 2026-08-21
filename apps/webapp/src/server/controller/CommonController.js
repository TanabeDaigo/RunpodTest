/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Common Controller                                 ║
 * ║   Copyright (c) 2025 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   共通処理を管理するコントローラー                               ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルは共通処理を管理します。
 * 主な機能：
 * - 初期データの取得
 *
 * @file CommonController.js
 * @module server/controller/CommonController
 */

import "reflect-metadata";
import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs, sqljs } from "@lib/server";

const log = new logjs("CommonController");

/**
 * ログイン処理を管理するコントローラー
 * @extends Abstract
 */
@injectable()
class CommonController extends Abstract {
  /**
   * コンストラクタ
   * 親クラスのコンストラクタを呼び出します
   */
  constructor() {
    super();
  }

  async get_init_data(req, dbjs) {
    log.debug("CommonController get_init_data");

    try {
      log.debug("get_init_data - データベース接続確認");
      if (!dbjs) {
        throw new Error("データベース接続が利用できません");
      }

      const projects = await dbjs.select(` select * from projects where is_deleted = false order by project_id;`, []);

      const dbms = await dbjs.select(` select * from dbms where is_deleted = false order by dbms_id;`, []);
      // データをJSON文字列に変換してから返す
      const result = {
        projects,
        dbms,
      };

      //log.debug("get_init_data - 結果を返却", result);
      return result;
    } catch (e) {
      log.error("get_init_data error:", e);
      log.error("get_init_data error details:", {
        message: e.message,
        stack: e.stack,
        name: e.name,
        dbjs: !!dbjs,
        req: !!req,
      });
      return {
        projects: [],
        error: e.message,
      };
    }
  }
}

export default CommonController;
