/**
 * データベーススキーマ生成スクリプト
 *
 * このスクリプトは以下の機能を提供します:
 * - sequelizeの設定を使用してデータベースに接続
 * - データベースのテーブル構造を解析
 * - スキーマ情報をJavaScriptオブジェクトとして出力
 *
 * @module generate_db
 * @requires @metrojs/common
 * @requires @metrojs/server
 */

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
import { fileURLToPath } from "url";
import logjs from "@krono-metro/metrojs/logjs";

const log = new logjs("generate_db");

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, "..");
const envPath = resolve(__dirname, "../../env/.env.development");
//const rootEnvPath = resolve(__dirname, "../../../env/.env.development");

//dotenvConfig({ path: envPath });

import config from "../src/config/config.js";
import { generateDbSchema } from "@krono-metro/metrojs/scripts";

// ログを出力しないdbjsをcontainerに登録
const sequelizeConfig = config.sequelize;
sequelizeConfig.config.logging = false;
sequelizeConfig.config.logLevel = "error";
sequelizeConfig.config.pool = {
  ...sequelizeConfig.config.pool,
  max: 2, // プール内の最大接続数 Postgres側の同時接続数は600
  min: 0, // プール内の最小接続数
};

log.info(" データベーススキーマ生成を開始します");
log.info(" Sequelize設定情報:");
log.info(`   • データベース: ${sequelizeConfig.config.database || "N/A"}`);
log.info(`   • ホスト: ${sequelizeConfig.config.host || "N/A"}`);
log.info(`   • ポート: ${sequelizeConfig.config.port || "N/A"}`);
log.info(`   • ユーザー: ${sequelizeConfig.config.username || "N/A"}`);
log.info("🔧 プール設定:");
log.info(`   • 最大接続数: ${sequelizeConfig.config.pool.max}`);
log.info(`   • 最小接続数: ${sequelizeConfig.config.pool.min}`);
log.info(`   • アイドルタイムアウト: ${sequelizeConfig.config.pool.idle || "N/A"}ms`);

//const log = new logjs("generate_db");
await generateDbSchema(sequelizeConfig, "db_schema.js", "./src/server/db/schema");
process.exit(0);

//log.info("schema", schema);
