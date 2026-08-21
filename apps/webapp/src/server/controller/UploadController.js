/**
 *
 * KronoMetro
 *
 * Copyright © 2025-present KronoMetro, Co. All rights reserved.
 *
 */
import { injectable } from "tsyringe";
import logjs from "@metrojs/logjs";
import { AbstractObject as Abstract } from "@common/server";
import { config } from "@common/config";
import { service, logic, utils } from "@lib/server";
import dayjs from "dayjs";

const { S3Service, MailService } = service;
const { Compress } = logic;
const log = new logjs("UploadController");

@injectable()
class UploadController extends Abstract {
  constructor() {
    super();
    log.debug("UploadController initialized");
  }
  
  async uploadToS3(req, dbjs) {
    const s3Service = new S3Service(config.amazon.Metrojs);
        
     try {
      const params = this.params;
      const uploadResults = [];

      for (const file of params.files) {
        const { name, type, text, isBase64 } = file;

        const timestamp = dayjs().format("YYYYMMDD_HHmmss");
        const safeFileName = await s3Service.getSafeFileName(`${timestamp}_${name}`);

        const buffer = await s3Service.getBuffer({
           text: text, 
           type: type, 
           isBase64: isBase64, 
          });
        const s3Key = `upload/${safeFileName}`;
        
        await s3Service.uploadFile({
          key: s3Key,
          body: buffer,
          contentType: type,
        });
        const url = await s3Service.getFileUrl(s3Key);

        uploadResults.push({
          name,
          s3Key,
          url,
        });
        if (!uploadResults) {
          log.warn(`ファイル [${name}] のアップロードに失敗しました`);
          continue; // そのファイルだけスキップ
        }
      }

      return { success: true, uploaded: uploadResults };
    } catch (err) {
      log.error("S3アップロード中にエラー", err);
      return {
        success: false,
        message: "S3アップロード処理で例外が発生しました",
        error: err.message,
      };
    }
  }
  
  async listUploadedFiles(req, dbjs) {
    const s3Service = new S3Service(config.amazon.Metrojs);
  
    try {
      const files = await s3Service.getListFiles("upload/");
      // CSVファイルのみにフィルタリング
      const csvFiles = files.filter(file => file.Key.endsWith(".csv"));
      const fileUrls = await Promise.all(
        csvFiles.map(async (file) => ({
          s3Key: file.Key,
          url: await s3Service.getFileUrl(file.Key),
          name: file.Key.split("/").pop(), // popの例  "upload/abc.csv" → "abc.csv"
        }))
      );
  
      return { success: true, files: fileUrls };
    } catch (err) {
      log.error("ファイル一覧取得失敗:", err);
      return { success: false, message: "一覧取得に失敗しました" };
    }
  }

  async downloadSelectedAsGzip(req, dbjs) {
    const s3Service = new S3Service(config.amazon.Metrojs);
    const params = this.params;
    try {
      const archiveContent = [];
  
      for (const key of params.files) {
        const obj = await s3Service.getFileObject(key);
        const filename = key.split("/").pop();
        const buffer = Buffer.isBuffer(obj.Body) ? obj.Body : Buffer.from(obj.Body);

        await new Promise((resolve, reject) => {
          pack.entry({ name: filename }, buffer, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        archiveContent.push(`\n===== ${key.split("/").pop()} =====\n`);
        archiveContent.push(obj.Body.toString("utf-8"));
      }
  
      const combined = archiveContent.join("\n");
      const gzipped = await utils.gzip(combined);
  
      return {
        success: true,
        filename: "files.gz",
        buffer: gzipped.toString("base64"),
      };
    } catch (err) {
      log.error("GZIP圧縮ダウンロード失敗:", err);
      return { success: false, message: "ダウンロード失敗", error: err.message };
    }
  }

  async downloadSelectedAsTarGz(req, dbjs) {
    const s3Service = new S3Service(config.amazon.Metrojs);
    const compress = new Compress();
    const params = this.params;
  
    try {
      // S3からファイルを取得し、圧縮対象の配列を構築
      const files = await Promise.all(
        params.files.map(async (key) => {
          const obj = await s3Service.getFileObject(key);
          return {
            name: key.split("/").pop(),
            content: Buffer.isBuffer(obj.Body)
              ? obj.Body
              : Buffer.from(new Uint8Array(obj.Body)),
          };
        })
      );
      const validFiles = files.filter(f => f !== null);

      if (validFiles.length === 0) {
        return {
          success: false,
          message: "ダウンロード対象ファイルが取得できませんでした",
        };
      }
  
      // 圧縮処理（base64形式で受け取る）
      const base64TarGz = await compress.toTarGzBase64(files);
  
      return {
        success: true,
        filename: "files.tar.gz",
        buffer: base64TarGz,
      };
    } catch (err) {
      log.error("TAR.GZ圧縮ダウンロード失敗:", err);
      return {
        success: false,
        message: "ダウンロード失敗",
        error: err.message,
      };
    }
    
  }

  async sendSelectedFilesByMail(req, dbjs) {
    const s3Service = new S3Service(config.amazon.Metrojs);
    const mailService = new MailService(config.amazon.Metrojs);
    const compress = new Compress();
    const params = this.params;
  
    try {
      // S3からファイルを取得し、圧縮用の配列を作成
      const files = await Promise.all(
        params.files.map(async (key) => {
          const obj = await s3Service.getFileObject(key);
          return {
            name: key.split("/").pop(),
            content: Buffer.isBuffer(obj.Body)
              ? obj.Body
              : Buffer.from(obj.Body),
          };
        })
      );
  
      // 圧縮して base64 を取得
      const base64Gzip = await compress.toTarGzBase64(files);
  
      // base64 → Buffer に変換して添付ファイルに使用
      const gzipBuffer = Buffer.from(base64Gzip, "base64");
  
      // メール送信パラメータ設定
      const mailParams = {
        mailTo: params.mailTo,
        mailCc: params.mailCc,
        mailBcc: params.mailBcc,
        mail_title: params.mail_title,
        mail_text: params.mail_text,
        attachments: [
          {
            filename: params.attachmentName,
            content: gzipBuffer,
            contentType: "application/gzip",
          },
        ],
      };
  
      const messageId = await mailService.sendMail(mailParams);
  
      if (messageId) {
        return {
          success: true,
          message: "メール送信に成功しました",
          messageId: messageId.MessageId,
        };
      } else {
        return {
          success: false,
          message: "メール送信に失敗しました",
        };
      }
    } catch (err) {
      log.error("メール送信中にエラー", err);
      return {
        success: false,
        message: "送信処理で例外が発生しました",
        error: err.message,
      };
    }
  }

}

export default UploadController;
