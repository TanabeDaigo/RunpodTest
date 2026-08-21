/**
 * =========================================================================
 * MetroJS - Compression Utilities Tests
 * =========================================================================
 *
 * データ圧縮ユーティリティのテストケース
 *
 * Copyright (c) 2019-2024 KronoMetro, Co.
 * All rights reserved.
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import { gzip, unzip } from "../compress.js";

describe("compress.js", () => {
  describe("gzip", () => {
    // 正常系テスト
    test("文字列を圧縮できること", async () => {
      const input = "これは圧縮テスト用の文字列です。";
      const compressed = await gzip(input);

      // 圧縮結果がBuffer型であることを確認
      expect(compressed).toBeInstanceOf(Buffer);
      // 圧縮結果が正しく生成されていることを確認
      expect(compressed.length).toBeGreaterThan(0);
    });

    test("Bufferを圧縮できること", async () => {
      const input = Buffer.from("これは圧縮テスト用のBufferです。");
      const compressed = await gzip(input);

      // 圧縮結果がBuffer型であることを確認
      expect(compressed).toBeInstanceOf(Buffer);
      // 圧縮結果が正しく生成されていることを確認
      expect(compressed.length).toBeGreaterThan(0);
    });

    test("長い文字列を圧縮できること", async () => {
      // 長い文字列を生成
      const input = "これは圧縮テスト用の文字列です。".repeat(100);
      const compressed = await gzip(input);

      // 圧縮結果がBuffer型であることを確認
      expect(compressed).toBeInstanceOf(Buffer);
      // 圧縮されていることを確認（元の文字列より短い）
      expect(compressed.length).toBeLessThan(Buffer.from(input).length);
    });

    // 異常系テスト
    test("空の文字列を圧縮できること", async () => {
      const input = "";
      const compressed = await gzip(input);

      // 圧縮結果がBuffer型であることを確認
      expect(compressed).toBeInstanceOf(Buffer);
    });
  });

  describe("unzip", () => {
    // 正常系テスト
    test("圧縮されたデータを解凍できること", async () => {
      const original = "これは解凍テスト用の文字列です。";
      const compressed = await gzip(original);
      const decompressed = await unzip(compressed);

      // 解凍結果がBuffer型であることを確認
      expect(decompressed).toBeInstanceOf(Buffer);
      // 解凍されたデータが元のデータと一致することを確認
      expect(decompressed.toString()).toBe(original);
    });

    test("長い文字列の圧縮と解凍が正しく動作すること", async () => {
      // 長い文字列を生成
      const original = "これは解凍テスト用の文字列です。".repeat(100);
      const compressed = await gzip(original);
      const decompressed = await unzip(compressed);

      // 解凍結果がBuffer型であることを確認
      expect(decompressed).toBeInstanceOf(Buffer);
      // 解凍されたデータが元のデータと一致することを確認
      expect(decompressed.toString()).toBe(original);
    });

    // 異常系テスト
    test("空の圧縮データを解凍できること", async () => {
      const original = "";
      const compressed = await gzip(original);
      const decompressed = await unzip(compressed);

      // 解凍結果がBuffer型であることを確認
      expect(decompressed).toBeInstanceOf(Buffer);
      // 解凍されたデータが元のデータと一致することを確認
      expect(decompressed.toString()).toBe(original);
    });

    test("無効な圧縮データを解凍しようとするとエラーになること", async () => {
      const invalidData = Buffer.from("これは無効な圧縮データです。");

      // 無効なデータを解凍しようとするとエラーが発生することを確認
      await expect(unzip(invalidData)).rejects.toThrow();
    });
  });
});
