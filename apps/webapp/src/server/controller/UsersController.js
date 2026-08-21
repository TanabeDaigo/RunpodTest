/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Users Controller                                 ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   ユーザー管理機能を提供するコントローラー                    ║
 * ║   ユーザー情報管理モジュール                                  ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはユーザー管理機能を提供します。
 * 主な機能：
 * - ユーザー情報の検索・取得
 * - ユーザー情報の新規作成・更新・削除
 *
 * @file UsersController.js
 * @module server/controller/UsersController
 */

import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs } from "@lib/server";

const log = new logjs("UsersController");

/**
 * ユーザー管理機能を提供するコントローラー
 * @extends Abstract
 */
@injectable()
class UsersController extends Abstract {
  /**
   * コンストラクタ
   * 親クラスのコンストラクタを呼び出します
   */
  constructor() {
    super();
    log.debug("constructor START!!");
  }

  /**
   * ユーザーの検索処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 検索結果またはエラー情報
   */
  async find(req, dbjs) {
    log.debug("find");
    // UsersDaoモジュールを使用可能にする
    await this.useModules(["UsersDao"]);
    try {
      // パラメータを使用してユーザーを検索
      const _params = {
        ...this.params,
        auto_where: {
          user_id__equal: this.params.user_id,
          login_id__like_before: this.params.login_id,
          last_name__like_before: this.params.last_name,
          user_name__like_before: this.params.user_name,
        },
      };
      const result = await this.UsersDao.find(_params);
      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * ユーザーの1件取得処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 取得結果またはエラー情報
   */
  async get_one(req, dbjs) {
    log.debug("get_one", this.params);
    await this.useModules(["UsersDao"]);
    try {
      const { user_id } = this.params;
      const result = await this.UsersDao.findByPk({ user_id: user_id });
      log.debug("get_one result", result);

      return { data: result, result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * ユーザーの新規保存処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 保存結果またはエラー情報
   */
  async save(req, dbjs) {
    log.debug("save", this.params);
    await this.useModules(["UsersDao"]);
    const {
      login_id,
      password,
      last_name,
      user_name,
      katakana_last_name,
      katakana_name,
      mail1,
      mail2,
      mail3,
      sex,
      date_of_birth,
      post_first_no,
      post_last_no,
      province_id,
      address1,
      address2,
      address3,
      nearest_station,
      birthplace,
      nationality,
      official_position,
      department,
      organization,
      blood_type,
      auth,
      status,
      comments,
    } = this.params;

    try {
      const result = await this.UsersDao.insert({
        login_id: login_id,
        password: password,
        last_name: last_name,
        user_name: user_name,
        katakana_last_name: katakana_last_name,
        katakana_name: katakana_name,
        mail1: mail1 || "",
        mail2: mail2 || "",
        mail3: mail3 || "",
        sex: sex,
        date_of_birth: date_of_birth,
        post_first_no: post_first_no || "",
        post_last_no: post_last_no || "",
        province_id: province_id,
        address1: address1 || "",
        address2: address2 || "",
        address3: address3 || "",
        nearest_station: nearest_station || "",
        birthplace: birthplace || "",
        nationality: nationality || "",
        official_position: official_position || "",
        department: department || "",
        organization: organization || "",
        blood_type: blood_type || 1,
        auth: auth,
        comments: comments || "",
      });
      log.debug("UsersDao.insert result", result);

      // 挿入されたレコードのIDを取得
      const lastID = await this.UsersDao.getLastInsertId();
      log.debug("insert lastID", lastID);
      return { result: true, lastID: lastID };
    } catch (e) {
      log.error(e);
      return { result: false, error: e.message };
    }
  }

  /**
   * ユーザーの更新処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 更新結果またはエラー情報
   */
  async update(req, dbjs) {
    log.debug("update");
    const {
      user_id,
      login_id,
      password,
      last_name,
      user_name,
      katakana_last_name,
      katakana_name,
      mail1,
      mail2,
      mail3,
      sex,
      date_of_birth,
      post_first_no,
      post_last_no,
      province_id,
      address1,
      address2,
      address3,
      nearest_station,
      birthplace,
      nationality,
      official_position,
      department,
      organization,
      blood_type,
      auth,
      status,
      comments,
    } = this.params;

    await this.useModules(["UsersDao"]);

    try {
      const result = await this.UsersDao.autoUpdate(
        { user_id: user_id },
        {
          login_id: login_id,
          password: password,
          last_name: last_name,
          user_name: user_name,
          katakana_last_name: katakana_last_name,
          katakana_name: katakana_name,
          mail1: mail1 || "",
          mail2: mail2 || "",
          mail3: mail3 || "",
          sex: sex,
          date_of_birth: date_of_birth,
          post_first_no: post_first_no,
          post_last_no: post_last_no,
          province_id: province_id,
          address1: address1 || "",
          address2: address2 || "",
          address3: address3 || "",
          nearest_station: nearest_station || "",
          birthplace: birthplace || "",
          nationality: nationality || "",
          official_position: official_position || "",
          department: department || "",
          organization: organization || "",
          blood_type: blood_type || 1,
          auth: auth,
          comments: comments || "",
        }
      );

      log.debug("update result", result);

      return { message: "更新しました", result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }

  /**
   * ユーザーの削除処理
   * @param {Object} req - リクエストオブジェクト
   * @param {Object} dbjs - データベース操作オブジェクト
   * @returns {Object} 削除結果またはエラー情報
   */
  async delete(req, dbjs) {
    log.debug("delete", this.params);
    await this.useModules(["UsersDao"]);
    const { user_id } = this.params;
    try {
      const result = await this.UsersDao.delete({ user_id: user_id });
      log.debug("delete result", result);
      return { message: "削除しました", result: true };
    } catch (e) {
      log.error(e);
      return { error: e.message, result: false };
    }
  }
}

export default UsersController;
