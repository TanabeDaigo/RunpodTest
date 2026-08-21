import { AbstractObject as Abstract } from "@common/server";
import { logjs, models, sqljs, config } from "@lib/server";

const log = new logjs("AbstractDao");

/**
 * DAOの抽象基底クラス
 *
 * - 各テーブル用のDAOは本クラスを継承し、`super('<table_name>')` を呼び出すだけで
 *   `insert`, `update`, `delete` の基本操作が利用できます。
 * - 複合主キー（composite primary key）にも対応した `findByPk` / `autoUpdate` を提供します。
 * - DB接続（`dbjs`）とリクエスト（`req`）は `AbstractObject` のライフサイクルにより実行時に注入されます。
 *
 * 使用例:
 * @example
 * import { injectable } from "tsyringe";
 * import AbstractDao from "./AbstractDao";
 *
 * @injectable()
 * class ShippingRecordsDao extends AbstractDao {
 *   constructor() {
 *     super("shipping_records");
 *   }
 * }
 * export default ShippingRecordsDao;
 *
 * // 利用側（例: ロジック／コントローラ内）
 * // const dao = container.resolve(ShippingRecordsDao); // DI経由
 * // await dao.insert({ id: 1, name: "foo" });
 * // const row = await dao.findByPk({ id: 1 });
 * // await dao.update({ name: "bar" }, { id: 1 });
 * // await dao.delete({ id: 1 });
 *
 * // 複合主キー例:
 * // PK: (company_id, record_id) の場合
 * // await dao.findByPk({ company_id: 10, record_id: 99 });
 * // await dao.autoUpdate({ company_id: 10, record_id: 99 }, { company_id: 10, record_id: 99, name: "x" });
 */
class AbstractDao extends Abstract {
  constructor(table_name) {
    super();
    this.table_name = table_name;
    this._models = null; // ここでは生成しない（dbjs未注入のため）
  }

  get models() {
    if (!this._models || this._models.dbjs !== this.dbjs) {
      if (!this.dbjs) {
        throw new Error("dbjs が未注入です。DAOを利用する前にDI経由で取得してください。");
      }
      this._models = new models(this.table_name, this.dbjs, this.req?.session);
    }
    return this._models;
  }

  async getLastInsertId() {
    return await this.dbjs.getLastInsertId();
  }

  async truncate() {
    return await this.dbjs.query(`TRUNCATE TABLE ${this.table_name}`);
  }

  /**
   * レコードを挿入します
   * @param {Object} data 挿入データ（テーブルのカラム名をキーに持つオブジェクト）
   * @returns {Promise<any>} INSERT結果（ドライバ実装に依存）
   */
  async insert(data) {
    return await this.models.insert(data);
  }

  /**
   * レコードを更新します
   * @param {Object} data 更新データ（PK含む想定。または WHERE 指定時はPK不要）
   * @param {Object} [where] WHERE条件（省略時はPKで更新）
   * @returns {Promise<any>} UPDATE結果（ドライバ実装に依存）
   *
   * 使用例:
   * // PKが id の場合
   * // await dao.update({ id: 1, name: "updated" });
   * // WHEREを明示する場合
   * // await dao.update({ name: "updated" }, { id: 1 });
   */
  async update(data, where) {
    return await this.models.update(data, where);
  }

  /**
   * レコードを削除します
   * @param {Object} data 削除条件（PK等）
   * @returns {Promise<any>} DELETE結果（ドライバ実装に依存）
   */
  async delete(data) {
    return await this.models.delete(data);
  }

  /**
   * 一覧検索（ページング・ソート対応）
   * - `PhotoLogController.find` の戻り値仕様（total と rows）に合わせ、`dbjs.find()` から `[total, rows]` を受け取ります。
   * - SQL生成は `sqljs` を利用し、`COUNT` とデータ本体取得SQLを一度に構築します。
   *
   * @param {Object} params 検索パラメータ
   * @param {string[]} [params.select=["*"]] 取得カラム
   * @param {string} [params.from] FROM句（省略時は `this.models.table`）
   * @param {Object} [params.equals] 完全一致条件のマップ（値が null/undefined/空文字は無視）
   * @param {Object} [params.likes] 部分一致条件のマップ（like '%値%'）
   * @param {{sql:string, params?:any[]}[]} [params.whereRaw=[]] 任意のwhere句（配列で複数指定可）
   * @param {number} [params.page=1] ページ番号（1始まり）
   * @param {number} [params.pageSize=100] 1ページ件数
   * @param {string} [params.sortKey] ソートキー（省略時は未指定）
   * @param {"asc"|"desc"} [params.sortOrder="asc"] ソート順
   * @returns {Promise<{rows:any[], total:number, page:number, pageSize:number}>}
   *
   * 使用例:
   * // 画像一覧（image_cloud）を取得（is_deleted=false、ファイル名にキーワード、更新降順）
   * // const dao = container.resolve(ImageCloudDao);
   * // const result = await dao.find({
   * //   select: [
   * //     "image_cloud.image_id",
   * //     "image_cloud.file_name",
   * //     "image_cloud.file_path",
   * //     "image_cloud.file_size",
   * //     "DATE_FORMAT(image_cloud.created_at, '%Y/%m/%d %H:%i') as created_at",
   * //     "DATE_FORMAT(image_cloud.updated_at, '%Y/%m/%d %H:%i') as updated_at",
   * //   ],
   * //   equals: { is_deleted: false },
   * //   likes: { file_name: keyword },
   * //   page: 1,
   * //   pageSize: 100,
   * //   sortKey: "image_id",
   * //   sortOrder: "desc",
   * // });
   */
  async find(params = {}) {
    const { select = ["*"], from, equals = {}, likes = {}, whereRaw = [], page = 1, pageSize = 100, sortKey, sortOrder = "asc" } = params;

    const offset = (page - 1) * pageSize;
    const _sql = new sqljs();

    // SELECT / FROM
    const tableId = from || this.models.table;
    let finalSelect = Array.isArray(select) ? [...select] : ["*"];

    try {
      const schema = this.models?.getSchema?.() || {};
      const hasCreated = Object.prototype.hasOwnProperty.call(schema, "created_at");
      const hasUpdated = Object.prototype.hasOwnProperty.call(schema, "updated_at");
      const dialect = (config?.sequelize?.config?.dialect || "").toLowerCase();

      const needsAutoFormat = finalSelect.length === 1 && (finalSelect[0] === "*" || finalSelect[0] === `${tableId}.*`);

      if (needsAutoFormat) {
        const fmt = (col) => {
          if (dialect.startsWith("mysql")) {
            return `DATE_FORMAT(${tableId}.${col}, '%Y/%m/%d %H:%i') as ${col}`;
          }
          if (dialect.startsWith("postgres")) {
            return `to_char(${tableId}.${col}, 'YYYY/MM/DD HH24:MI') as ${col}`;
          }
          return `${tableId}.${col} as ${col}`;
        };
        if (hasCreated) finalSelect.push(fmt("created_at"));
        if (hasUpdated) finalSelect.push(fmt("updated_at"));
      }
    } catch (e) {
      log.warn("select 日付フォーマットの自動適用でエラーが発生しました（スキップします）", e);
    }

    _sql.select(finalSelect);
    _sql.from(tableId);

    // WHERE（equals）
    Object.entries(equals).forEach(([col, val]) => {
      if (val === "" || val === null || val === undefined) return;
      _sql.where(`${col} = ? `, [val]);
    });

    // WHERE（likes）
    Object.entries(likes).forEach(([col, val]) => {
      if (!val && val !== 0) return;
      _sql.where(`${col} like ? `, [`%${val}%`]);
    });

    // WHERE（raw）
    whereRaw.forEach((w) => {
      if (!w || !w.sql) return;
      _sql.where(w.sql, w.params || []);
    });

    // ORDER / LIMIT
    if (sortKey) {
      _sql.lastSql(`order by ${sortKey} ${sortOrder} LIMIT ${pageSize} OFFSET ${offset}`);
    } else {
      _sql.lastSql(`LIMIT ${pageSize} OFFSET ${offset}`);
    }

    const sqlInfo = await _sql.toFindSql();
    log.debug("find sqlInfo", sqlInfo);

    const [total, rows] = await this.dbjs.find(sqlInfo.sql, sqlInfo.params);
    return { rows, total, page, pageSize };
  }

  /**
   * プライマリーキーで1件取得します（複合主キー対応）
   * - 単一PK: `pkValue` は { pk: value } 形式のオブジェクト
   * - 複合PK: `pkValue` は { key1: val1, key2: val2 } 形式のオブジェクト
   *
   * @param {Object} pkValue 主キー値オブジェクト
   * @returns {Promise<Object|null>} 取得できた場合は1行、存在しない場合は null
   *
   * 使用例:
   * // 単一PK
   * // await dao.findByPk({ id: 1 });
   * // 複合PK
   * // await dao.findByPk({ company_id: 10, record_id: 99 });
   */
  async findByPk(pkValue) {
    const pkKeys = this._getPkKeysOrThrow();
    this._assertPkObject(pkValue, pkKeys);

    const conditions = pkKeys.map((k) => `${k} = ?`).join(" AND ");
    const sql = `SELECT * FROM ${this.models.table} WHERE ${conditions}`;
    const params = pkKeys.map((k) => pkValue[k]);
    return await this.dbjs.selectOne(sql, params);
  }

  /**
   * 存在すれば UPDATE、存在しなければ INSERT を自動で切り替えます（UPSERT風の振る舞い）
   *
   * @param {Object} pkWhere 主キー条件（例: { id: 1 } / { key1: v1, key2: v2 }）
   * @param {Object} data 挿入・更新データ（PKを含んでいてもOK、内部で除去して更新します）
   * @returns {Promise<{action: "update" | "insert", result: any}>}
   *
   * 使用例:
   * // await dao.autoUpdate({ id: 1 }, { id: 1, name: "newName" });
   * // => { action: "update", result: ... } または { action: "insert", result: ... }
   */
  async autoUpdate(pkWhere, data) {
    const pkKeys = this._getPkKeysOrThrow();
    this._assertPkObject(pkWhere, pkKeys);

    const exists = await this.findByPk(pkWhere);

    log.debug("autoUpdate data", data);
    log.debug("autoUpdate pkWhere", pkWhere);
    log.debug("autoUpdate exists", exists);
    const dataWithoutPk = { ...data };
    pkKeys.forEach((k) => delete dataWithoutPk[k]);

    if (exists) {
      const result = await this.update(dataWithoutPk, pkWhere);
      return { action: "update", result };
    } else {
      const result = await this.insert(dataWithoutPk);
      return { action: "insert", result };
    }
  }

  /**
   * テーブル定義から主キー配列を取得。未定義なら例外。
   * @private
   * @returns {string[]} 主キーのカラム名配列（複合主キーを想定）
   */
  _getPkKeysOrThrow() {
    const table = this.models.table;
    const pkKeys = (typeof this.models.getPrimaryKeys === "function" && this.models.getPrimaryKeys()) || [this.models.getPrimaryKey()].filter(Boolean);

    if (!pkKeys.length) {
      throw new Error(`テーブル ${table} にプライマリーキーが定義されていません。`);
    }
    return pkKeys;
  }

  /**
   * 主キー指定の妥当性を検証します。
   * - オブジェクト形式であること
   * - 未知のキーが含まれないこと
   * - 全ての主キー値が非null/undefinedであること
   *
   * @private
   * @param {Object} pkObj 主キー条件オブジェクト
   * @param {string[]} pkKeys 期待される主キー名配列
   */
  _assertPkObject(pkObj, pkKeys) {
    if (!pkObj || typeof pkObj !== "object" || Array.isArray(pkObj)) {
      throw new Error(`プライマリーキーの指定はオブジェクト形式のみ対応です。{ ${pkKeys.join(": , ")} } の形で指定してください。`);
    }
    const unknown = Object.keys(pkObj).filter((k) => !pkKeys.includes(k));
    if (unknown.length) {
      throw new Error(`未対応のキーが含まれています: ${unknown.join(", ")}。許可キー: ${pkKeys.join(", ")}`);
    }
    const missing = pkKeys.filter((k) => pkObj[k] === undefined || pkObj[k] === null);
    if (missing.length) {
      throw new Error(`プライマリーキー ${missing.join(", ")} の値が指定されていません。`);
    }
  }
}

export default AbstractDao;
