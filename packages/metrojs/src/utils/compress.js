/**
 * =========================================================================
 * MetroJS - Compression Utilities
 * =========================================================================
 *
 * データ圧縮ユーティリティライブラリ
 * データの圧縮と解凍の機能を提供します
 *
 * Copyright (c) 2019-2024 KronoMetro, Co.
 * All rights reserved.
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import zlib from "zlib";

/**
 * データをGZIP形式で圧縮します
 * @param {string|Buffer} value - 圧縮するデータ（文字列またはバッファ）
 * @returns {Promise<Buffer>} 圧縮されたデータのバッファ
 * @throws {Error} 圧縮に失敗した場合にスロー
 * @example
 * // 文字列の圧縮
 * const compressed = await gzip("Hello, World!");
 * // バッファの圧縮
 * const buffer = Buffer.from("Hello, World!");
 * const compressed = await gzip(buffer);
 */
export async function gzip(value) {
  return await zlib.gzipSync(value);
}

/**
 * GZIP形式で圧縮されたデータを解凍します
 * @param {Buffer} binary - 圧縮されたデータのバッファ
 * @returns {Promise<Buffer>} 解凍されたデータのバッファ
 * @throws {Error} 解凍に失敗した場合にスロー
 * @example
 * // 圧縮データの解凍
 * const decompressed = await unzip(compressed);
 * // 解凍したデータを文字列に変換
 * const text = decompressed.toString();
 */
export async function unzip(binary) {
  return await zlib.gunzipSync(Buffer.from(binary));
}
