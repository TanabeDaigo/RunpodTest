/**
 * @fileoverview Sequelize.js ラッパークラス
 *
 * このクラスは、Sequelize.jsの機能を拡張し、より使いやすいインターフェースを提供します。
 * 主な機能:
 * - データベース接続の管理
 * - トランザクション処理
 * - SQLクエリの実行
 * - バルクインサートのサポート
 * - デバッグログの出力
 *
 * @example
 * const sequelize = new SequelizeJS(Sequelize, config);
 * await sequelize.connect();
 * const result = await sequelize.executeSelect('SELECT * FROM users');
 *
 * @author KronoMetro
 * @version 1.0.0
 * @since 2024-03-21
 */

import dayjs from "dayjs";
import logjs from "@krono-metro/metrojs/logjs";

const log = new logjs("dbjs");

/**
 * Sequelizeを使用したデータベース操作を行うクラス
 */
export default class SequelizeJS {
  /**
   * コンストラクタ
   * @param {Object} options - オプション
   */
  constructor(Sequelize, config) {
    try {
      this.Sequelize = Sequelize;
      this.config = config || {};
      this.dbname = config.database;
      const { retry, logLevel, ...rest } = config.config;
      log.info(`constructor config`, rest);
      //log.info(`constructor config`, this.config.config);
      this.connection = null;
      this.transaction = null;
      this.logger = console;
    } catch (err) {
      log.error(err);
    }
  }

  /**
   * データベースに接続する
   */
  async connect() {
    try {
      const { database, user, pass } = this.config;
      log.info(`connect database:${database} user:${user} pass:${pass}`);
      this.connection = new this.Sequelize(database, user, pass, this.config.config);
      if (this.connection) {
        log.info(`DB接続しました。DB接続:${database}`);
      } else {
        log.error(`DB接続に失敗しました。`);
      }
    } catch (err) {
      log.error("connect エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * 指定されたデータベースに切り替える
   * @param {string} dbname - データベース名
   */
  async switchDb(dbname) {
    try {
      log.debug(`switchDb dbname:${dbname}`);
      await this.connect(dbname);
    } catch (err) {
      log.error("switchDb エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * データベース接続を取得する
   * @param {string} dbname - データベース名
   * @returns {Object} データベース接続オブジェクト
   */
  async getConnection(dbname = this.dbname) {
    try {
      // log.debug(`getConnection dbname:${dbname}`);
      if (this.connection) {
        return this.connection;
      }
      await this.connect(dbname);
      return this.connection;
    } catch (err) {
      log.error("getConnection エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * 生コネクションでクエリを実行し、生の結果を返す（コネクション取得・解放はこの中で行う）
   * @param {string} cleanSql - 正規化済みSQL文
   * @param {Array} params - パラメータ
   * @returns {Promise<*>} クエリの生結果（affectedRows, insertId 等）
   */
  async rowQuery(cleanSql, params) {
    await this.getConnection();
    const connection = await this.connection.connectionManager.getConnection();
    try {
      return await new Promise((resolve, reject) => {
        if (params && params.length > 0) {
          connection.query(cleanSql, params, (err, result) => (err ? reject(err) : resolve(result)));
        } else {
          connection.query(cleanSql, (err, result) => (err ? reject(err) : resolve(result)));
        }
      });
    } finally {
      this.connection.connectionManager.releaseConnection(connection);
    }
  }

  /**
   * テーブルのデータを全て削除する
   * @param {string} table - テーブル名
   * @returns {Promise} クエリの実行結果
   */
  async truncate(table) {
    try {
      log.debug("truncate", { table });
      const sql = `TRUNCATE TABLE ${table}`;
      return await this.connection.query(sql, {
        transaction: this.transaction,
      });
    } catch (err) {
      log.error("truncate エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * トランザクションを開始する
   * @returns {Object} トランザクションオブジェクト
   */
  async startTransaction() {
    try {
      log.debug("startTransaction");
      if (!this.transaction) {
        this.transaction = await this.connection.transaction({
          autocommit: false,
        });
      }
      return this.transaction;
    } catch (err) {
      log.error("startTransaction エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * トランザクションをコミットする
   * トランザクションが存在する場合、コミットを実行し、トランザクションをクリアする
   */
  async commit() {
    try {
      log.debug("commit");
      if (this.transaction) {
        await this.transaction.commit();
        this.transaction = null;
      }
    } catch (err) {
      log.error("commit エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * トランザクションをロールバックする
   * トランザクションが存在する場合、ロールバックを実行し、トランザクションをクリアする
   */
  async rollback() {
    try {
      log.debug("rollback");
      if (this.transaction) {
        await this.transaction.rollback();
        this.transaction = null;
      }
    } catch (err) {
      log.error("rollback エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * データベース接続を切断する
   */
  async close() {
    log.debug("close");
    if (this.connection) {
      try {
        log.debug("Close DB:", this.connection.config.database);
        await this.connection.close();
        this.connection = null;
      } catch (err) {
        log.error("close エラー:", err);
      }
    }
  }

  /**
   * 結果セットから指定されたIDの値を取得する
   * @param {Array} resultset - 結果セット
   * @param {string} id - 取得するID
   * @returns {*} 指定されたIDの値
   */
  getLastId(resultset, id) {
    try {
      log.debug("getLastId", { resultset, id });
      let result0 = resultset[0];
      const result1 = resultset[1];
      result0 = result0.map((row) => ({ ...row }));
      return result0[0][id];
    } catch (err) {
      log.error("getLastId エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * 単一の結果を取得する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Object} 検索結果
   */
  async executeSelectOne(sql, params = []) {
    // log.debug("executeSelectOne", { sql, params });
    let data = {};
    try {
      const db = await this.getConnection();
      if (db) {
        data = await db.query(sql, {
          raw: !false,
          replacements: params,
          type: this.Sequelize.QueryTypes.SELECT,
        });
        if (data != null && data.length > 0) {
          return data[0];
        }
        return {};
      }
      log.error("not this.connection");
    } catch (err) {
      log.error("executeSelectOne エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * 複数の結果を取得する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Array} 検索結果
   */
  async executeSelect(sql, params = []) {
    const startTime = Date.now();
    try {
      // log.debug("execute_select", { sql, params });
      let data = [];
      const db = await this.getConnection();
      if (db) {
        await db
          .query(
            sql,
            {
              replacements: params,
              type: this.Sequelize.QueryTypes.SELECT,
            },
            { raw: true },
          )
          .then((rows) => {
            data = rows;
          });
        return data;
      }
    } catch (err) {
      log.error("executeSelect エラー:", err);
      throw err; // エラーを上位に伝播
    } finally {
      const endTime = Date.now();
      log.debug(`クエリ実行時間: ${endTime - startTime}ms`);
    }
  }

  /**
   * 検索結果をCSV形式で取得する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {string} CSV形式の文字列
   */
  async executeSelectCsv(sql, params = []) {
    try {
      log.debug("executeSelectCsv", { sql, params });
      const data = await this.executeSelect(sql, params);
      return data.map((row) => Object.values(row).join(",")).join("\n");
    } catch (err) {
      log.error("executeSelectCsv エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * 最後に挿入されたIDを取得する
   * @returns {number} 最後に挿入されたID
   */
  async getLastInsertId() {
    try {
      log.debug("getLastInsertId");
      const db = await this.getConnection();
      const [lastIDResult] = await db.query("SELECT LAST_INSERT_ID() AS lastID", {
        transaction: this.transaction,
      });
      const lastID = lastIDResult[0].lastID;
      return lastID;
    } catch (err) {
      log.error("getLastInsertId エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * データを挿入する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Array} 実行結果
   */
  async executeInsert(sql, params = []) {
    // SQLインジェクション対策
    if (sql.includes(";")) {
      throw new Error("複数のSQL文の実行は許可されていません");
    }
    if (typeof sql !== "string") {
      throw new Error("SQL文は文字列である必要があります");
    }
    if (!Array.isArray(params)) {
      throw new Error("パラメータは配列である必要があります");
    }
    try {
      if (!this.connection) {
        throw new Error("データベース接続が確立されていません");
      }
      log.debug("insert", { sql, params });
      let data = [];
      data = await this.connection.query(sql, {
        raw: true,
        replacements: params,
        transaction: this.transaction,
        type: this.connection.QueryTypes.INSERT,
      });
      return data;
    } catch (error) {
      log.error(`INSERT実行エラー: ${error.message}`);
      throw new Error(`INSERTの実行に失敗しました: ${error.message}`);
    }
  }

  /**
   * バルクインサートを実行する
   * @param {string} table - テーブル名
   * @param {Array} records - 挿入するレコードの配列
   * @returns {Array} 実行結果
   * @example
   * // 使用例:
   * const records = [
   *   { name: "田中", age: 25 },
   *   { name: "鈴木", age: 30 }
   * ];
   * await execute_bulk_insert("users", records);
   */
  async executeBulkInsert(table, records = []) {
    log.debug("bulk_insert", { table, records });
    try {
      const db = await this.getConnection();
      const data = await db.query(`INSERT INTO ${table} (${Object.keys(records[0]).join(",")}) VALUES ?`, {
        raw: true,
        replacements: [records.map((record) => Object.values(record))],
        type: this.connection.QueryTypes.INSERT,
        transaction: this.transaction,
      });
      return data;
    } catch (err) {
      log.error("executeBulkInsert エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * クエリを実行する（DDL/SELECT/INSERT 等を適切に処理し results.map エラーを防ぐ）
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Promise<Array>} 実行結果
   */
  async executeQuery(sql, params = []) {
    log.debug("executeQuery", { sql: String(sql).substring(0, 80), params });
    try {
      const cleanSql = String(sql)
        .replace(/\uFEFF/g, "")
        .replace(/^\s+|\s+$/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const upperSql = cleanSql.toUpperCase();
      const firstToken = (cleanSql.split(/\s+/)[0] || "").toUpperCase();
      const isDDLByRegex = /^(CREATE|DROP|ALTER|RENAME)\s/i.test(cleanSql);
      const isDDLByToken = ["CREATE", "DROP", "ALTER", "RENAME"].includes(firstToken);
      const isDDLByPrefix = upperSql.startsWith("CREATE ") || upperSql.startsWith("DROP ") || upperSql.startsWith("ALTER ") || upperSql.startsWith("RENAME ");
      const isDDL = isDDLByRegex || isDDLByToken || isDDLByPrefix;

      if (isDDL) {
        log.debug("isDDL", { isDDL, sql: cleanSql.substring(0, 50) });
        await this.rowQuery(cleanSql, params);
        return [];
      }

      const isInsert = /^(INSERT)\s/i.test(upperSql);
      if (isInsert) {
        const rawResult = await this.rowQuery(cleanSql, params);
        const affectedRows = rawResult?.affectedRows ?? 0;
        const insertId = rawResult?.insertId ?? 0;
        return [{ affectedRows, insertId }];
      }

      await this.getConnection();
      const isTruncate = /^(TRUNCATE)\s/i.test(upperSql);
      const isDDLFallback = /^(CREATE|DROP|ALTER|RENAME)\s/i.test(upperSql);

      if (isDDLFallback) {
        await this.rowQuery(cleanSql, params);
        return [];
      }

      let result;
      if (isTruncate) {
        result = await this.connection.query(cleanSql);
      } else {
        result = await this.connection.query(cleanSql, {
          raw: true,
          replacements: params,
          type: this.connection.QueryTypes.SELECT,
          transaction: this.transaction,
        });
      }

      if (!Array.isArray(result)) {
        log.warn("クエリ結果が配列ではありません（DDLの可能性）", typeof result);
        return [];
      }
      return result;
    } catch (err) {
      log.error("executeQuery エラー:", err);
      throw err;
    }
  }

  /**
   * データを更新する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Array} 実行結果
   */
  async executeUpdate(sql, params = []) {
    log.debug("executeUpdate", { sql, params });
    try {
      const db = await this.getConnection();
      const data = await db.query(sql, {
        raw: true,
        replacements: params,
        type: this.connection.QueryTypes.UPDATE,
        transaction: this.transaction,
      });
      return data;
    } catch (err) {
      log.error("executeUpdate エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * データを削除する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Array} 実行結果
   */
  async executeDelete(sql, params = []) {
    log.debug("executeDelete", { sql, params });
    try {
      const db = await this.getConnection();
      const data = await db.query(sql, {
        raw: true,
        replacements: params,
        type: this.connection.QueryTypes.DELETE,
        transaction: this.transaction,
      });
      return data;
    } catch (err) {
      log.error("executeDelete エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * 複数のSQLを実行する
   * @param {Array} jsonArraySql - SQL文の配列
   * @param {Array} params - パラメータの配列
   * @returns {Array} 実行結果
   */
  async executeArraySql(jsonArraySql, params = []) {
    try {
      log.debug("executeArraySql", { jsonArraySql, params });
      if (utils.isNull(jsonArraySql) == true) {
        return true;
      }
      if (utils.lengthForJson(jsonArraySql) <= 0) {
        return true;
      }

      let data = [];
      for (const index in jsonArraySql) {
        const sql = jsonArraySql[index];
        let queryType = this.connection.QueryTypes.UPDATE;
        if (this.isInsertSql(sql) == true) {
          queryType = this.connection.QueryTypes.INSERT;
        }
        if (this.isDeleteSql(sql) == true) {
          queryType = this.connection.QueryTypes.DELETE;
        }
        data = await this.connection
          .query(sql, {
            raw: true,
            replacements: params[index] || [],
            type: queryType,
            transaction: this.transaction,
          })
          .then((err, result) => {
            data = result;
            log.debug("execute_array_sql - result", result);
          });
      }

      return data;
    } catch (err) {
      log.error("executeArraySql エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * SQL文の種類を判定する
   * @param {string} type - SQL文の種類
   * @param {string} sql - SQL文
   * @returns {boolean} 判定結果
   */
  async #isSqlType(type, sql) {
    try {
      log.debug("isSqlType", { type, sql });
      let s = sql;
      if (typeof sql === "string") {
        s = await sql.trim();
      }
      let sqlType = s.substring(0, type.length);
      sqlType = sqlType.toUpperCase(); // 大文字にする
      return type === sqlType;
    } catch (err) {
      log.error("isSqlType エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * UPDATE文かどうかを判定する
   * @param {string} sql - SQL文
   * @returns {boolean} 判定結果
   */
  async #isUpdateSql(sql) {
    try {
      log.debug("isUpdateSql", { sql });
      return this.#isSqlType("UPDATE", sql);
    } catch (err) {
      log.error("isUpdateSql エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * INSERT文かどうかを判定する
   * @param {string} sql - SQL文
   * @returns {boolean} 判定結果
   */
  async #isInsertSql(sql) {
    try {
      log.debug("isInsertSql", { sql });
      return this.#isSqlType("INSERT", sql);
    } catch (err) {
      log.error("isInsertSql エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * DELETE文かどうかを判定する
   * @param {string} sql - SQL文
   * @returns {boolean} 判定結果
   */
  async #isDeleteSql(sql) {
    try {
      log.debug("isDeleteSql", { sql });
      return this.#isSqlType("DELETE", sql);
    } catch (err) {
      log.error("isDeleteSql エラー:", err);
      throw err; // エラーを上位に伝播
    }
  }

  /**
   * 一時テーブルを作成する
   * @param {string} sql - SQL文
   * @param {Array} params - パラメータ
   * @returns {Array} 実行結果
   */
  async createTemporaryTable(sql, params = []) {
    log.debug("createTemporaryTable", { sql, params });

    const db = await this.getConnection();
    try {
      const result = await db.query(sql, {
        raw: true,
        replacements: params,
        type: this.connection.QueryTypes.UPDATE,
      });
      return result;
    } catch (error) {
      log.error("createTemporaryTable エラー:", error);
      throw error; // エラーを上位に伝播
    }
  }
}
