/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Cryptography Utilities                           ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A secure cryptography utility library that provides        ║
 * ║   AES-256-CBC encryption and decryption capabilities         ║
 * ║   with customizable options and key management               ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file crypto.js
 * @description 暗号化ユーティリティライブラリ
 *
 * 主な機能:
 * - AES-256-CBC暗号化と復号化
 * - カスタマイズ可能な暗号化オプション
 * - 安全なキー管理
 * - エラーハンドリングとバリデーション
 *
 * @example
 * import { encrypted, decrypted } from '@krono-metro/metrojs/utils/crypto';
 *
 * // データの暗号化
 * const data = 'sensitive information';
 * const encryptedData = encrypted(data);
 *
 * // データの復号化
 * const decryptedData = decrypted(encryptedData);
 *
 * // カスタムキーでの暗号化
 * const customEncrypted = encrypted(data, {
 *   encryptionKey: 'myCustomEncryptionKey1234567890123456',
 *   bufferKey: 'myCustomBufferKey'
 * });
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

// このファイルはEdge Runtimeでは使用しない
// 代わりにWeb Crypto APIを使用する実装に変更する必要があります

import crypto from "crypto";

// デフォルトオプションをObject.freezeで不変に
const DEFAULT_OPTIONS = Object.freeze({
  encryptionKey: "KronoMetroCryptoKeyBase20121203a", // 32Byte
  bufferKey: "KronoMetroCrypto", // 16byte
  encryptMethod: "aes-256-cbc", // 暗号化方式
  encoding: "hex", // 暗号化時のencoding
});

// バッファキーを事前に生成
const DEFAULT_IV = Buffer.from(DEFAULT_OPTIONS.bufferKey);
const DEFAULT_KEY = Buffer.from(DEFAULT_OPTIONS.encryptionKey);

const customKey = "12345678901234567890123456789012"; // 32バイト
const customIV = "1234567890123456"; // 16バイト
const wrongKey = "abcdefghabcdefghabcdefghabcdefgh12"; // 32バイト
const wrongIV = "abcdefabcdefabcd"; // 16バイト

/**
 * データをAES-256-CBC方式で暗号化します
 * @param {*} target - 暗号化するデータ（文字列、数値、オブジェクトなど）
 * @param {Object} [options={}] - 暗号化オプション
 * @param {string} [options.encryptionKey] - 暗号化キー（32バイト）
 * @param {string} [options.bufferKey] - バッファキー（16バイト）
 * @param {string} [options.encryptMethod="aes-256-cbc"] - 暗号化方式
 * @param {string} [options.encoding="hex"] - エンコーディング方式
 * @returns {string} 暗号化されたデータ（hex形式）
 * @throws {Error} 暗号化に失敗した場合にスロー
 * @example
 * // デフォルト設定で暗号化
 * const encrypted = encrypted("Hello, World!");
 *
 * // カスタムキーで暗号化
 * const customEncrypted = encrypted("Hello, World!", {
 *   encryptionKey: "myCustomEncryptionKey1234567890123456",
 *   bufferKey: "myCustomBufferKey"
 * });
 */
export function encrypted(target, options = {}) {
  const opts = options.encryptionKey ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;

  // オプションに応じてバッファを使い分け
  const iv = options.bufferKey ? Buffer.from(opts.bufferKey) : DEFAULT_IV;
  const key = options.encryptionKey ? Buffer.from(opts.encryptionKey) : DEFAULT_KEY;

  // キーとIVの長さを検証
  if (key.length !== 32) {
    throw new Error("Invalid key length");
  }
  if (iv.length !== 16) {
    throw new Error("Invalid initialization vector");
  }

  try {
    // 一度のバッファ確保で済むように最適化
    const cipher = crypto.createCipheriv(opts.encryptMethod, key, iv);
    const targetStr = String(target);

    // 暗号化を実行
    let encrypted = cipher.update(targetStr, "utf8", opts.encoding);
    encrypted += cipher.final(opts.encoding);

    return encrypted;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
}

/**
 * AES-256-CBC方式で暗号化されたデータを復号化します
 * @param {string} encrypted - 暗号化されたデータ（hex形式）
 * @param {Object} [options={}] - 復号化オプション
 * @param {string} [options.encryptionKey] - 暗号化キー（32バイト）
 * @param {string} [options.bufferKey] - バッファキー（16バイト）
 * @param {string} [options.encryptMethod="aes-256-cbc"] - 暗号化方式
 * @param {string} [options.encoding="hex"] - エンコーディング方式
 * @returns {string} 復号化されたデータ
 * @throws {Error} 復号化に失敗した場合にスロー
 * @example
 * // デフォルト設定で復号化
 * const decrypted = decrypted(encrypted);
 *
 * // カスタムキーで復号化
 * const customDecrypted = decrypted(customEncrypted, {
 *   encryptionKey: "myCustomEncryptionKey1234567890123456",
 *   bufferKey: "myCustomBufferKey"
 * });
 */
export function decrypted(encrypted, options = {}) {
  const opts = options.encryptionKey ? { ...DEFAULT_OPTIONS, ...options } : DEFAULT_OPTIONS;

  // オプションに応じてバッファを使い分け
  const iv = options.bufferKey ? Buffer.from(opts.bufferKey) : DEFAULT_IV;
  const key = options.encryptionKey ? Buffer.from(opts.encryptionKey) : DEFAULT_KEY;

  // キーとIVの長さを検証
  if (key.length !== 32) {
    throw new Error("Invalid key length");
  }
  if (iv.length !== 16) {
    throw new Error("Invalid initialization vector");
  }

  try {
    // 一度のバッファ確保で済むように最適化
    const decipher = crypto.createDecipheriv(opts.encryptMethod, key, iv);

    // 復号化を実行
    let decrypted = decipher.update(encrypted, opts.encoding, "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
}
