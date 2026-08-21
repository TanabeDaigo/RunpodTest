/**
 * サクッと記録（Sakutto）Controller
 * PostgreSQL sakutto_records への保存・一覧（ユーザーはセッション / MySQL 側 ID）
 */

import { injectable } from "tsyringe";
import logjs from "@metrojs/logjs";
import { AbstractObject as Abstract } from "@common/server";
import {
  getSakuttoRecordByDate as fetchSakuttoRecordByDate,
  listRecentSakuttoRecords as fetchRecentSakuttoRecords,
  resolveSakuttoUserId,
  toDateString,
  upsertSakuttoRecord as saveSakuttoRecord,
} from "../llm/postgresSakutto.js";
import { getLlmPgPublicConfig } from "../llm/postgresPrice.js";

const log = new logjs("SakuttoController");

@injectable()
class SakuttoController extends Abstract {
  constructor() {
    super();
    log.debug("SakuttoController initialized");
  }

  /**
   * body: {
   *   mode: "upsertSakuttoRecord",
   *   recordDate?, achievement?, meals?, play?, sleep?, note?, summary?, photoPath?
   * }
   */
  async upsertSakuttoRecord(req) {
    try {
      const userId = resolveSakuttoUserId(req?.session);
      if (!userId) {
        return { success: false, error: "ログインユーザーが取得できませんでした" };
      }

      const {
        recordDate,
        achievement,
        meals,
        play,
        sleep,
        note,
        summary,
        photoPath,
      } = this.params || {};

      const record = await saveSakuttoRecord({
        userId,
        recordDate: recordDate || toDateString(),
        achievement,
        meals,
        play,
        sleep,
        note,
        summary,
        photoPath,
      });

      return {
        success: true,
        record,
        userId,
      };
    } catch (err) {
      log.error("upsertSakuttoRecord error", err);
      return {
        success: false,
        error: err.message,
        config: getLlmPgPublicConfig(),
      };
    }
  }

  /**
   * body: { mode: "getSakuttoRecord", recordDate }
   */
  async getSakuttoRecord(req) {
    try {
      const userId = resolveSakuttoUserId(req?.session);
      if (!userId) {
        return { success: false, error: "ログインユーザーが取得できませんでした", record: null };
      }

      const recordDate = String(this.params?.recordDate || "").trim() || toDateString();
      const record = await fetchSakuttoRecordByDate(userId, recordDate);

      return {
        success: true,
        userId,
        recordDate,
        record,
      };
    } catch (err) {
      log.error("getSakuttoRecord error", err);
      return {
        success: false,
        error: err.message,
        record: null,
        config: getLlmPgPublicConfig(),
      };
    }
  }

  /**
   * body: { mode: "listSakuttoRecords", limit? }
   */
  async listSakuttoRecords(req) {
    try {
      const userId = resolveSakuttoUserId(req?.session);
      if (!userId) {
        return { success: false, error: "ログインユーザーが取得できませんでした", records: [] };
      }

      const limit = this.params?.limit ?? 10;
      const records = await fetchRecentSakuttoRecords(userId, limit);

      return {
        success: true,
        userId,
        count: records.length,
        records,
      };
    } catch (err) {
      log.error("listSakuttoRecords error", err);
      return {
        success: false,
        error: err.message,
        records: [],
        config: getLlmPgPublicConfig(),
      };
    }
  }
}

export default SakuttoController;
