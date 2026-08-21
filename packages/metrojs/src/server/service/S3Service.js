/**
 *
 * KronoMetro
 *
 * Copyright © 2025-present KronoMetro, Co. All rights reserved.
 *
 */

import logjs from "@metrojs/logjs";
import iconv from "iconv-lite";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const log = new logjs("S3Service");

class S3Service {
  constructor(config) {
    this.config = config;
  }

   /**
   * AWS SDKの初期化処理（内部的に使われる）
   * - 初回のみ設定
   * - 再利用性のため、既に初期化済みならスキップ
   */
  async init() {
    if (!this.s3) {
      this.s3 = new S3Client({
        credentials: {
          accessKeyId: this.config.S3_cred_key,
          secretAccessKey: this.config.S3_secret_key,
        },
        region: this.config.region_code,
      });
    }
  }

  /**
   * ファイルをS3にアップロード
   * @param {Object} param0
   * @param {string} param0.key - S3上のパス（例: "upload/example.csv"）
   * @param {Buffer} param0.body - アップロードするデータ
   * @param {string} param0.contentType - MIMEタイプ（例: "text/csv"）
   * @returns {Promise<Object|null>}
   */
  async uploadFile({ key, body, contentType }) {
    await this.init();

    const command = new PutObjectCommand({
      Bucket: this.config.bucket_name,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    try {
      const data = await this.s3.send(command);
      log.debug("S3 Upload Success:", data);
      return {
        ...data,
        Location: `https://${this.config.bucket_name}.s3.${this.config.region_code}.amazonaws.com/${key}`,
        key: key,
      };
    } catch (err) {
      log.error("S3 Upload Error:", err);
      return null;
    }
  }

    /**
     * S3上の指定キーのオブジェクトを削除
     * @param {string} key - 削除するS3キー
     * @returns {Promise<boolean>} 削除成功ならtrue
     */
    async deleteFile(key) {
      await this.init();

      if (!key) {
        log.warn("deleteFile: keyが指定されていません");
        return false;
      }

      const command = new DeleteObjectCommand({
        Bucket: this.config.bucket_name,
        Key: key,
      });

      try {
        await this.s3.send(command);
        log.debug(`S3ファイル削除成功: ${key}`);
        return true;
      } catch (err) {
        log.error(`S3ファイル削除エラー: ${key}`, err);
        return false;
      }
    }

  /**
   * S3オブジェクトの署名付きURLを生成
   * 一時的に有効なダウンロードリンクを取得したい場合に利用
   * @param {string} key - S3のファイルパス
   * @returns {string|null}
   */
  async getFileUrl(key) {
    await this.init();

    const command = new GetObjectCommand({
      Bucket: this.config.bucket_name,
      Key: key,
    });

    try {
      return await getSignedUrl(this.s3, command, {
        expiresIn: this.config.expires, // 有効期限（秒）
      });
    } catch (err) {
      log.error("S3 URL生成エラー:", err);
      return null;
    }
  }

  /**
   * 指定プレフィックスに一致するファイル一覧を取得
   * @param {string} prefix - 例: "upload/"
   * @returns {Array} S3オブジェクトリスト
   */
  async getListFiles(prefix = "") {
    await this.init();
  
    const command = new ListObjectsV2Command({
      Bucket: this.config.bucket_name,
      Prefix: prefix,
    });
  
    try {
      const data = await this.s3.send(command);
      return data.Contents || [];
    } catch (err) {
      log.error("S3 getListFiles error:", err);
      return [];
    }
  }

  /**
   * 指定キーのS3オブジェクトを取得
   * @param {string} key - ファイルのS3キー
   * @returns {Object|null}
   */
  async getFileObject(key) {
    await this.init();
  
    const command = new GetObjectCommand({
      Bucket: this.config.bucket_name,
      Key: key,
    });
  
    try {
      const data = await this.s3.send(command);
      return data;
    } catch (err) {
      log.error("S3 getObject error:", err);
      return null;
    }
  }

  /**
   * ファイル名をS3対応の安全な形式に変換する
   * @param {string} name - 元のファイル名
   * @returns {string} 安全なファイル名
   */
  async getSafeFileName(name) {
    if (typeof name !== "string") return "";
    return name.replace(/[\\/:*?"<>|]/g, "_");
  }

  /**
   * テキストからBufferを生成（エンコーディング対応）
   * @param {string} text - 入力テキストまたはbase64文字列
   * @param {string} type - MIMEタイプ（例: "text/csv", "image/jpeg" など）
   * @param {boolean} isBase64 - base64形式かどうか（true/false）
   * @param {string} encoding - 明示的な文字コード（例: 'sjis', 'utf8', 'base64' など）
   * @returns {Buffer}
   */
  async getBuffer({ text, type = "", isBase64 = false, encoding = "utf8" }) {
    if (encoding === "base64") {
      return Buffer.from(text, "base64");
    } else if (encoding.toLowerCase() === "sjis" || encoding.toLowerCase() === "shift_jis") {
      return iconv.encode(text, "Shift_JIS");
    } else if (isBase64 || type.startsWith("image/") || type === "application/pdf") {
      return Buffer.from(text, "base64");
    } else {
      return Buffer.from(text, "utf8");
    }
  }
}

export default S3Service;
