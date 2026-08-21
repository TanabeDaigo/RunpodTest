/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Database Operations Wrapper                      ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A high-level database operations wrapper that extends      ║
 * ║   SequelizeJS with enhanced features for data validation,    ║
 * ║   transaction management, and debugging capabilities         ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file dbjs.js
 * @description データベース操作ラッパークラス
 *
 * 主な機能:
 * - スキーマ情報に基づく自動バリデーション
 * - 検索、更新、削除、挿入操作の簡素化
 * - トランザクション管理の簡素化
 * - デバッグログの出力
 * - 開発環境と本番環境での異なる動作
 * - SQLJSとの連携
 * - CSV形式でのデータ出力
 *
 * @example
 * import dbjs from '@krono-metro/metrojs/server/dbjs';
 *
 * // データベース接続の初期化
 * const db = new dbjs(Sequelize, config, schema);
 * await db.connect();
 *
 * // データの検索
 * const result = await db.find('SELECT * FROM users WHERE age > ?', [20]);
 *
 * // トランザクション内での操作
 * await db.executeInTransaction(async (transaction) => {
 *   await db.insert('users', { name: 'John', age: 30 });
 *   await db.update('users', { age: 31 }, { name: 'John' });
 * });
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import logjs from "@krono-metro/metrojs/logjs";
import * as dbjs_utils from "./dbjs_utils.js";
import SequelizeJS from "./sequelizejs.js";
const log = new logjs("dbjs");

/**
 * データベース操作を行うクラス
 * @extends sequelizejs
 */
export default class dbjs extends SequelizeJS {
  /**
   * コンストラクタ
   * @param {Object} Sequelize - Sequelizeインスタンス
   * @param {Object} config - データベース設定
   * @param {Object} schema - テーブルスキーマ情報
   * @example
   * const db = new dbjs(Sequelize, config, schema);
   */
  constructor(Sequelize, config, schema = null) {
    super(Sequelize, config);
    this.schema = schema; // テーブルスキーマ情報を保持
    this.isDevelopment = process.env.NODE_ENV === "development"; // 開発環境かどうかを判定
    this.isSchemaValidation = this.isDevelopment && this.schema; // スキーマバリデーションを実行するかどうかを判定
  }

  /**
   * 複数のSQLクエリを順次実行し、結果を配列で返す
   * @param {Array<string>} sqlArray - SQL文の配列
   * @param {Array<Array>} paramsArray - パラメータの配列（各SQLに対応）
   * @returns {Array} 実行結果の配列（最初の要素は件数、2番目以降はデータ）
   * @example
   * const result = await db.find([
   *   "SELECT COUNT(*) AS count FROM users WHERE status = ?",
   *   "SELECT id, name, email FROM users WHERE status = ? LIMIT 10 OFFSET 0"
   * ], [
   *   [1],
   *   [1]
   * ]);
   * // result = [100, [{id: 1, name: "山田太郎", email: "yamada@example.com"}]]
   */
  async find(sqlArray, paramsArray = []) {
    log.debug("find", { sqlArray, paramsArray });

    const results = [];
    try {
      for (let i = 0; i < sqlArray.length; i++) {
        const sql = sqlArray[i];
        const params = paramsArray[i] || [];

        let data = null;
        if (i === 0) {
          data = await this.selectOne(sql, params);
          data = data?.count;
        } else {
          data = await this.select(sql, params);
        }
        results.push(data);
      }
      return results;
    } catch (err) {
      log.error(err);
    }
  }

  /**
   * SQLJSオブジェクトを使用して検索を実行する
   * @param {Object} _sqljs - SQLJSオブジェクト
   * @returns {Object} 件数と結果のオブジェクト
   * @example
   * const sqljs = new sqljs();
   * sqljs.from("users")
   *      .where("status = ?", [1]);
   * const result = await db.findSqljs(sqljs);
   * // result = { data: [{id: 1, name: "山田太郎"}], count_all: 50 }
   */
  async findSqljs(_sqljs) {
    log.debug("findSqljs", { _sqljs });
    let data = [];
    let count_all = 0;
    let result = {};
    try {
      let sql = _sqljs.toSql(true, true) + _sqljs.toSql(false, true);
      let params = [..._sqljs.getParams(), ..._sqljs.getParams()];

      const rows = await this.select(sql, params);
      if (rows) {
        count_all = Number(rows[0].count);
        rows.splice(0, 1);
        data = rows;
        result = { data, count_all };
        return result;
      }
    } catch (err) {
      log.error(err);
    }
  }

  /**
   * UPDATE文を構築する
   * @param {string} table - テーブル名
   * @param {Object} fields - 更新するフィールド
   * @param {Object} params - WHERE句のパラメータ
   * @returns {Object} SQL文とパラメータ
   * @example
   * const { sql, params } = await db.buildUpdateSql(
   *   "users",
   *   { name: "山田太郎", age: 30 },
   *   { id: 1 }
   * );
   */
  async buildUpdateSql(table, fields, params) {
    return await dbjs_utils.buildUpdateSql(table, this.schema, fields, params);
  }

  /**
   * テーブルのスキーマ情報を取得する
   * @param {string} table - テーブル名
   * @param {Object} fields - フィールド
   * @param {Object} params - パラメータ
   * @returns {Object} スキーマ情報
   * @example
   * const schema = await db.getTableSchema(
   *   "users",
   *   { name: "山田太郎" },
   *   { id: 1 }
   * );
   */
  async getTableSchema(table, fields, params) {
    return await dbjs_utils.getTableSchema(table, this.schema, fields, params);
  }

  /**
   * テーブルスキーマ情報をデバッグ出力する
   * @param {string} table - テーブル名
   * @param {Object} validFields - 有効なフィールド
   * @param {Object} validParams - 有効なパラメータ
   */
  async debugTableSchemaInfo(table, validFields, validParams) {
    return await dbjs_utils.debugTableSchemaInfo(this.schema, table, validFields, validParams);
  }

  /**
   * SELECT文を実行する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Array} 検索結果
   * @example
   * const rows = await db.select(
   *   "SELECT * FROM users WHERE id = ?",
   *   [1]
   * );
   */
  async select(sql, params = []) {
    if (typeof sql !== "string") {
      throw new Error("SQL文が無効です");
    }
    if (!Array.isArray(params)) {
      throw new Error("パラメータが無効です");
    }
    return await super.executeSelect(sql, params);
  }

  /**
   * SQLJSオブジェクトを使用してSELECT文を実行する
   * @param {Object} _sqljs - SQLJSオブジェクト
   * @returns {Array} 検索結果
   * @example
   * const sqljs = new sqljs();
   * sqljs.from("users");
   * const rows = await db.selectSqljs(sqljs);
   */
  async selectSqljs(_sqljs) {
    log.debug("selectSqljs", { _sqljs });
    const sql = await _sqljs.toSql();
    const params = await _sqljs.getParams();
    return await super.executeSelect(sql, params);
  }

  /**
   * SELECT文を実行してCSV形式で結果を取得する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {string} CSV形式の結果
   * @example
   * const csv = await db.selectCsv(
   *   "SELECT id,name FROM users",
   *   []
   * );
   */
  async selectCsv(sql, params = []) {
    return await super.executeSelectCsv(sql, params);
  }

  /**
   * SELECT文を実行して1行のみ取得する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Object} 検索結果の1行
   * @example
   * const user = await db.selectOne(
   *   "SELECT * FROM users WHERE id = ?",
   *   [1]
   * );
   */
  async selectOne(sql, params = []) {
    return await super.executeSelectOne(sql, params);
  }

  /**
   * SQLJSオブジェクトを使用してSELECT文を実行し1行のみ取得する
   * @param {Object} _sqljs - SQLJSオブジェクト
   * @returns {Object} 検索結果の1行
   * @example
   * const sqljs = new sqljs();
   * sqljs.from("users").where("id = ?", [1]);
   * const user = await db.selectOneSqljs(sqljs);
   */
  async selectOneSqljs(_sqljs) {
    log.debug("selectOneSqljs", { _sqljs });
    const sql = await _sqljs.toSql();
    const params = await _sqljs.getParams();
    return await super.executeSelectOne(sql, params);
  }

  /**
   * レコードを更新する
   * @param {string} table - テーブル名
   * @param {Object} fields - 更新するフィールド
   * @param {Object} params - WHERE句のパラメータ
   * @returns {Object} 実行結果
   * @example
   * const result = await db.update(
   *   "users",
   *   { name: "山田太郎", age: 30 },
   *   { id: 1 }
   * );
   */
  async update(table, fields, params = {}) {
    // 1. パラメータのバリデーション
    if (!table || typeof table !== "string") {
      throw new Error("テーブル名が不正です");
    }
    if (!fields || typeof fields !== "object") {
      throw new Error("フィールドが不正です");
    }

    try {
      // 2. UPDATE文の構築
      const { sql, sqlParams } = await this.buildUpdateSql(table, fields, params);

      // 3. SQL文の実行
      const result = await super.executeUpdate(sql, sqlParams);
      return result;
    } catch (err) {
      log.error(`UPDATE実行エラー: ${err.message}`);
      throw err;
    }
  }

  /**
   * クエリを実行する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Array} 実行結果
   * @example
   * const result = await db.query(
   *   "CALL update_user_status(?)",
   *   [1]
   * );
   */
  async query(sql, params = []) {
    return await super.executeQuery(sql, params);
  }

  /**
   * レコードを削除する
   * @param {string} table - テーブル名
   * @param {Object} params - WHERE句のパラメータ
   * @returns {Object} 実行結果
   * @example
   * const result = await db.delete(
   *   "users",
   *   { id: 1 }
   * );
   */
  async delete(table, params = {}) {
    log.debug("delete", { table, params });

    // 1. パラメータのバリデーション
    if (!table || typeof table !== "string") {
      throw new Error("テーブル名が不正です");
    }
    if (!params || typeof params !== "object") {
      throw new Error("パラメータが不正です");
    }

    try {
      // 2. WHERE句の構築
      const whereStr = await dbjs_utils.buildWhereClause(params);

      // 3. SQL文の構築
      const sql = `DELETE FROM ${table} WHERE ${whereStr}`;

      // 4. SQL文の実行
      const result = await super.executeDelete(sql, Object.values(params));
      return result;
    } catch (err) {
      log.error(`DELETE実行エラー: ${err.message}`);
      throw err;
    }
  }

  /**
   * 一括INSERT文を実行する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Object} 実行結果
   * @example
   * const result = await db.bulkInsert(
   *   "INSERT INTO users (name, age) VALUES ?",
   *   [[["山田太郎", 30], ["鈴木一郎", 25]]]
   * );
   */
  async bulkInsert(sql, params = []) {
    return await super.executeBulkInsert(sql, params);
  }

  /**
   * レコードを更新する
   * @param {string} table - テーブル名
   * @param {Object} fields - 更新するフィールド
   * @param {Object} params - WHERE句のパラメータ
   * @returns {Object} 実行結果
   * @example
   * const result = await db.updateSql(
   *   "users",
   *   { name: "山田太郎", age: 30 },
   *   { id: 1 }
   * );
   */
  async updateSql(sql, params = []) {
    return await super.executeUpdate(sql, params);
  }

  /**
   * レコード数を取得する
   * @param {string} table - テーブル名
   * @param {Object} where - WHERE句の条件
   * @returns {Object} レコード数
   * @example
   * const count = await db.getCount(
   *   "users",
   *   { status: 1 }
   * );
   */
  async getCount(table, where = {}) {
    const whereStr = await dbjs_utils.buildWhereClause(where);
    let sql = ` SELECT COALESCE( count(*), 0 ) as count FROM ${table} WHERE ${whereStr}`;
    return super.executeSelectOne(sql);
  }

  /**
   * レコードを削除する
   * @param {string} sql - SQL文
   * @returns {Object} 実行結果
   * @example
   * const result = await db.deleteSql(
   *   "DELETE FROM users WHERE id = ?",
   *   [1]
   * );
   */
  async deleteSql(sql) {
    return super.executeDelete(sql);
  }

  /**
   * INSERT文を構築する
   * @param {string} table - テーブル名
   * @param {Object} fields - 挿入するフィールド
   * @returns {Object} SQL文とパラメータ
   * @example
   * const { sql, params } = await db.buildInsertSql(
   *   "users",
   *   { name: "山田太郎", age: 30 }
   * );
   */
  async buildInsertSql(table, fields) {
    return await dbjs_utils.buildInsertSql(table, this.schema, fields);
  }

  /**
   * INSERT時のスキーマ情報をデバッグ出力する
   * @param {string} table - テーブル名
   * @param {Object} validFields - 有効なフィールド
   */
  async debugInsertSchemaInfo(table, validFields) {
    if (!this.isDevelopment) {
      return;
    }
    return await dbjs_utils.debugInsertSchemaInfo(this.schema, table, validFields);
  }

  /**
   * レコードを挿入する
   * @param {string} table - テーブル名
   * @param {Object} fields - 挿入するフィールド
   * @returns {Object} 実行結果
   * @example
   * const result = await db.insert(
   *   "users",
   *   { name: "山田太郎", age: 30 }
   * );
   */
  async insertSql(sql, params = []) {
    return await super.executeInsert(sql, params);
  }
  /**
   * INSERT文を実行する
   * @param {string} table - テーブル名
   * @param {Object} fields - 挿入するフィールド
   * @returns {Object} 実行結果
   * @example
   * const result = await db.insert(
   *   "INSERT INTO users (name, age) VALUES (?, ?)",
   *   ["山田太郎", 30]
   * );
   */
  async insert(table, fields) {
    log.debug("insert", { table, fields });

    // 1. パラメータのバリデーション
    if (!table || typeof table !== "string") {
      throw new Error("テーブル名が不正です");
    }
    if (!fields || typeof fields !== "object") {
      throw new Error("フィールドが不正です");
    }

    let validFields = fields;

    // 2. スキーマバリデーション
    if (this.isSchemaValidation) {
      try {
        // スキーマの存在チェック
        if (!this.schema || !this.schema[table]) {
          log.warn(`テーブル ${table} のスキーマが見つかりません。スキーマバリデーションをスキップします。`);
          this.isSchemaValidation = false;
        } else {
          const result = await this.getTableSchema(table, fields, {});
          validFields = result.validFields;

          // 有効なフィールドが存在しない場合はエラーを投げる
          if (Object.keys(validFields).length === 0) {
            throw new Error(`挿入可能なフィールドが見つかりません:${table}`);
          }

          // 3. デバッグ情報の出力
          await this.debugInsertSchemaInfo(table, validFields);

          // 4. フィールドのバリデーション
          await dbjs_utils.validateFieldLengths(table, this.schema, validFields);

          await dbjs_utils.validateNotNullConstraints(table, this.schema, validFields);
        }
      } catch (err) {
        log.error(`スキーマバリデーションエラー: ${err.message}`);
        throw err;
      }
    }

    try {
      // 5. SQLの構築と実行
      const { sql, sqlParams } = await this.buildInsertSql(table, validFields);
      const result = await super.executeInsert(sql, sqlParams);
      return result;
    } catch (err) {
      log.error(`INSERT実行エラー: ${err.message}`);
      throw err;
    }
  }

  /**
   * トランザクション内でコールバック関数を実行します
   * @param {Function} callback - 実行するコールバック関数
   * @returns {Promise<any>} コールバック関数の結果
   * @example
   * const result = await db.executeInTransaction(async () => {
   *   await db.insertSql('users', { name: 'John' });
   *   return await db.select('SELECT * FROM users');
   * });
   */
  async executeInTransaction(callback) {
    try {
      await this.startTransaction();
      const result = await callback();
      await this.commit();
      return result;
    } catch (err) {
      await this.rollback();
      throw err;
    }
  }
}
