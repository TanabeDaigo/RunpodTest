/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Dependency Injection Container                    ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   DIコンテナの初期化とデータベース接続の設定を行う            ║
 * ║   コンテナ管理モジュール                                      ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはDIコンテナの初期化と管理を行います。
 * 主な機能：
 * - DIコンテナの初期化
 * - データベース接続の設定
 * - モジュールの登録
 * - グローバルコンテナの管理
 *
 * @file createDIContainer.js
 * @module server/createDIContainer
 */

import "reflect-metadata";
import { container } from "tsyringe";
import * as objects from "./index.js";
import { Sequelize } from "sequelize";
import { config, db_schema, logjs, dbjs, utils } from "@lib/server";

import * as dao from "@common/dao";
import * as logic from "@common/logic";
import * as service from "@common/service";

const log = new logjs("createDIContainer");

/**
 * DIコンテナを初期化し、データベース接続を設定する
 * サーバーサイドでのみ実行可能
 *
 * @async
 * @function createDIContainer
 * @returns {Promise<Container>} 初期化されたDIコンテナ
 *
 * @example
 * // サーバー起動時にDIコンテナを初期化
 * const container = await createDIContainer();
 */
export async function createDIContainer() {
  log.info(`createDIContainer------------------------  ${utils.uuid()}`);

  if (!globalThis.container) {
    // クライアントサイドでの実行を防止
    if (typeof window !== "undefined") {
      log.warn("createDIContainer.jsはサーバーサイドでのみ実行可能です");
      return null;
    }
    try {
      log.info("createDIContainer -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-", config);

      /**
       * データベース接続の初期化
       * Sequelizeインスタンスを作成し、接続を確立
       */
      log.info("createDIContainer - データベース接続を初期化中...");
      const dbjsInstance = new dbjs(Sequelize, config.sequelize, db_schema);
      await dbjsInstance.connect();
      log.info("createDIContainer - データベース接続が確立されました");

      // dbjsモジュールをcontainerに登録
      container.register("dbjs", { useValue: dbjsInstance });

      // ログを出力しないdbjsをcontainerに登録
      const sequelizeConfig = config.sequelize;
      sequelizeConfig.config.logging = false;
      sequelizeConfig.config.logLevel = "error";
      sequelizeConfig.config.pool = {
        ...sequelizeConfig.config.pool,
        max: 10, // プール内の最大接続数 Postgres側の同時接続数は600
        min: 3, // プール内の最小接続数
      };
      log.info("createDIContainer - ログを出力しないdbjsをcontainerに登録");
      const dbjsNoLog = await new dbjs(Sequelize, sequelizeConfig, db_schema);
      await dbjsNoLog.connect();
      container.register("dbjsNoLog", { useValue: dbjsNoLog });

      log.info("createDIContainer - dbjsモジュールが登録されました");

      /**
       * コンテナ生成
       * 環境に応じて異なる登録方法を使用
       */
      const environment = process.env.NODE_ENV || "development";
      const _target = { ...objects, ...dao, ...logic, ...service };
      if (environment === "development") {
        // 開発環境: server/index.jsの内容をuseClassで登録
        log.info("createDIContainer - 開発環境: server/index.jsの内容を登録中...", _target);

        for (const key in _target) {
          log.info(`createDIContainer - 開発環境登録中: ${key}`);
          await container.register(key, { useValue: _target[key] });
        }

        log.info("createDIContainer - 開発環境: すべてのモジュールが登録されました");
      } else {
        // 本番環境: @injectable()デコレータによる自動登録 + 手動登録
        log.info("createDIContainer - 本番環境: モジュールを登録中...");
        for (const key in _target) {
          log.info(`createDIContainer - 本番環境登録中: ${key}`);
          // @injectable()デコレータを使用しているクラスは自動登録されるが、
          // 手動登録も行う（useClassで登録）
          await container.register(key, { useClass: _target[key] });
        }
        log.info("createDIContainer - 本番環境: すべてのモジュールが登録されました");
      }

      globalThis.container = container;
      log.info("createDIContainer - グローバルコンテナが設定されました");

      // 登録されたモジュールの確認
      //const registeredNames = container.getAllRegisteredNames();
      //log.info("createDIContainer - 登録されたモジュール:", registeredNames);
    } catch (err) {
      log.error("DIコンテナ初期化エラー:", err);
      log.error("エラー詳細:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
      });
      throw err; // エラーを上位に伝播
    }
    log.info("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
  } else {
    log.info("createDIContainer - 既存のコンテナが使用されます");
  }
  return globalThis.container;
}

/**
 * DIコンテナをクリアする
 * 開発中にコンテナを再初期化するために使用
 */
export function clearDIContainer() {
  if (globalThis.container) {
    log.info("DIコンテナをクリアしています...");
    globalThis.container.clearInstances();
    globalThis.container = null;
  }
}

/**
 * DIコンテナを再初期化する
 * 開発中にコンテナを再読み込みするために使用
 */
export async function reloadDIContainer() {
  log.info("DIコンテナを再読み込みしています...");
  clearDIContainer();
  return await createDIContainer();
}
