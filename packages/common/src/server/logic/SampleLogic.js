/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Sample Logic                                     ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   基本的なサンプルロジック                                    ║
 * ║   主な機能：基本的なCRUD操作、サンプルデータ処理              ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * このファイルは基本的なサンプルロジックです。
 * 主な機能：
 * - 基本的なCRUD操作
 * - サンプルデータの処理
 * - データベース操作の基本例
 *
 * @file SampleLogic.js
 * @module server/logic/SampleLogic
 * @version 1.0.0
 */

import { injectable } from "tsyringe";
import { AbstractObject as Abstract } from "@common/server";
import { logjs, sqljs } from "@lib/server";
import dayjs from "dayjs";

const log = new logjs("SampleLogic");

/**
 * サンプルデータの状態定数
 */
const SAMPLE_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  DELETED: -1,
};

/**
 * 操作結果の定数
 */
const OPERATION_RESULT = {
  SUCCESS: "success",
  ERROR: "error",
  NOT_FOUND: "not_found",
};

/**
 * 基本的なサンプルロジック
 *
 * 使用例：
 * ```javascript
 * // 1. 基本的な使用方法
 * const sampleLogic = container.resolve(SampleLogic);
 *
 * // サンプルデータを作成
 * const result = await sampleLogic.createSampleData({
 *   name: "サンプル",
 *   description: "説明文",
 *   status: 1
 * });
 *
 * // 2. サンプルデータを取得
 * const data = await sampleLogic.getSampleData(1);
 *
 * // 3. サンプルデータを更新
 * const updateResult = await sampleLogic.updateSampleData(1, {
 *   name: "更新されたサンプル"
 * });
 * ```
 *
 * @extends Abstract
 */
@injectable()
class SampleLogic extends Abstract {
  /**
   * コンストラクタ
   */
  constructor() {
    super();
    log.debug("SampleLogic initialized");
  }

  /**
   * 現在時刻を取得
   * @returns {string} 現在時刻（YYYY-MM-DD HH:mm:ss形式）
   */
  async _now() {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  }

  /**
   * サンプルデータを作成
   *
   * @param {Object} params - パラメータ
   * @param {string} params.name - 名前
   * @param {string} params.description - 説明
   * @param {number} params.status - ステータス
   * @param {string} params.userName - 作成者名
   * @returns {Promise<Object>} 作成結果
   */
  async createSampleData(params) {
    log.debug(`createSampleData called with params:`, params);

    const { name, description, status = SAMPLE_STATUS.ACTIVE, userName } = params;

    try {
      // パラメータ検証
      if (!name) {
        throw new Error("名前が必要です");
      }

      if (!userName) {
        throw new Error("ユーザー名が必要です");
      }

      // サンプルデータを構築
      const sampleData = {
        name,
        description: description || "",
        status,
        regist_user: userName,
        regist_date: await this._now(),
        update_user: userName,
        update_date: await this._now(),
      };

      // データベースに挿入
      const result = await this.dbjs.insert("sample_data", sampleData);

      if (result) {
        log.debug(`サンプルデータ作成成功: ${name}`);
        return {
          success: true,
          id: result,
          name,
          message: "サンプルデータを作成しました",
        };
      } else {
        throw new Error("データベース保存に失敗しました");
      }
    } catch (error) {
      log.error("createSampleData error", error);
      return {
        success: false,
        error: error.message,
        code: "CREATE_ERROR",
      };
    }
  }

  /**
   * サンプルデータを取得
   *
   * @param {number} id - サンプルデータID
   * @returns {Promise<Object>} 取得結果
   */
  async getSampleData(id) {
    log.debug(`getSampleData called with id:`, id);

    try {
      if (!id) {
        throw new Error("IDが必要です");
      }

      const sql = `SELECT * FROM sample_data WHERE id = ? AND status != ?`;
      const data = await this.dbjs.selectOne(sql, [id, SAMPLE_STATUS.DELETED]);

      if (data) {
        return {
          success: true,
          data,
          message: "サンプルデータを取得しました",
        };
      } else {
        return {
          success: false,
          error: "サンプルデータが見つかりません",
          code: OPERATION_RESULT.NOT_FOUND,
        };
      }
    } catch (error) {
      log.error("getSampleData error", error);
      return {
        success: false,
        error: error.message,
        code: "READ_ERROR",
      };
    }
  }

  /**
   * サンプルデータ一覧を取得
   *
   * @param {Object} params - パラメータ
   * @param {number} params.limit - 取得件数制限
   * @param {number} params.offset - オフセット
   * @param {number} params.status - ステータスフィルター
   * @returns {Promise<Object>} 取得結果
   */
  async getSampleDataList(params = {}) {
    log.debug(`getSampleDataList called with params:`, params);

    const { limit = 100, offset = 0, status } = params;

    try {
      let sql = `SELECT * FROM sample_data WHERE status != ?`;
      const params = [SAMPLE_STATUS.DELETED];

      if (status !== undefined) {
        sql += ` AND status = ?`;
        params.push(status);
      }

      sql += ` ORDER BY regist_date DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const data = await this.dbjs.select(sql, params);

      return {
        success: true,
        data,
        count: data.length,
        limit,
        offset,
        message: "サンプルデータ一覧を取得しました",
      };
    } catch (error) {
      log.error("getSampleDataList error", error);
      return {
        success: false,
        error: error.message,
        code: "READ_ERROR",
      };
    }
  }

  /**
   * サンプルデータを更新
   *
   * @param {number} id - サンプルデータID
   * @param {Object} updateData - 更新データ
   * @param {string} userName - 更新者名
   * @returns {Promise<Object>} 更新結果
   */
  async updateSampleData(id, updateData, userName) {
    log.debug(`updateSampleData called with id: ${id}, updateData:`, updateData);

    try {
      if (!id) {
        throw new Error("IDが必要です");
      }

      if (!userName) {
        throw new Error("ユーザー名が必要です");
      }

      // 更新データを構築
      const dataToUpdate = {
        ...updateData,
        update_user: userName,
        update_date: await this._now(),
      };

      // データベースを更新
      const result = await this.dbjs.update("sample_data", dataToUpdate, { id });

      if (result) {
        log.debug(`サンプルデータ更新成功: ${id}`);
        return {
          success: true,
          id,
          message: "サンプルデータを更新しました",
        };
      } else {
        return {
          success: false,
          error: "サンプルデータが見つかりません",
          code: OPERATION_RESULT.NOT_FOUND,
        };
      }
    } catch (error) {
      log.error("updateSampleData error", error);
      return {
        success: false,
        error: error.message,
        code: "UPDATE_ERROR",
      };
    }
  }

  /**
   * サンプルデータを削除（論理削除）
   *
   * @param {number} id - サンプルデータID
   * @param {string} userName - 削除者名
   * @returns {Promise<Object>} 削除結果
   */
  async deleteSampleData(id, userName) {
    log.debug(`deleteSampleData called with id: ${id}`);

    try {
      if (!id) {
        throw new Error("IDが必要です");
      }

      if (!userName) {
        throw new Error("ユーザー名が必要です");
      }

      // 論理削除（ステータスをDELETEDに設定）
      const result = await this.dbjs.update(
        "sample_data",
        {
          status: SAMPLE_STATUS.DELETED,
          update_user: userName,
          update_date: await this._now(),
        },
        { id }
      );

      if (result) {
        log.debug(`サンプルデータ削除成功: ${id}`);
        return {
          success: true,
          id,
          message: "サンプルデータを削除しました",
        };
      } else {
        return {
          success: false,
          error: "サンプルデータが見つかりません",
          code: OPERATION_RESULT.NOT_FOUND,
        };
      }
    } catch (error) {
      log.error("deleteSampleData error", error);
      return {
        success: false,
        error: error.message,
        code: "DELETE_ERROR",
      };
    }
  }

  /**
   * サンプルデータの統計情報を取得
   *
   * @returns {Promise<Object>} 統計情報
   */
  async getSampleDataStats() {
    log.debug(`getSampleDataStats called`);

    try {
      const sql = `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as active,
          SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as inactive,
          SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as deleted
        FROM sample_data
      `;

      const stats = await this.dbjs.selectOne(sql, [SAMPLE_STATUS.ACTIVE, SAMPLE_STATUS.INACTIVE, SAMPLE_STATUS.DELETED]);

      return {
        success: true,
        stats,
        message: "統計情報を取得しました",
      };
    } catch (error) {
      log.error("getSampleDataStats error", error);
      return {
        success: false,
        error: error.message,
        code: "STATS_ERROR",
      };
    }
  }

  /**
   * サンプルデータを検索
   *
   * @param {Object} params - パラメータ
   * @param {string} params.keyword - 検索キーワード
   * @param {number} params.limit - 取得件数制限
   * @param {number} params.offset - オフセット
   * @returns {Promise<Object>} 検索結果
   */
  async searchSampleData(params = {}) {
    log.debug(`searchSampleData called with params:`, params);

    const { keyword, limit = 100, offset = 0 } = params;

    try {
      if (!keyword) {
        throw new Error("検索キーワードが必要です");
      }

      const sql = `
        SELECT * FROM sample_data 
        WHERE status != ? 
        AND (name LIKE ? OR description LIKE ?)
        ORDER BY regist_date DESC 
        LIMIT ? OFFSET ?
      `;

      const searchPattern = `%${keyword}%`;
      const data = await this.dbjs.select(sql, [SAMPLE_STATUS.DELETED, searchPattern, searchPattern, limit, offset]);

      return {
        success: true,
        data,
        count: data.length,
        keyword,
        limit,
        offset,
        message: "検索が完了しました",
      };
    } catch (error) {
      log.error("searchSampleData error", error);
      return {
        success: false,
        error: error.message,
        code: "SEARCH_ERROR",
      };
    }
  }
}

export default SampleLogic;
