/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - ActivityLogsService                               ║
 * ║   Copyright (c) 2025 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   activity_logsテーブルを扱うサービスクラス                    ║
 * ║   主な機能：ログの挿入、更新、処理時間の計算、実行判定        ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルはactivity_logsテーブルを扱うサービスクラスです。
 * 主な機能：
 * - activity_logsテーブルへのログ挿入
 * - 最後の実行日時の取得
 * - 実行間隔の判定
 * - 処理時間の計算
 *
 * @file ActivityLogsService.js
 * @module server/service/ActivityLogsService
 * @version 1.0.0
 */

import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs } from "@metrojs/logjs";
import dayjs from "@metrojs/dayjs";
import { Consts } from "@common/config";

const log = new logjs("ActivityLogsService");

/**
 * activity_logsテーブルを扱うサービスクラス
 *
 * 使用例：
 * ```javascript
 * // 1. 基本的な使用方法
 * const activityLogsService = container.resolve(ActivityLogsService);
 *
 * // 2. ログの挿入
 * const logResult = await activityLogsService.insertLog({
 *   type: Consts.ACTIVITY_LOGS.TYPES.SAFIE_IMAGE_FETCH,
 *   name: Consts.ACTIVITY_LOGS.NAMES.SAFIE_IMAGE_FETCH,
 *   startTime: new Date().toISOString(),
 *   endTime: new Date().toISOString(),
 *   processingTime: 5000,
 *   isError: false,
 *   result: { success: true }
 * });
 *
 * // 3. 最後の実行日時を取得
 * const lastExecution = await activityLogsService.getLastExecutionTime(Consts.ACTIVITY_LOGS.TYPES.SAFIE_IMAGE_FETCH);
 *
 * // 4. 実行判定
 * const shouldExecute = await activityLogsService.shouldExecute({
 *   type: Consts.ACTIVITY_LOGS.TYPES.SAFIE_IMAGE_FETCH,
 *   intervalMinutes: 15
 * });
 * ```
 *
 * @extends Abstract
 */

const _FORMAT = "YYYY-MM-DD HH:mm:ss";

@injectable()
class ActivityLogsService extends Abstract {
  /**
   * コンストラクタ
   */
  constructor() {
    super();
    this.dbjs = globalThis.container.resolve("dbjs");
  }

  /**
   * ISO文字列をMySQL datetime形式に変換
   *
   * @param {string} isoString - ISO文字列
   * @returns {string} MySQL datetime形式文字列
   */
  _convertToMySQLDateTime(isoString) {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 19).replace("T", " ");
  }

  /**
   * 現在の日本時間をMySQL datetime形式で取得
   *
   * @returns {string} MySQL datetime形式文字列（日本時間）
   */
  _getCurrentJapanTime() {
    const now = new Date();
    // 日本時間（JST）はUTC+9時間
    const jstOffset = 9 * 60; // 9時間を分単位で表現
    const jstTime = new Date(now.getTime() + jstOffset * 60 * 1000);
    return jstTime.toISOString().slice(0, 19).replace("T", " ");
  }

  /**
   * activity_logsテーブルにログを挿入
   *
   * @param {Object} params - パラメータ
   * @param {number} params.type - ログタイプ
   * @param {string} params.name - ログ名
   * @param {string} params.startTime - 開始日時（ISO文字列）
   * @param {string} params.endTime - 終了日時（ISO文字列）
   * @param {number} params.processingTime - 処理時間（ミリ秒）
   * @param {boolean} params.isError - エラーフラグ
   * @param {Object} [params.result] - 実行結果（オプション）
   * @param {string} [params.registUser] - 登録者（デフォルト: 'admin'）
   * @returns {Promise<Object>} 挿入結果
   */
  async insertLog(params) {
    const { type, name, startTime, endTime, processingTime, isError, result, registUser = "admin" } = params;

    try {
      log.debug("activity_logsテーブルにログ挿入開始", {
        type,
        name,
        startTime,
        endTime,
        processingTime,
        isError,
      });

      // processingTimeが既に秒単位で渡されている場合は変換しない
      // ミリ秒単位で渡されている場合は秒に変換
      const processingTimeInSeconds = processingTime >= 1000 ? processingTime / 1000 : processingTime;

      const logData = {
        type,
        name,
        start: dayjs(startTime).format(_FORMAT),
        end: dayjs(endTime).format(_FORMAT),
        processing_time: processingTimeInSeconds, // 秒単位
        is_error: isError ? 1 : 0,
        regist_user: registUser,
        created_at: this._getCurrentJapanTime(),
      };

      // 結果情報をJSON形式で保存（オプション）
      if (result) {
        logData.result_data = JSON.stringify(result);
      }

      const insertResult = await this.dbjs.insert("activity_logs", logData);

      if (insertResult) {
        log.debug(`activity_logs保存成功: ID ${insertResult}`);
        return {
          success: true,
          logId: insertResult,
          message: "activity_logsにログを保存しました",
        };
      } else {
        throw new Error("activity_logs保存に失敗しました");
      }
    } catch (error) {
      log.error("activity_logs保存エラー", error);
      return {
        success: false,
        error: error.message,
        code: "ACTIVITY_LOG_SAVE_ERROR",
      };
    }
  }

  /**
   * activity_logsテーブルから最後の実行日時を取得
   *
   * @param {number} type - ログタイプ
   * @returns {Promise<string|null>} 最後の実行日時
   */
  async getLastExecutionTime(type) {
    try {
      log.debug(`activity_logsテーブルから最後の実行日時取得開始: type=${type}`);

      const sql = `
        SELECT end
        FROM activity_logs
        WHERE type = ? AND is_deleted = false
        ORDER BY end DESC
        LIMIT 1
      `;
      const result = await this.dbjs.selectOne(sql, [type]);

      if (result && result.end) {
        log.debug(`最後の実行日時取得成功: ${result.end}`);
        return result.end;
      } else {
        log.debug("最後の実行日時が見つかりませんでした");
        return null;
      }
    } catch (error) {
      log.error("最後の実行日時取得エラー", error);
      return null;
    }
  }

  /**
   * 実行間隔をチェックして実行すべきかどうかを判定
   *
   * @param {Object} params - パラメータ
   * @param {number} params.type - ログタイプ
   * @param {number} params.intervalMinutes - 実行間隔（分）
   * @returns {Promise<Object>} 実行判定結果
   */
  async shouldExecute(params) {
    const { type, intervalMinutes } = params;

    try {
      log.debug(`実行判定開始: type=${type}, intervalMinutes=${intervalMinutes}`);

      // 最後の実行日時を取得
      const lastExecutionTime = await this.getLastExecutionTime(type);

      if (!lastExecutionTime) {
        log.debug("最後の実行日時が存在しないため、実行します");
        return {
          shouldExecute: true,
          reason: "初回実行",
          remainingMinutes: 0,
        };
      }

      // 最後の実行日時から現在までの経過時間を計算
      const lastExecution = dayjs(lastExecutionTime);
      const now = dayjs();
      const elapsedMinutes = now.diff(lastExecution, "minute");

      log.debug(`経過時間: ${elapsedMinutes}分（間隔: ${intervalMinutes}分）`);

      if (elapsedMinutes >= intervalMinutes) {
        log.debug("実行間隔が経過しているため、実行します");
        return {
          shouldExecute: true,
          reason: "実行間隔経過",
          remainingMinutes: 0,
          lastExecutionTime: lastExecutionTime,
        };
      } else {
        const remainingMinutes = intervalMinutes - elapsedMinutes;
        log.debug(`実行間隔が経過していないため、スキップします（残り${remainingMinutes}分）`);
        return {
          shouldExecute: false,
          reason: "実行間隔未経過",
          remainingMinutes: remainingMinutes,
          lastExecutionTime: lastExecutionTime,
        };
      }
    } catch (error) {
      log.error("実行判定エラー", error);
      // エラーの場合は実行する（安全側）
      return {
        shouldExecute: true,
        reason: "エラー発生のため実行",
        remainingMinutes: 0,
      };
    }
  }

  /**
   * 処理時間を計算
   *
   * @param {Date|string} startTime - 開始時間
   * @param {Date|string} endTime - 終了時間
   * @returns {number} 処理時間（ミリ秒）
   */
  calculateProcessingTime(startTime, endTime) {
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    return end.diff(start);
  }

  /**
   * ログタイプ定数を取得
   *
   * @returns {Object} ログタイプ定数
   */
  getLogTypes() {
    return Consts.ACTIVITY_LOGS.TYPES;
  }

  /**
   * ログ名定数を取得
   *
   * @returns {Object} ログ名定数
   */
  getLogNames() {
    return Consts.ACTIVITY_LOGS.NAMES;
  }
}

export default ActivityLogsService;
