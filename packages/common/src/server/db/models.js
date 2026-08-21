/**
 * @file models.js
 * @description データベースモデルの基本クラス
 *
 * このモジュールは、データベーステーブル操作のための
 * 基本機能を提供するモデルクラスを定義します。
 *
 * 主な機能：
 * - テーブルの存在確認
 * - データの挿入（INSERT）
 * - データの更新（UPDATE）
 * - データの削除（DELETE）
 * - スキーマ情報の取得
 * - プライマリーキーの管理
 * - 自動的な登録者/更新者情報の付与
 * - 自動的なタイムスタンプの付与
 *
 * @example
 * // 基本的な使用方法
 * const model = new models('users', dbjs, req.session);
 *
 * // データの挿入
 * await model.insert({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 *
 * // データの更新
 * await model.update({
 *   id: 1,
 *   name: 'Jane Doe'
 * });
 *
 * // データの削除
 * await model.delete({ id: 1 });
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import { schema as db_schema } from "./schema/db_schema.js";
import utils from "@metrojs/utils";
import logjs from "@metrojs/logjs";
import Consts from "../../config/consts.js";

const log = new logjs("models");
/**
 * データベースモデルクラス
 * テーブル操作の基本機能を提供します
 *
 * @param {string} table - 操作対象のテーブル名
 * @param {Object} dbjs - データベース操作インスタンス
 * @param {Object} [session=null] - セッション情報
 *
 * @example
 * // 基本的な初期化
 * const model = new models('users', dbjs);
 *
 * // セッション情報付きでの初期化
 * const model = new models('users', dbjs, req.session);
 */
export default class models {
  constructor(table, dbjs, session = null) {
    this.table = table;
    this.dbjs = dbjs;

    this.session_save_user_data = session?.user?.user_name;

    // プロジェクトごとに設定が必要なカラム名
    // 登録者・更新者のカラム名はプロジェクトによって異なる場合があります
    // 例: regist_user_id, registuser, created_by など
    this.regist_user_column_name = Consts.DB_COLUMNS.REGIST_USER;
    this.update_user_column_name = Consts.DB_COLUMNS.UPDATE_USER;

    // 登録日時・更新日時のカラム名もプロジェクトによって異なる場合があります
    // 例: created_at, regist_datetime, created_date など
    this.regist_datetime_column_name = Consts.DB_COLUMNS.REGIST_DATETIME;
    this.update_datetime_column_name = Consts.DB_COLUMNS.UPDATE_DATETIME;
  }

  /**
   * テーブルのプライマリーキーを取得します
   *
   * @returns {string|undefined} プライマリーキーのカラム名
   *
   * @example
   * const primaryKey = model.getPrimaryKey();
   * if (primaryKey) {
   *   console.log(`プライマリーキー: ${primaryKey}`);
   * }
   */
  getPrimaryKey() {
    log.debug(`getPrimaryKey this.table:${this.table}`);
    return Object.entries(db_schema[this.table]).find(([, value]) => value.is_primary_key)?.[0];
  }

  /**
   * テーブルのプライマリーキー（複合対応）を配列で取得します
   * @returns {string[]} プライマリーキーのカラム名配列（未定義時は空配列）
   */
  getPrimaryKeys() {
    log.debug(`getPrimaryKeys this.table:${this.table}`);
    const schema = db_schema[this.table] || {};
    return Object.entries(schema)
      .filter(([, value]) => value && value.is_primary_key)
      .map(([key]) => key);
  }

  /**
   * テーブルのスキーマ情報を取得します
   *
   * @returns {Object} テーブルスキーマ
   *
   * @example
   * const schema = model.getSchema();
   * console.log('カラム一覧:', Object.keys(schema));
   * console.log('カラムの型情報:', schema.column_name.type);
   */
  getSchema() {
    log.debug(`getSchema this.table:${this.table}`);
    return db_schema[this.table];
  }

  /**
   * テーブルが存在するかチェックします
   *
   * @returns {boolean} テーブルが存在する場合はtrue
   *
   * @example
   * if (await model.isTableExists()) {
   *   console.log('テーブルが存在します');
   * } else {
   *   console.log('テーブルが存在しません');
   * }
   */
  isTableExists() {
    log.debug(`isTableExists this.table:${this.table}`);
    return Object.hasOwn(db_schema, this.table);
  }

  /**
   * テーブルにデータを挿入します
   * 自動的に登録者情報とタイムスタンプが付与されます
   *
   * @param {Object} data - 挿入するデータ
   * @returns {Promise} 挿入結果
   * @throws {Error} テーブルが存在しない場合
   * @throws {Error} プライマリーキーが指定されている場合
   *
   * @example
   * try {
   *   const result = await model.insert({
   *     name: 'John Doe',
   *     email: 'john@example.com'
   *   });
   *   console.log('挿入成功:', result);
   * } catch (error) {
   *   console.error('挿入失敗:', error.message);
   * }
   */
  async insert(data = {}) {
    const is_table_exists = await this.isTableExists();
    if (!is_table_exists) {
      throw new Error(`テーブル ${this.table} が存在しません。`);
    }

    const is_update_user_exists = Object.hasOwn(data, this.update_user_column_name);
    if (!is_update_user_exists) {
      data[this.update_user_column_name] = this.session_save_user_data;
    }

    const is_regist_user_exists = Object.hasOwn(data, this.regist_user_column_name);
    if (!is_regist_user_exists) {
      data[this.regist_user_column_name] = this.session_save_user_data;
    }

    const is_update_datetime_exists = Object.hasOwn(data, this.update_datetime_column_name);
    if (!is_update_datetime_exists) {
      data[this.update_datetime_column_name] = new Date();
    }

    const is_regist_datetime_exists = Object.hasOwn(data, this.regist_datetime_column_name);
    if (!is_regist_datetime_exists) {
      data[this.regist_datetime_column_name] = new Date();
    }

    const primary_key = this.getPrimaryKey();
    if (primary_key && Object.hasOwn(data, primary_key)) {
      throw new Error(`プライマリーキー ${primary_key} は自動生成されるため、挿入時に指定できません。`);
    }

    return await this.dbjs.insert(this.table, data);
  }

  /**
   * テーブルのデータを更新します
   * 自動的に更新者情報とタイムスタンプが付与されます
   *
   * @param {Object} data - 更新するデータ
   * @param {Object} [where] - WHERE条件（省略時はプライマリーキーで更新）
   * @returns {Promise} 更新結果
   * @throws {Error} テーブルが存在しない場合
   * @throws {Error} プライマリーキーが指定されていない場合（where省略時）
   *
   * @example
   * try {
   *   // プライマリーキーで更新
   *   const result = await model.update({
   *     id: 1,
   *     name: 'Jane Doe'
   *   });
   *   console.log('更新成功:', result);
   * } catch (error) {
   *   console.error('更新失敗:', error.message);
   * }
   *
   * // WHERE条件を明示的に指定
   * await model.update(
   *   { name: 'Jane Doe' },
   *   { id: 1 }
   * );
   */
  async update(data = {}, where = null) {
    log.debug(`update this.table:${this.table}`);
    log.debug(`テーブルが存在するかチェック`);
    const is_table_exists = await this.isTableExists();
    if (!is_table_exists) {
      throw new Error(`テーブル ${this.table} が存在しません。`);
    }

    // 更新者情報とタイムスタンプを自動付与
    const is_update_user_exists = Object.hasOwn(data, this.update_user_column_name);
    if (!is_update_user_exists) {
      log.debug(`データにupdate_userが存在しないので、session_save_user_dataを設定`);
      data[this.update_user_column_name] = this.session_save_user_data;
    }

    const is_update_datetime_exists = Object.hasOwn(data, this.update_datetime_column_name);
    if (!is_update_datetime_exists) {
      log.debug(`データにupdate_datetimeが存在しないので、new Date()を設定`);
      data[this.update_datetime_column_name] = new Date();
    }

    // WHERE条件の決定
    let where_condition = where;
    if (!where_condition) {
      // WHERE条件が指定されていない場合、プライマリーキーで更新
      const primary_key = this.getPrimaryKey();
      if (!primary_key) {
        throw new Error(`テーブル ${this.table} にプライマリーキーが定義されていません。WHERE条件を明示的に指定してください。`);
      }

      if (!Object.hasOwn(data, primary_key)) {
        throw new Error(`プライマリーキー ${primary_key} が指定されていません。`);
      }

      where_condition = { [primary_key]: data[primary_key] };
      // データからプライマリーキーを除去
      delete data[primary_key];
    }

    log.debug(`更新データ:`, data);
    log.debug(`WHERE条件:`, where_condition);
    return await this.dbjs.update(this.table, data, where_condition);
  }

  /**
   * テーブルからデータを削除します
   *
   * @param {Object} where - 削除条件
   * @returns {Promise} 削除結果
   * @throws {Error} テーブルが存在しない場合
   * @throws {Error} 削除条件が指定されていない場合
   *
   * @example
   * try {
   *   const result = await model.delete({ id: 1 });
   *   console.log('削除成功:', result);
   * } catch (error) {
   *   console.error('削除失敗:', error.message);
   * }
   */
  async delete(where = {}) {
    log.debug(`delete this.table:${this.table}`);
    log.debug(`テーブルが存在するかチェック`);
    const is_table_exists = await this.isTableExists();
    if (!is_table_exists) {
      throw new Error(`テーブル ${this.table} が存在しません。`);
    }

    if (!where || Object.keys(where).length === 0) {
      throw new Error(`削除条件が指定されていません。安全のため、WHERE条件は必須です。`);
    }

    log.debug(`削除条件:`, where);
    return await this.dbjs.delete(this.table, where);
  }

  /**
   * テーブルの全データを取得します
   *
   * @param {Object} [options] - 取得オプション
   * @param {string[]} [options.select] - 取得するカラム（省略時は全カラム）
   * @param {Object} [options.where] - WHERE条件
   * @param {string} [options.orderBy] - ORDER BY句
   * @param {number} [options.limit] - 取得件数制限
   * @returns {Promise<Array>} 取得したデータの配列
   *
   * @example
   * // 全データを取得
   * const allData = await model.findAll();
   *
   * // 条件付きで取得
   * const filteredData = await model.findAll({
   *   where: { status: 'active' },
   *   orderBy: 'created_at DESC',
   *   limit: 10
   * });
   */
  async findAll(options = {}) {
    log.debug(`findAll this.table:${this.table}`);
    log.debug(`テーブルが存在するかチェック`);
    const is_table_exists = await this.isTableExists();
    if (!is_table_exists) {
      throw new Error(`テーブル ${this.table} が存在しません。`);
    }

    const { select = ["*"], where = {}, orderBy, limit } = options;

    let sql = `SELECT ${Array.isArray(select) ? select.join(", ") : select} FROM ${this.table}`;
    const params = [];

    // WHERE条件の追加
    if (where && Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map((key) => {
          params.push(where[key]);
          return `${key} = ?`;
        })
        .join(" AND ");
      sql += ` WHERE ${whereClause}`;
    }

    // ORDER BY句の追加
    if (orderBy) {
      sql += ` ORDER BY ${orderBy}`;
    }

    // LIMIT句の追加
    if (limit) {
      sql += ` LIMIT ${limit}`;
    }

    log.debug(`実行SQL:`, sql);
    log.debug(`パラメータ:`, params);
    return await this.dbjs.select(sql, params);
  }

  /**
   * 条件に一致する1件のデータを取得します
   *
   * @param {Object} where - 検索条件
   * @param {Object} [options] - 取得オプション
   * @param {string[]} [options.select] - 取得するカラム（省略時は全カラム）
   * @returns {Promise<Object|null>} 取得したデータ（存在しない場合はnull）
   *
   * @example
   * const user = await model.findOne({ id: 1 });
   * if (user) {
   *   console.log('ユーザーが見つかりました:', user);
   * } else {
   *   console.log('ユーザーが見つかりませんでした');
   * }
   */
  async findOne(where = {}, options = {}) {
    log.debug(`findOne this.table:${this.table}`);
    log.debug(`テーブルが存在するかチェック`);
    const is_table_exists = await this.isTableExists();
    if (!is_table_exists) {
      throw new Error(`テーブル ${this.table} が存在しません。`);
    }

    const { select = ["*"] } = options;

    let sql = `SELECT ${Array.isArray(select) ? select.join(", ") : select} FROM ${this.table}`;
    const params = [];

    // WHERE条件の追加
    if (where && Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map((key) => {
          params.push(where[key]);
          return `${key} = ?`;
        })
        .join(" AND ");
      sql += ` WHERE ${whereClause}`;
    }

    sql += " LIMIT 1";

    log.debug(`実行SQL:`, sql);
    log.debug(`パラメータ:`, params);
    return await this.dbjs.selectOne(sql, params);
  }

  /**
   * 条件に一致するデータの件数を取得します
   *
   * @param {Object} [where] - 検索条件
   * @returns {Promise<number>} 件数
   *
   * @example
   * const count = await model.count({ status: 'active' });
   * console.log(`アクティブなレコード数: ${count}`);
   */
  async count(where = {}) {
    log.debug(`count this.table:${this.table}`);
    log.debug(`テーブルが存在するかチェック`);
    const is_table_exists = await this.isTableExists();
    if (!is_table_exists) {
      throw new Error(`テーブル ${this.table} が存在しません。`);
    }

    let sql = `SELECT COUNT(*) as count FROM ${this.table}`;
    const params = [];

    // WHERE条件の追加
    if (where && Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map((key) => {
          params.push(where[key]);
          return `${key} = ?`;
        })
        .join(" AND ");
      sql += ` WHERE ${whereClause}`;
    }

    log.debug(`実行SQL:`, sql);
    log.debug(`パラメータ:`, params);
    const result = await this.dbjs.selectOne(sql, params);
    return result ? result.count : 0;
  }
}
