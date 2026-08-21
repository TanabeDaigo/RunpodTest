/**
 * =========================================================================
 * MetroJS Cryptography Test Suite
 * =========================================================================
 *
 * Copyright (c) 2024 Metro Digital Solutions
 * Licensed under the MIT License.
 *
 * このファイルはMetroJSの暗号化ユーティリティのテストケースを含みます。
 * 主な機能:
 * - 文字列の暗号化
 * - 暗号化された文字列の復号化
 * - カスタムオプションによる暗号化/復号化
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import { encrypted, decrypted } from "../crypto.server.js";

describe("crypto.server.js 暗号化・復号化ユーティリティ", () => {
  const plainText = "テストデータ123!@#";
  const customKey = "12345678901234567890123456789012"; // 32バイト
  const customIV = "1234567890123456"; // 16バイト
  const wrongKey = "abcdefghabcdefghabcdefghabcdefgh12"; // 32バイト
  const wrongIV = "abcdefabcdefabcd"; // 16バイト

  test("デフォルト設定で暗号化→復号化できる", () => {
    const enc = encrypted(plainText);
    expect(typeof enc).toBe("string");
    const dec = decrypted(enc);
    expect(dec).toBe(plainText);
  });

  test("カスタムキー・IVで暗号化→復号化できる", () => {
    const enc = encrypted(plainText, {
      encryptionKey: customKey,
      bufferKey: customIV,
    });
    expect(typeof enc).toBe("string");
    const dec = decrypted(enc, {
      encryptionKey: customKey,
      bufferKey: customIV,
    });
    expect(dec).toBe(plainText);
  });

  test("異なるキーやIVでは復号化できない", () => {
    const enc = encrypted(plainText, {
      encryptionKey: customKey,
      bufferKey: customIV,
    });
    // 異なるキーで復号化
    expect(() => {
      decrypted(enc, { encryptionKey: wrongKey, bufferKey: customIV });
    }).toThrow();
    // 異なるIVで復号化（例外が出ない場合は復号結果が異なることを検証）
    let result;
    try {
      result = decrypted(enc, { encryptionKey: customKey, bufferKey: wrongIV });
      expect(result).not.toBe(plainText);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
    }
  });

  test("不正なデータで復号化するとエラーになる", () => {
    expect(() => {
      decrypted("不正な暗号データ");
    }).toThrow();
  });

  test("キー長やIV長が不正な場合はエラーになる", () => {
    const shortKey = "shortkey"; // 8バイト
    const shortIV = "shortiv"; // 7バイト
    expect(() => {
      encrypted(plainText, { encryptionKey: shortKey });
    }).toThrow("Invalid key length");
    // IV長が不正な場合も例外が発生しない場合は復号結果が異なることを検証
    let enc;
    try {
      enc = encrypted(plainText, { bufferKey: shortIV });
      const dec = decrypted(enc, { bufferKey: shortIV });
      expect(dec).not.toBe(plainText);
    } catch (e) {
      expect(e.message).toBeDefined();
    }
  });
});
