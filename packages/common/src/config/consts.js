/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Configuration Constants                          ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   MetroJSの設定定数を定義するファイル                         ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはMetroJSの設定定数を定義します。
 * アプリケーション全体で使用される共通の定数を管理します。
 *
 * @file consts.js
 * @module config/consts
 */

/**
 * MetroJSの基本情報
 * @type {Object}
 */
const Consts = {
  /**
   * プロジェクト名
   * @type {string}
   */
  NAME: "MetroJS",
  APP_NAME: "MetroJs",
  /**
   * プロジェクトの説明
   * @type {string}
   */
  DESCRIPTION: "Metro Digital Solutionsのフロントエンドフレームワーク",

  /**
   * 著作権情報
   * @type {string}
   */
  COPYRIGHT: "Copyright (c) 2024 Metro Digital Solutions",

  /**
   * プロジェクトのバージョン
   * @type {string}
   */
  VERSION: "1.0.0",

  /**
   * プロジェクトのURL
   * @type {string}
   */
  URL: "https://metrojs.metro-digital.com",

  /**
   * プロジェクトのリポジトリURL
   * @type {string}
   */
  REPOSITORY: "https://github.com/metro-digital/metrojs",

  /**
   * データベースカラム名の設定
   * プロジェクトごとに設定が必要なカラム名
   * @type {Object}
   */
  DB_COLUMNS: {
    /**
     * 登録者カラム名
     * プロジェクトによって異なる場合があります
     * 例: regist_user_id, registuser, created_by など
     * @type {string}
     */
    REGIST_USER: "regist_user",

    /**
     * 更新者カラム名
     * プロジェクトによって異なる場合があります
     * 例: update_user_id, updateuser, updated_by など
     * @type {string}
     */
    UPDATE_USER: "update_user",

    /**
     * 登録日時カラム名
     * プロジェクトによって異なる場合があります
     * 例: created_at, regist_datetime, created_date など
     * @type {string}
     */
    REGIST_DATETIME: "created_at",

    /**
     * 更新日時カラム名
     * プロジェクトによって異なる場合があります
     * 例: updated_at, update_datetime, updated_date など
     * @type {string}
     */
    UPDATE_DATETIME: "updated_at",
  },

  /**
   * アプリケーションのルートパス設定
   * @type {Object}
   */
  ROUTES: {
    /**
     * ホームページのパス
     * @type {string}
     */
    HOME: "/dashboard",
  },
};
export default Consts;
