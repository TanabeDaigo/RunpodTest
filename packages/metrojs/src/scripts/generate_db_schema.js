/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Database Schema Generator                         ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A powerful database schema generator that automatically     ║
 * ║   extracts and formats database structure information         ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file generate_db_schema.js
 * @description データベースのスキーマ情報を自動生成するモジュール
 *
 * 主な機能:
 * - データベーススキーマの自動抽出
 * - テーブルとカラム情報の整形
 * - スキーマ情報のファイル出力
 * - 複数データベース対応
 *
 * @example
 * // スキーマ生成の実行
 * const config = {
 *   database: 'my_database',
 *   user: 'root',
 *   pass: 'password',
 *   config: {
 *     dialect: 'mysql',
 *     host: 'localhost'
 *   }
 * };
 *
 * const schema = await generateDbSchema(config);
 * // 結果: {table1: {column1: {type: 'varchar', ...}}, ...}
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

import Sequelize from "sequelize";
import fs from "fs";
import logjs from "@krono-metro/metrojs/logjs";
import { getSchemaQuery } from "./lib/getSchemaQuery.js";

// ロガーのインスタンスを作成
const log = new logjs("generate_db_schema");

/**
 * データベーススキーマを生成する関数
 * @param {Object} sequelizeConfig - Sequelizeの設定オブジェクト
 * @param {string} [outputFileName="db_schema.js"] - 出力ファイル名
 * @param {string} [outputDirPath="./src/db/schema"] - 出力ディレクトリパス
 * @returns {Promise<Object>} 生成されたスキーマ情報
 * @description データベースからスキーマ情報を抽出し、指定されたファイルに出力します
 * @example
 * const schema = await generateDbSchema({
 *   database: 'my_db',
 *   user: 'root',
 *   pass: 'password',
 *   config: {
 *     dialect: 'mysql',
 *     host: 'localhost'
 *   }
 * });
 */
export const generateDbSchema = async (sequelizeConfig, outputFileName = "db_schema.js", outputDirPath = "./src/db/schema") => {
  log.info("generate_db_schema start");

  log.info("config.sequelize", sequelizeConfig);

  // Sequelizeの設定オブジェクトを正規化
  const _sequelizeConfig = {
    dialect: sequelizeConfig.config.dialect,
    host: sequelizeConfig.config.host,
    database: sequelizeConfig.database,
    username: sequelizeConfig.user,
    password: sequelizeConfig.pass,
    pool: sequelizeConfig.config.pool,
    dialectOptions: sequelizeConfig.config.dialectOptions,
    timezone: sequelizeConfig.config.timezone,
  };

  // Sequelizeインスタンスを作成
  const sequelize = new Sequelize(_sequelizeConfig);

  /**
   * データベースのスキーマ情報を変換する関数
   * @param {Array} data - データベースから取得した生のスキーマ情報
   * @returns {Object} 整形されたスキーマ情報
   * @description データベースから取得した生のスキーマ情報を、アプリケーションで使用しやすい形式に変換します
   * @example
   * const rawData = [
   *   {
   *     table_name: 'users',
   *     column_name: 'id',
   *     data_type: 'int',
   *     is_nullable: 'NO',
   *     column_key: 'PRI'
   *   }
   * ];
   * const transformed = transformData(rawData);
   * // 結果: {users: {id: {type: 'int', is_primary_key: true, ...}}}
   */
  const transformData = (data) => {
    const result = {};
    data.forEach((item) => {
      const tableName = item.table_name;
      const columnName = item.column_name;
      if (!result[tableName]) {
        result[tableName] = {};
      }
      // カラム情報を整形
      result[tableName][columnName] = {
        type: item.data_type,
        is_null: item.is_nullable === "YES" ? true : false,
        is_auto_increment: item.is_auto_increment,
        is_type_num: ["int", "bigint", "decimal", "float", "double"].includes(item.data_type) ? true : false,
        max_length: item.max_length,
        default: item.column_default,
        is_primary_key: item.column_key === "PRI" ? true : false,
        extra: item.extra,
        comment: item.column_comment,
      };
    });
    return result;
  };

  let results = {};

  log.info(`テーブル処理開始`);

  // データベースからスキーマ情報を取得
  const schemaResult = await sequelize.query(getSchemaQuery(sequelizeConfig.database, sequelizeConfig.config.dialect));
  const schema = schemaResult[0];

  // スキーマ情報を変換
  results = transformData(schema);

  // 引数からファイル名と出力先を取得、未指定の場合はデフォルト値を使用
  const fileName = outputFileName;
  const dirPath = outputDirPath;

  // 出力先のファイルパスを設定
  const filePath = `${dirPath}/${fileName}`;

  // 出力先ディレクトリが存在しない場合は作成
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // スキーマ情報をJSON文字列に変換
  const schemaString = JSON.stringify(results, null, 4);
  // JavaScript形式のエクスポート文を作成
  const jsContent = `export const schema = ${schemaString};`;

  // ファイルに書き出し
  try {
    await fs.promises.writeFile(filePath, jsContent);
  } catch (error) {
    log.error(`ファイル書き込みエラー: ${error.message}`);
  }

  log.info(`テーブル処理完了 filePath: ${filePath}`);
  return results;
};
