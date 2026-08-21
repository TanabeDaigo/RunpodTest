/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Next.js Instrumentation                          ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   サーバー初期化とDIコンテナの構築を管理する                  ║
 * ║   インストゥルメンテーションモジュール                        ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはNext.jsのインストゥルメンテーションを定義します。
 * 主な機能：
 * - サーバー初期化時の処理
 * - DIコンテナの構築
 * - データベース接続の初期化
 * - ランタイム環境の判定
 *
 * 注意: このファイルを実行するには、.npmrcファイルに以下の設定が必要です:
 * enable-instrumentation=true
 *
 * @file instrumentation.js
 * @module instrumentation
 */

import "reflect-metadata"; // tsyringeのためのreflect-metadataポリフィル
import logjs from "@metrojs/logjs"; // Client,serverから呼ばれるので直接インポートする
const log = new logjs("instrumentation.js");

/**
 * サーバー初期化時に実行される関数
 * 新しいNext.jsサーバーインスタンスが初期化されたときに1回呼び出されます
 *
 * @async
 * @function register
 * @returns {Promise<void>}
 *
 * @example
 * // サーバー起動時に自動的に実行されます
 * await register();
 */
export async function register() {
  log.info(`instrumentation.js register process.env.NEXT_RUNTIME:${process.env.NEXT_RUNTIME}`);

  // Node.js ランタイムの場合のみDBモジュールを初期化
  // Edge Runtimeではデータベース接続が制限されているため、Node.js環境でのみ実行
  if (process.env.NEXT_RUNTIME === "nodejs") {
    log.info(`【Server初期起動時 START】register NEXT_RUNTIME:${process.env.NEXT_RUNTIME}`);

    if (typeof window === "undefined") {
      try {
        /**
         * DIコンテナの構築とデータベース初期化
         * サーバー起動時に1回だけ実行
         * Edge Runtimeでは実行されない
         */
        log.info("DIコンテナ構築");
        // サーバーサイドでのみ実行されるように、条件付きでインポート
        const { createDIContainer } = await import("./server/createDIContainer.js");
        const container = await createDIContainer();
        //log.info(`container:`, container);
        if (!container) {
          throw new Error("DIコンテナの初期化に失敗しました");
        }
      } catch (error) {
        log.error(`Database初期化エラー: ${error.message}`);
        // エラーをスローして初期化の失敗を通知
        throw error;
      }
      /*
      try {
        //クーロンの実行（本番環境でのみ実行）
        if (process.env.NODE_ENV === "production") {
          log.info("クーロンの実行");
          const crons = await import("./server/crons/index.js");
          crons.default();
        } else {
          log.info("開発環境のためクーロンの実行をスキップ");
        }
      } catch (error) {
        log.error(`Cronの実行エラー: ${error.message}`);
        // エラーをスローして初期化の失敗を通知
        throw error;
      }
      */
    }

    log.info(`【Server初期起動時 END】---------------------------------------------`);
  }
}
