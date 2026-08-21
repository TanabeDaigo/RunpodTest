/**
 * =========================================
 *
 * Metrojs
 *
 * Copyright © 2019-present KronoMetro, Co.
 * All rights reserved.
 *
 * =========================================
 */

import logjs from "@metrojs/logjs";
const log = new logjs("dbjs_utils");

/**
 * テーブルスキーマの存在チェックを行う
 * @param {string} table - テーブル名
 * @param {Object} schema - スキーマオブジェクト
 * @returns {Object} テーブルスキーマ
 * @throws {Error} スキーマが存在しない場合にエラーをスロー
 */
function validateTableSchema(table, schema) {
  if (typeof table !== "string" || !table) {
    throw new Error("テーブル名が無効です");
  }

  if (!schema || typeof schema !== "object") {
    throw new Error("スキーマが無効です");
  }

  if (!Object.hasOwn(schema, table)) {
    throw new Error(`テーブル ${table} のスキーマが見つかりません`);
  }

  const tableSchema = schema[table];
  if (!tableSchema) {
    throw new Error(`テーブル ${table} のスキーマが見つかりません。`);
  }

  return tableSchema;
}

/**
 * テーブルのスキーマ情報を取得し、有効なフィールドとパラメータをフィルタリングする
 * @param {string} table - テーブル名
 * @param {Object} fields - フィールドオブジェクト
 * @param {Object} params - パラメータオブジェクト
 * @returns {Object} 有効なフィールドとパラメータを含むオブジェクト
 * @example
 * const { validFields, validParams } = await getTableSchema('users',
 *   { name: '山田', age: 20 },
 *   { id: 1 }
 * );
 */
export async function getTableSchema(table, schema, fields, params) {

  try {
    const tableSchema = validateTableSchema(table, schema);
    const validFields = {};
    const validParams = {};

    // フィールドの検証
    if (fields && typeof fields === "object") {
      for (const [key, value] of Object.entries(fields)) {
        if (tableSchema[key]) {
          validFields[key] = value;
        } else {
          log.warn(`フィールド ${key} は ${table} テーブルに存在しません`);
        }
      }
    }

    // パラメータの検証
    if (params && typeof params === "object") {
      for (const [key, value] of Object.entries(params)) {
        if (tableSchema[key]) {
          validParams[key] = value;
        } else {
          log.warn(`パラメータ ${key} は ${table} テーブルに存在しません`);
        }
      }
    }

    return { validFields, validParams };
  } catch (err) {
    log.error(err);
    throw err;
  }
}

/**
 * whereオブジェクトからWHERE句を構築する
 * @param {Object} where - WHERE句の条件を含むオブジェクト
 * @returns {string} 構築されたWHERE句
 * @example
 * const whereClause = buildWhereClause({ id: 1, status: 'active' });
 * // 結果: "id = '1' AND status = 'active'"
 */
export function buildWhereClause(where) {
  if (!where || typeof where !== "object") {
    return "1=1";
  }
  log.debug(`buildWhereClause where:${JSON.stringify(where)}`);
  const whereConditions = Object.entries(where)
    .map(([key, value]) => {
      if (typeof value === "string") {
        return `${key} = '${value.replace(/'/g, "''")}'`;
      }
      return `${key} = ${value}`;
    })
    .join(" AND ");

  return whereConditions || "1=1";
}

/**
 * NOT NULL制約のバリデーションを実行する
 * @param {string} table - テーブル名
 * @param {Object} schema - テーブルのスキーマ
 * @param {Object} fields - 検証するフィールド
 * @throws {Error} NOT NULL制約違反時にエラーをスロー
 * @example
 * await validateNotNullConstraints('users', userSchema, { name: '山田' });
 */
export async function validateNotNullConstraints(table, schema, fields) {
  //log.debug(`validateNotNullConstraints table:${table}`);
  try {
    const tableSchema = validateTableSchema(table, schema);

    for (const [field, fieldSchema] of Object.entries(tableSchema)) {
      if (fieldSchema.is_auto_increment) continue;
      if (fieldSchema.default !== null) continue;
      if (fieldSchema.is_null === false && !(field in fields)) {
        throw new Error(`NOT NULL制約違反: ${field}`);
      }
    }
  } catch (err) {
    log.error(err);
    throw err;
  }
}

/**
 * フィールドの長さ制約のバリデーションを実行する
 * @param {string} table - テーブル名
 * @param {Object} schema - テーブルのスキーマ
 * @param {Object} validFields - 検証するフィールド
 * @throws {Error} フィールド長制約違反時にエラーをスロー
 * @example
 * await validateFieldLengths('users', userSchema, { name: '山田太郎' });
 */
export async function validateFieldLengths(table, schema, validFields) {
  //log.debug(`validateFieldLengths table:${table}`);
  try {
    const tableSchema = validateTableSchema(table, schema);

    for (const [field, fieldSchema] of Object.entries(tableSchema)) {
      if (!fieldSchema.is_type_num && fieldSchema.max_length > 0 && validFields[field]) {
        const value = validFields[field];
        if (value && value.length > fieldSchema.max_length) {
          throw new Error(`フィールド ${field} の値が最大長 ${fieldSchema.max_length} を超えています`);
        }
      }
    }
  } catch (err) {
    log.error(err);
    throw err;
  }
}

/**
 * INSERT文を構築する
 * @param {string} table - テーブル名
 * @param {Object} fields - 挿入するフィールドと値
 * @returns {Object} SQL文とパラメータを含むオブジェクト
 * @example
 * const { sql, sqlParams } = await buildInsertSql('users', {
 *   name: '山田',
 *   age: 20
 * });
 */
export async function buildInsertSql(table, schema, fields = {}) {
  log.debug(`buildInsertSql table:${table}`);
  log.debug(`fields:`, fields);
  try {
    const tableSchema = validateTableSchema(table, schema);
    const validFields = [];

    // fieldsがJSONまたはJSON配列の場合を処理
    if (Array.isArray(fields)) {
      fields.forEach((field, index) => {
        for (const key in field) {
          //log.debug(`key:${key} value:${field[key]}`);
          if (tableSchema[key]) {
            if (!validFields[index]) validFields[index] = {};
            validFields[index][key] = field[key];
          } else {
            log.warn(`フィールド ${key} は ${table} テーブルに存在しません`);
          }
        }
      });
    } else {
      for (const key in fields) {
        log.debug(`key:${key} value:${fields[key]}`);
        if (tableSchema[key]) {
          validFields[key] = fields[key];
        } else {
          log.warn(`フィールド ${key} は ${table} テーブルに存在しません`);
        }
      }
    }

    if (Object.keys(validFields).length === 0) {
      throw new Error("挿入可能なフィールドが見つかりません");
    }

    const columns = Object.keys(validFields).join(", ");
    const placeholders = Object.keys(validFields)
      .map(() => "?")
      .join(", ");
    const sqlParams = Object.values(validFields);
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    return { sql, sqlParams };
  } catch (err) {
    log.error(err);
    throw err;
  }
}

/**
 * UPDATE文を構築する
 * @param {string} table - テーブル名
 * @param {Object} fields - 更新するフィールドと値
 * @param {Object} params - WHERE句の条件
 * @returns {Object} SQL文とパラメータを含むオブジェクト
 * @example
 * const { sql, sqlParams } = await buildUpdateSql('users',
 *   { name: '山田', age: 25 },
 *   { id: 1 }
 * );
 */
export async function buildUpdateSql(table, schema, fields, params) {
  try {
    const tableSchema = validateTableSchema(table, schema);

    const setClause = Object.entries(fields)
      .map(([key]) => `${key} = ?`)
      .join(", ");
    const whereClause = Object.entries(params)
      .map(([key]) => `${key} = ?`)
      .join(" AND ");

    const sqlParams = [...Object.values(fields), ...Object.values(params)];
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

    return { sql, sqlParams };
  } catch (err) {
    log.error(err);
    throw err;
  }
}

/**
 * テーブルスキーマの情報をデバッグ出力する
 * @param {string} table - テーブル名
 * @param {Object} validFields - 有効なフィールド
 * @param {Object} validParams - 有効なパラメータ
 * @example
 * await debugTableSchemaInfo('users',
 *   { name: '山田', age: 25 },
 *   { id: 1 }
 * );
 */
export async function debugTableSchemaInfo(schema, table, validFields, validParams) {
  try {
    const tableSchema = validateTableSchema(table, schema);

    const debugInfo = {
      table,
      fields: Object.entries(validFields).map(([key, value]) => ({
        field: key,
        value: value,
        comment: tableSchema[key]?.comment || "不明",
      })),
      conditions: Object.entries(validParams).map(([key, value]) => ({
        field: key,
        value: value,
        comment: tableSchema[key]?.comment || "不明",
      })),
    };
    log.debug("更新内容:", debugInfo);
  } catch (err) {
    log.error(err);
    throw err;
  }
}

/**
 * 挿入するデータの情報をデバッグ出力する
 * @param {string} table - テーブル名
 * @param {Object} validFields - 有効なフィールド
 * @example
 * await debugInsertSchemaInfo('users', {
 *   name: '山田',
 *   age: 25
 * });
 */
export async function debugInsertSchemaInfo(schema, table, validFields) {
  try {
    const tableSchema = validateTableSchema(table, schema);
    const debugInfo = {
      table,
      fields: Object.entries(validFields).map(([key, value]) => ({
        field: key,
        value: value,
        comment: tableSchema[key]?.comment || "不明",
      })),
    };
    log.debug("登録内容:", debugInfo);
  } catch (err) {
    log.error(err);
    throw err;
  }
}
