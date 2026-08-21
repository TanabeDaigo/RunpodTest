/**
 *
 * KronoMetro
 *
 * Copyright © 2024-present KronoMetro, Co. All rights reserved.
 *
 */
import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs, models } from "@lib/server";

const log = new logjs("ProjectsController");

/**
 * プロジェクト管理用のコントローラークラス
 * プロジェクトの検索、保存、更新などの操作を管理
 */
@injectable()
class ProjectsController extends Abstract {
  constructor() {
    super();
    log.debug("constructor START!!");
  }

  /**
   * プロジェクトの検索処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 検索結果またはエラー情報
   */
  async find(req, dbjs) {
    log.debug("find");
    // ProjectsDaoモジュールを使用可能にする
    await this.useModules(["ProjectsDao"]);
    try {
      // パラメータを使用してプロジェクトを検索
      const _params = {
        ...this.params,
        auto_where: {
          project_id__equal: this.params.project_id,
          project_name__like_before: this.params.project_name,
        },
      };
      const result = await this.ProjectsDao.find(_params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  async get_one(req, dbjs) {
    log.debug("get_one", this.params);
    await this.useModules(["ProjectsDao"]);
    try {
      const { project_id } = this.params;
      const result = await this.ProjectsDao.findByPk({ project_id: project_id });
      log.debug("get_one result", result);

      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * プロジェクトの新規保存処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 保存結果またはエラー情報
   */
  async save(req, dbjs) {
    log.debug("save", this.params);
    await this.useModules(["ProjectsDao"]);
    const { project_name, dbms_id, db_name, db_user, db_pass, db_port, db_server, db_encoding, comments } = this.params;
    try {
      const result = await this.ProjectsDao.insert({
        project_name: project_name, // プロジェクト名
        db_name: db_name, // データベース名
        db_user: db_user, // データベースユーザー
        db_pass: db_pass, // データベースパスワード
        db_port: db_port, // データベースポート
        db_server: db_server, // データベースサーバー
        dbms_id: dbms_id, // データベース管理システム
        db_encoding: db_encoding, // データベース文字コード
        comments: comments, // コメント
      });
      log.debug("ProjectsDao.insert result", result);

      // 挿入されたレコードのIDを取得
      const lastID = await this.ProjectsDao.getLastInsertId();
      log.debug("insert lastID", lastID);
      return { result: true, lastID: lastID };
    } catch (e) {
      log.error(e);
      return { result: false, error: e.message };
    }
  }

  /**
   * プロジェクトの更新処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 更新結果またはエラー情報
   */
  async update(req, dbjs) {
    log.debug(" update");
    const { project_id, project_name, dbms_id, db_name, db_user, db_pass, db_port, db_server, db_encoding, comments } = this.params;

    await this.useModules(["ProjectsDao"]);

    try {
      const result = await this.ProjectsDao.autoUpdate(
        { project_id: project_id },
        {
          project_name: project_name,
          dbms_id: dbms_id,
          db_name: db_name,
          db_user: db_user,
          db_pass: db_pass,
          db_port: db_port,
          db_server: db_server,
          db_encoding: db_encoding,
          comments: comments,
        }
      );

      log.debug("update result", result);

      return { message: "更新しました", result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  async delete(req, dbjs) {
    log.debug("delete", this.params);
    await this.useModules(["ProjectsDao"]);
    const { project_id } = this.params;
    try {
      const result = await this.ProjectsDao.delete({ project_id: project_id });
      log.debug("delete result", result);
      return { message: "削除しました", result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }
}

export default ProjectsController;
