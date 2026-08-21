/**
 *
 * KronoMetro
 *
 * Copyright © 2024-present KronoMetro, Co. All rights reserved.
 *
 */
import { injectable } from "tsyringe";
import logjs from "@metrojs/logjs";
import { AbstractObject as Abstract } from "@common/server";

const log = new logjs("DownloadtestController");

@injectable()
class DownloadtestController extends Abstract {
  constructor() {
    super();
    log.debug("constructor START!!");
  }

  /**
   * CSVダウンロードテスト処理（Next.js用）
   * @param {Request} req - NextRequest互換のリクエストオブジェクト
   * @param {Object} dbjs - DB接続（未使用）
   * @returns {Response} CSVファイルレスポンス
   */
  async downloadTest(req, dbjs) {
    const { data, filename } = this.params;
  
    if (!Array.isArray(data) || data.length === 0) {
      return { success: false, message: "データが空です" };
    }
  
    const csvContent = data
      .map(row =>
        row.map(item => {
          const str = String(item);
          return str.includes(",") || str.includes("\n") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        }).join(",")
      ).join("\n");
  
    return {
      success: true,
      filename: filename,
      csv: csvContent,
    };
  }
}

export default DownloadtestController;
