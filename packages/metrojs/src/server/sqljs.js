/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - SQL Query Builder                                ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A powerful SQL query builder that simplifies the          ║
 * ║   construction and execution of SQL queries with support    ║
 * ║   for parameterized queries and schema validation           ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file sqljs.js
 * @description SQLクエリビルダークラス
 *
 * 主な機能:
 * - SQLクエリの動的構築
 * - パラメータ化されたクエリのサポート
 * - スキーマ情報に基づくフィールド検証
 * - 開発環境と本番環境での異なる動作
 * - メソッドチェーンによる直感的なクエリ構築
 * - 一時テーブルの作成と管理
 * - JSONデータのクエリサポート
 *
 * @example
 * import sqljs from '@krono-metro/metrojs/server/sqljs';
 *
 * // クエリビルダーの初期化
 * const sql = new sqljs(schema);
 *
 * // 基本的なSELECTクエリの構築
 * sql.from('users')
 *    .where('status = ? AND age > ?', [1, 20])
 *    .orderBy('created_at DESC')
 *    .limit(10);
 *
 * // 複雑なクエリの構築
 * sql.select([
 *   { field: 'users.name', name: 'user_name', comment: 'ユーザー名' },
 *   { field: 'users.email', name: 'email', comment: 'メールアドレス' }
 * ])
 * .from('users')
 * .whereJson({ status: 1, age: { $gt: 20 } })
 * .groupBy('users.id')
 * .orderBy('users.created_at DESC');
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */
import logjs from "@krono-metro/metrojs/logjs";
const log = new logjs("sqljs");

/**
 * SQLクエリビルダークラス
 * @class
 */
export default class sqljs {
  /**
   * SQLビルダーを初期化する
   * @param {Object} schema - スキーマ情報
   * @example
   * const sql = new sqljs();
   * const sql = new sqljs(schema);
   */
  constructor(schema = null) {
    this.NL = this.getNL();
    this.clear();
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.schema = schema;
  }

  /**
   * SQLビルダーの状態をクリアする
   * @example
   * sql.clear();
   */
  clear() {
    //this.primaryKey = [];
    this._columns = [];
    this._values = [];
    this._where_str = [];
    this._params = [];
    this._from = [];
    this._groupBy = [];
    this._orderBy = [];
    this._lastSql = [];
    this._createTemporary = [];
    this._where = [];
    this._limit = null;
    this._offset = null;
  }

  /**
   * 改行コードを取得する
   * 開発環境では\r\n、本番環境では半角スペースを返す
   * @returns {string} 改行コード
   * @example
   * const nl = sql.getNL();
   */
  getNL() {
    return this.isDevelopment ? "\r\n" : " ";
  }

  /**
   * フィールド情報を取得する
   * @param {string} field - フィールド名
   * @returns {Object} フィールド情報
   * @example
   * const info = sql.getFieldInfo('user_name');
   */
  getFieldInfo(field) {
    if (this.schema && this.isDevelopment) {
      const fieldInfo = {
        name: field,
        comment: Object.values(this.schema).find((table) => table[field])?.comment || "",
      };
      return fieldInfo;
    }
    return {
      name: field,
      comment: "",
    };
  }

  /**
   * カラムを追加する
   * @param {string} field - フィールド名
   * @param {string} name - エイリアス名
   * @param {string} comment - コメント
   * @example
   * sql.col('users.name', 'user_name', 'ユーザー名');
   */
  col(field, name = "", comment = "", params = []) {
    comment = this.isDevelopment ? comment : "";

    if (this.schema) {
      const fieldInfo = this.getFieldInfo(field);
      name = fieldInfo.name;
      comment = fieldInfo.comment;
    }

    this._columns.push({ field: `${field} as ${name}`, comment }); // postgres

    if (params && Array.isArray(params)) {
      this._params.push(...params);
    }
  }

  /**
   * 複数のカラムを一括で追加する
   * @param {Array} columns - カラム情報の配列
   * @param {string|Object} columns[].field - フィールド名（文字列の場合）またはオブジェクト（オブジェクトの場合）
   * @param {string} columns[].name - エイリアス名（オブジェクトの場合）
   * @param {string} columns[].comment - コメント（オブジェクトの場合）
   * @example
   * sql.select(['user_name', 'email']);
   * sql.select([
   *   { field: 'users.name', name: 'user_name', comment: 'ユーザー名' },
   *   { field: 'users.email', name: 'email', comment: 'メールアドレス' }
   * ]);
   */
  select(columns = [], params = []) {
    if (!Array.isArray(columns)) {
      throw new Error("columnsは配列である必要があります");
    }
    for (const column of columns) {
      if (typeof column === "string") {
        const fieldInfo = this.getFieldInfo(column);
        // 文字列の場合はフィールド名のみとして扱う
        this._columns.push({
          field: fieldInfo.name,
          comment: fieldInfo.comment,
        });
      } else if (typeof column === "object") {
        // オブジェクトの場合は field, name, comment を取得
        const { field, name = "", comment = "" } = column;
        const fieldInfo = this.getFieldInfo(field);
        const columnComment = this.isDevelopment ? comment : "";
        this._columns.push({
          field: fieldInfo.name,
          comment: columnComment,
        });
      }
    }
    if (params && Array.isArray(params)) {
      this._params.push(...params);
    }
  }

  /**
   * テーブル名を設定し、SELECT文のFROM句を構築します
   * @param {string} table - テーブル名
   * @returns {sqljs} インスタンス自身（メソッドチェーン用）
   * @example
   * const sqljs = new sqljs();
   * sqljs.from('users');
   * // 生成されるSQL: SELECT * FROM users
   */
  from(table, params = [] ) {
    if (typeof table === "string") {
      this._from.push(...[table]);
    } else if (Array.isArray(table)) {
      this._from.push(...table);
    }
    if (params && Array.isArray(params)) {
      this._params.push(...params);
    }
    return this._from;
  }

  /**
   * パラメータを追加する
   * @param {*} value - パラメータ値
   * @example
   * sql.param('John');
   */
  param(value) {
    this._params.push(value);
  }

  /**
   * パラメータを取得する
   * @returns {Array} パラメータ配列
   * @example
   * const params = sql.getParams();
   */
  getParams() {
    return this._params;
  }

  /**
   * WHERE句を構築します
   * @param {string} where - WHERE条件
   * @param {Array} params - パラメータ配列
   * @returns {sqljs} インスタンス自身（メソッドチェーン用）
   * @example
   * const sqljs = new sqljs();
   * sqljs.from('users')
   *      .where('status = ? AND age > ?', [1, 20]);
   * // 生成されるSQL: SELECT * FROM users WHERE status = 1 AND age > 20
   */
  where(where, params = []) {
    this._where.push(where);
    if (params != null && params.length > 0) {
      for (let index in params) {
        let value = params[index];
        this.param(value);
      }
    }
    return this._where;
  }

  /**
   * WHERE IN句を追加する
   * @param {string} field - フィールド名
   * @param {string|Array} value - IN句の値
   * @param {boolean} isInteger - 数値型かどうか
   * @example
   * sql.where_in('user_id', [1, 2, 3], true);
   * sql.where_in('status', 'active,inactive');
   */
  whereIn(field, value, isInteger = false) {
    log.debug(`where_in value`, value);
    let array = typeof value == "string" ? value.split(",") : value;
    let p = [];
    for (let index in array) {
      p.push("?");
      if (isInteger == false) {
        this.param(array[index]);
      } else {
        this.param(Number(array[index]));
      }
    }
    this.where(field + " in ( " + p.join(",") + " ) ");
  }

  /**
   * WHERE NOT IN句を追加する
   * @param {string} field - フィールド名
   * @param {string|Array} value - NOT IN句の値
   * @param {boolean} isInteger - 数値型かどうか
   * @example
   * sql.where_not_in('user_id', [1, 2, 3], true);
   * sql.where_not_in('status', 'deleted,archived');
   */
  whereNotIn(field, value, isInteger = false) {
    log.debug(`where_not_in value`, value);
    let array = typeof value == "string" ? value.split(",") : value;
    let p = [];
    for (let index in array) {
      p.push("?");
      if (isInteger == false) {
        this.param(array[index]);
      } else {
        this.param(Number(array[index]));
      }
    }
    this.where(field + " not in ( " + p.join(",") + " ) ");
  }

  /**
   * WHERE LIKE句を追加する
   * @param {string} field - フィールド名
   * @param {Array} array - LIKE検索の値の配列
   * @example
   * sql.where_like('name', ['John', 'Jane']);
   */
  whereLike(field, array, is_before = false) {
    let where = [];
    for (let index in array) {
      if (is_before == true) {
        this.param(array[index] + "%");
      } else {
        this.param("%" + array[index] + "%");
      }
      //this.param("%" + array[index] + "%");
      where.push(" " + field + " like ? ");
    }
    this.where("(" + where.join(" OR ") + " ) ");
  }

  /**
   * オブジェクトのプロパティ値を取得する
   * @param {Object} array - オブジェクト
   * @param {string} property - プロパティ名
   * @param {*} def - デフォルト値
   * @returns {*} プロパティ値
   * @example
   * const value = sql.hasOwnDef({name: 'John'}, 'age', 20);
   */
  hasOwnDef(array, property, def) {
    if (array == null) {
      return def;
    }
    return array.hasOwnProperty(property) ? array[property] : def;
  }

  /**
   * JSONオブジェクトからWHERE句を生成する
   * @param {Object} json - JSONオブジェクト
   * @param {string} field - フィールド名
   * @example
   * sql.where_json({status: 'active'}, 'status');
   */
  whereJson(json, field = "") {
    const s = this.hasOwnDef(json, field, "");
    log.debug("where_json field:" + field + " s:" + s);
    let bSet = false;
    if (s != null) {
      if (typeof s == "string") {
        if (s != "") {
          bSet = true;
        }
      } else {
        bSet = true;
      }
    }
    if (bSet == true) {
      this.where(field + " = ? ", s);
    }
  }

  /**
   * ORDER BY句を構築します
   * @param {string} order - ソート条件
   * @returns {sqljs} インスタンス自身（メソッドチェーン用）
   * @example
   * const sqljs = new sqljs();
   * sqljs.from('users')
   *      .orderBy('created_at DESC, id ASC');
   * // 生成されるSQL: SELECT * FROM users ORDER BY created_at DESC, id ASC
   */
  orderBy(order, params = []) {
    this._orderBy.push(order);
    if (params != null && params.length > 0) {
      for (let index in params) {
        let value = params[index];
        this.param(value);
      }
    }
    return this;
  }

  /**
   * GROUP BY句を追加する
   * @param {string} sql - GROUP BY句
   * @example
   * sql.groupBy('department_id');
   */
  groupBy(sql, params = []) {
    this._groupBy.push(sql);
    if (params != null && params.length > 0) {
      for (let index in params) {
        let value = params[index];
        this.param(value);
      }
    }
  }

  /**
   * LIMIT句とOFFSET句を設定する
   * @param {number} limit - 取得件数の制限
   * @param {number} offset - スキップする件数（デフォルト: 0）
   * @example
   * sql.limit(10, 20); // LIMIT 10 OFFSET 20
   * sql.limit(10);     // LIMIT 10
   */
  limit(limit, offset = 0) {
    this._limit = limit;
    this._offset = offset;
  }

  /**
   * 最後に実行するSQLを追加する
   * @param {string} sql - SQL文
   * @example
   * sql.lastSql('LIMIT 10');
   */
  lastSql(sql, params = []) {
    this._lastSql.push(sql);
    if (params != null && params.length > 0) {
      for (let index in params) {
        let value = params[index];
        this.param(value);
      }
    }
  }

  /**
   * SELECT句のカラム部分を生成する
   * @returns {string} カラム部分のSQL
   * @example
   * const columns = sql.make_columns();
   */
  makeColumns() {
    return this._columns
      .map((f, i) => {
        const delimiter = i === this._columns.length - 1 ? "" : ",";
        const comment = f.comment ? ` -- ${f.comment}` : "";
        return `${f.field}${delimiter}${comment}${this.NL}`;
      })
      .join("");
  }

  /**
   * データ取得用と件数取得用のSQLを両方生成する
   * @param {boolean} is_debug - デバッグモードかどうか
   * @returns {Object} {sql: Array<string>, params: Array<Array>} SQL文の配列とパラメータの配列
   * @example
   * const result = await sql.toFindSql();
   * // result.sql: ["SELECT * FROM users WHERE status = ?", "SELECT COUNT(*) FROM users WHERE status = ?"]
   * // result.params: [[1], [1]]
   */
  async toFindSql(is_debug = false) {
    let _sql = [];
    _sql.push(await this.toSql(true, is_debug));
    _sql.push(await this.toSql(false, is_debug));

    let _params = [];
    _params.push(await this.getParams());
    _params.push(await this.getParams());

    return {
      sql: _sql,
      params: _params,
    };
  }

  /**
   * 構築されたSQL文を文字列として返します
   * @param {boolean} isCount - 件数取得用のSQLかどうか
   * @param {boolean} isDebug - デバッグモードかどうか
   * @returns {string} 構築されたSQL文
   * @throws {Error} SQL生成に失敗した場合
   * @example
   * const sqljs = new sqljs();
   * sqljs.from('users')
   *      .where('status = ?', [1]);
   * const sql = sqljs.toSql();
   * // 結果: SELECT * FROM users WHERE status = ?
   */
  async toSql(isCount = false, isDebug = false) {
    // log.debug(`toSql isCount:${isCount} isDebug:${isDebug}`);
    try {
      const NL = this.getNL();
      let sql = "";
      sql += await this.makeCreateTemporary(); // テンポラリ

      sql += `${NL} SELECT ${NL}`;
      if (isCount === true) {
        sql += ` COALESCE( count(*), 0 ) as count ${NL}`;
      } else {
        if (this._columns.length > 0) {
          sql += await this.makeColumns();
        } else {
          sql += " * ";
        }
      }
      sql += NL;
      // log.debug(`from`, this._from);
      const from = this._from.join(" " + NL + " ");
      sql += ` FROM ${from}${NL}`;
      sql += await this.makeWhereSql();
      // log.debug(`groupBy`, this._groupBy);
      if (this._groupBy.length > 0) {
        sql += " GROUP BY " + this._groupBy.join(" " + NL + " ");
      }
      if (isCount !== true) {
        // log.debug(`orderBy`, this._orderBy);
        if (this._orderBy.length > 0) {
          sql += " ORDER BY " + this._orderBy.join(" " + NL + " ");
        }
        // log.debug(`lastSql`, this._lastSql);
        sql += " " + this._lastSql.join(" " + NL + " ");

        if (this._limit !== null) {
          sql += ` LIMIT ${this._limit}`;
          if (this._offset !== null) {
            sql += ` OFFSET ${this._offset}`;
          }
        }
      }
      /*
      if (isDebug == true) {
        sql += " -- " + new Date().toISOString();
      }
        */

      return sql;
    } catch (err) {
      log.error(`SQL生成エラー: ${err.message}`);
      throw new Error(`SQL生成に失敗しました: ${err.message}`);
    }
  }

  /**
   * 一時テーブルを作成する
   * @param {string} table_name - テーブル名
   * @param {string} query - クエリ
   * @example
   * await sql.createTemporary(table_name, query);
   */
  async createTemporary(table_name, query) {
    let sql = await this.makeCreateTemporarySql(table_name, query);
    await this._createTemporary.push(sql);
  }

  /**
   * 一時テーブル作成のSQLを生成する
   * @returns {string} 一時テーブル作成SQL
   * @example
   * const sql = sql.makeCreateTemporary();
   */
  makeCreateTemporary() {
    const NL = this.getNL();
    if (this._createTemporary.length <= 0) {
      return "";
    }
    return this._createTemporary.join(NL);
  }

  /**
   * 一時テーブル作成のSQLを生成する
   * @param {string} table_name - テーブル名
   * @param {string} query - クエリ
   * @returns {string} 一時テーブル作成SQL
   * @example
   * const sql = sql.makeCreateTemporarySql('temp_users', 'SELECT * FROM users');
   */
  makeCreateTemporarySql(table_name, query) {
    const NL = this.getNL();
    let sql = "";
    sql += "DROP TABLE IF EXISTS " + table_name + ";" + NL;
    sql += "CREATE TEMPORARY TABLE " + table_name + " AS " + NL;
    sql += query + NL;
    sql += ";";
    return sql;
  }

  /**
   * WHERE句を生成する
   * @returns {string} WHERE句
   * @example
   * const whereSql = sql.makeWhereSql();
   */
  makeWhereSql() {
    const NL = this.getNL();
    let sql = "";
    if (this._where.length > 0) {
      sql += ` WHERE ${NL}`;
      sql += this._where.join(` and ${NL} `) + NL;
    }
    // log.debug("makeWhereSql _where", this._where);
    return sql;
  }

  /**
   * フォームデータから自動的にWHERE句を生成する
   * @param {string} table_name - テーブル名
   * @param {Object} form - フォームデータ
   * @example
   * // 使用例:
   * const form = {
   *   auto_where: {
   *     'user_code__equal': '001',      // users.user_code = '001'
   *     'name__like': '田中',           // users.name like '%田中%'
   *     'age__from': 20,                // users.age >= 20
   *     'age__to': 30,                  // users.age <= 30
   *     'dept@id__equal': 1,            // dept.id = 1
   *     'is_deleted__is_null': true     // users.is_deleted is null
   *   }
   * };
   * sql.autoWhere(table_name, form);
   */
  autoWhere(table_name, form) {
    const convertFieldname = (key, index) => {
      let name = key.substr(0, index);
      //this.log.debug("convert_fieldname key:" + key + " name:" + name);

      // @マーク指定の場合、テーブル名として扱う
      // rels@calendar_id →　rels.calendar_id
      if (name.indexOf("@") !== -1) {
        return name.replaceAll("@", ".");
      }
      // テーブル指定がない場合、強制的に付与する
      // user_code → users.user_code
      if (name.indexOf(".") === -1) {
        return table_name + "." + name;
      }

      return name;
    };

    if (Object.hasOwn(form, "auto_where") === true) {
      let auto_where = form.auto_where;
      for (var key in auto_where) {
        let value = auto_where[key];
        log.debug("key:" + key + " value:" + value);
        let index = -1,
          name = "";

        index = key.lastIndexOf("__equal");
        if (index != -1) {
          name = convertFieldname(key, index); // フィールド名をコンバート
          log.debug("where equal name:" + name + " value:" + value);
          if (value != null && value != "") {
            this.where(`${name} = ? `, value);
          }
        }
        index = key.lastIndexOf("__not_equal");
        if (index != -1) {
          name = convertFieldname(key, index); // フィールド名をコンバート
          log.debug("where not equal name:" + name + " value:" + value);
          this.where(`${name} != ? `, value);
        }
        index = key.lastIndexOf("__like");
        if (index != -1) {
          name = convertFieldname(key, index); // フィールド名をコンバート
          log.debug("where like name:" + name + " value:" + value);
          index = key.lastIndexOf("__like_before");
          if (index != -1) {
            this.whereLike(name, [value], true);
          } else {
            this.whereLike(name, [value], false);
          }
        }

        index = key.lastIndexOf("__not_like");
        if (index != -1) {
          name = convertFieldname(key, index); // フィールド名をコンバート
          log.debug("where not like name:" + name + " value:" + value);
          this.where(`${name} not like ? `, value);
        }
        index = key.lastIndexOf("__in");
        if (index != -1) {
          name = convertFieldname(key, index); // フィールド名をコンバート
          log.debug("where in name:" + name + " value:" + value);
          this.whereIn(name, value);
        }
        index = key.lastIndexOf("__from");
        if (index != -1) {
          name = convertFieldname(key, index); // フィールド名をコンバート
          log.debug("where from name:" + name + " value:" + value);
          this.where(`${name} >= ? `, value);
        }
        index = key.lastIndexOf("__to");
        if (index != -1) {
          name = convertFieldname(key, index); // フィールド名をコンバート
          log.debug("where to name:" + name + " value:" + value);
          this.where(`${name} <= ? `, value);
        }
        index = key.lastIndexOf("__is_null");
        if (index != -1) {
          if (value == true) {
            name = convertFieldname(key, index); // フィールド名をコンバート
            log.debug("where is null name:" + name + " value:" + value);
            this.where(`${name} is null `);
          }
        }
        index = key.lastIndexOf("__is_not_null");
        if (index != -1) {
          if (value == true) {
            name = convertFieldname(key, index); // フィールド名をコンバート
            log.debug("where is not null name:" + name + " value:" + value);
            this.where(`${name} is not null `);
          }
        }
      }
    }
  }
}
