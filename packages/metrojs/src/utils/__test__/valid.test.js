/**
 * =========================================================================
 * MetroJS Validation Test Suite
 * =========================================================================
 *
 * Copyright (c) 2023 MetroJS Team. All rights reserved.
 * Licensed under the MIT License.
 *
 * このファイルはMetroJSの検証ユーティリティのテストケースを含みます。
 * 各関数の入力検証と期待される動作を確認します。
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import {
  isAlphaNumOnly,
  isDate,
  isMailAddress,
  isNotInput,
  isNumber,
  isNumberOnly,
  isTelNo,
  isValidDateString,
  isEmpty,
  isInteger,
  isPositive,
  isNegative,
  isInRange,
  isUrl,
  isLength,
  isMinLength,
  isMaxLength,
  isMatch,
} from "../valid.js";

describe("isAlphaNumOnly", () => {
  test("英数字のみの場合はtrueを返す", () => {
    expect(isAlphaNumOnly("abc123")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("ABC123")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("123ABC")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("123")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("abc")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("英数字以外が含まれる場合はfalseを返す", () => {
    expect(isAlphaNumOnly("abc123!")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("abc-123")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("abc_123")).toBe(false); // toBe: 厳密等価(===)での比較を行う
  });

  test("is_moneyがtrueの場合は特殊文字も許可する", () => {
    expect(isAlphaNumOnly("abc123!", true)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("abc-123", true)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("abc_123", true)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isAlphaNumOnly("¥1,000", true)).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });
});

describe("isDate", () => {
  test("有効な日付文字列の場合はtrueを返す", () => {
    expect(isDate("2024-01-01")).toBe(true);
    expect(isDate("2024/01/01")).toBe(true);
    expect(isDate(new Date())).toBe(true);
  });

  test("無効な日付文字列の場合はfalseを返す", () => {
    expect(isDate("2024-13-01")).toBe(false);
    expect(isDate("2024/01/32")).toBe(false);
    expect(isDate("2024-02-30")).toBe(false);
    expect(isDate("2023-02-29")).toBe(false);
  });

  test("日付以外の値の場合はfalseを返す", () => {
    expect(isDate("abc")).toBe(false);
    expect(isDate("2024")).toBe(false);
    expect(isDate("2024-01")).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
  });
});

describe("isMailAddress", () => {
  test("有効なメールアドレスの場合はtrueを返す", () => {
    expect(isMailAddress("test@example.com")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("test.name@example.com")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("test+name@example.com")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("test@sub.example.com")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("無効なメールアドレスの場合はfalseを返す", () => {
    expect(isMailAddress("invalid-email")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("test@")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("@example.com")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("test@example")).toBe(false); // toBe: 厳密等価(===)での比較を行う
  });

  test("特殊なケース", () => {
    expect(isMailAddress(null)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("-")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isMailAddress("")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });
});

describe("isNotInput", () => {
  test("入力されていない場合はtrueを返す", () => {
    expect(isNotInput(null)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNotInput(undefined)).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("入力されている場合はfalseを返す", () => {
    expect(isNotInput("")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNotInput(" ")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNotInput(0)).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNotInput(false)).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNotInput([])).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNotInput({})).toBe(false); // toBe: 厳密等価(===)での比較を行う
  });
});

describe("isNumber", () => {
  test("数値型の場合はtrueを返す", () => {
    expect(isNumber(123)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber(0)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber(-123)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber(123.456)).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("数値に変換可能な文字列の場合はtrueを返す", () => {
    expect(isNumber("123")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber("0")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber("-123")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber("123.456")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("数値でない場合はfalseを返す", () => {
    expect(isNumber("abc")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber("12a")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber(null)).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber(undefined)).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber({})).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumber([])).toBe(false); // toBe: 厳密等価(===)での比較を行う
  });
});

describe("isNumberOnly", () => {
  test("数字のみの場合はtrueを返す", () => {
    expect(isNumberOnly("123")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumberOnly("0")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isNumberOnly("000")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("数字以外が含まれる場合はfalseを返す", () => {
    expect(isNumberOnly("123a")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumberOnly("a123")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumberOnly("12.3")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumberOnly("-123")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isNumberOnly("")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });
});

describe("isTelNo", () => {
  test("有効な電話番号の場合はtrueを返す", () => {
    expect(isTelNo("03-1234-5678")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("0312345678")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("090-1234-5678")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("09012345678")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("+81-3-1234-5678")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("無効な電話番号の場合はfalseを返す", () => {
    expect(isTelNo("abc")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("03-123")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("03-1234-5678-9")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("03-1234-567a")).toBe(false); // toBe: 厳密等価(===)での比較を行う
  });

  test("特殊なケース", () => {
    expect(isTelNo(null)).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isTelNo("---")).toBe(false); // toBe: 厳密等価(===)での比較を行う
  });
});

describe("isValidDateString", () => {
  test("有効な日付文字列の場合はtrueを返す", () => {
    expect(isValidDateString("2023/12/31")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2023-12-31")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("20231231")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2020/02/29")).toBe(true); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2024-02-29")).toBe(true); // toBe: 厳密等価(===)での比較を行う
  });

  test("無効な日付文字列の場合はfalseを返す", () => {
    expect(isValidDateString("2023/13/31")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2023-12-32")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2023/02/29")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2023/04/31")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2023/06/31")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("2023/12")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("abc")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString("")).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString(null)).toBe(false); // toBe: 厳密等価(===)での比較を行う
    expect(isValidDateString(undefined)).toBe(false); // toBe: 厳密等価(===)での比較を行う
  });
});

describe("Validation Utilities", () => {
  describe("isEmpty", () => {
    test("nullの場合はtrueを返す", () => {
      expect(isEmpty(null)).toBe(true);
    });

    test("空文字列の場合はtrueを返す", () => {
      expect(isEmpty("")).toBe(true);
    });

    test("空白文字列の場合はtrueを返す", () => {
      expect(isEmpty("   ")).toBe(true);
    });

    test("空配列の場合はtrueを返す", () => {
      expect(isEmpty([])).toBe(true);
    });

    test("空オブジェクトの場合はtrueを返す", () => {
      expect(isEmpty({})).toBe(true);
    });

    test("値が存在する場合はfalseを返す", () => {
      expect(isEmpty("test")).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe("isInteger", () => {
    test("整数の場合はtrueを返す", () => {
      expect(isInteger(123)).toBe(true);
      expect(isInteger(-123)).toBe(true);
      expect(isInteger(0)).toBe(true);
    });

    test("整数文字列の場合はtrueを返す", () => {
      expect(isInteger("123")).toBe(true);
      expect(isInteger("-123")).toBe(true);
      expect(isInteger("0")).toBe(true);
    });

    test("小数の場合はfalseを返す", () => {
      expect(isInteger(123.45)).toBe(false);
      expect(isInteger("123.45")).toBe(false);
    });

    test("整数以外の場合はfalseを返す", () => {
      expect(isInteger("abc")).toBe(false);
      expect(isInteger(null)).toBe(false);
      expect(isInteger(undefined)).toBe(false);
    });
  });

  describe("isPositive", () => {
    test("正の数の場合はtrueを返す", () => {
      expect(isPositive(123)).toBe(true);
      expect(isPositive("123")).toBe(true);
    });

    test("0以下の場合はfalseを返す", () => {
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-123)).toBe(false);
      expect(isPositive("-123")).toBe(false);
    });

    test("数値以外の場合はfalseを返す", () => {
      expect(isPositive("abc")).toBe(false);
      expect(isPositive(null)).toBe(false);
      expect(isPositive(undefined)).toBe(false);
    });
  });

  describe("isNegative", () => {
    test("負の数の場合はtrueを返す", () => {
      expect(isNegative(-123)).toBe(true);
      expect(isNegative("-123")).toBe(true);
    });

    test("0以上の場合はfalseを返す", () => {
      expect(isNegative(0)).toBe(false);
      expect(isNegative(123)).toBe(false);
      expect(isNegative("123")).toBe(false);
    });

    test("数値以外の場合はfalseを返す", () => {
      expect(isNegative("abc")).toBe(false);
      expect(isNegative(null)).toBe(false);
      expect(isNegative(undefined)).toBe(false);
    });
  });

  describe("isInRange", () => {
    test("範囲内の場合はtrueを返す", () => {
      expect(isInRange(5, 0, 10)).toBe(true);
      expect(isInRange("5", 0, 10)).toBe(true);
    });

    test("範囲外の場合はfalseを返す", () => {
      expect(isInRange(-1, 0, 10)).toBe(false);
      expect(isInRange(11, 0, 10)).toBe(false);
      expect(isInRange("-1", 0, 10)).toBe(false);
      expect(isInRange("11", 0, 10)).toBe(false);
    });

    test("数値以外の場合はfalseを返す", () => {
      expect(isInRange("abc", 0, 10)).toBe(false);
      expect(isInRange(null, 0, 10)).toBe(false);
      expect(isInRange(undefined, 0, 10)).toBe(false);
    });
  });

  describe("isUrl", () => {
    test("有効なURLの場合はtrueを返す", () => {
      expect(isUrl("https://example.com")).toBe(true);
      expect(isUrl("http://example.com")).toBe(true);
      expect(isUrl("https://example.com/path")).toBe(true);
      expect(isUrl("https://example.com/path?query=value")).toBe(true);
    });

    test("無効なURLの場合はfalseを返す", () => {
      expect(isUrl("example.com")).toBe(false);
      expect(isUrl("ftp://example.com")).toBe(false);
      expect(isUrl("https://")).toBe(false);
    });

    test("URL以外の場合はfalseを返す", () => {
      expect(isUrl("")).toBe(false);
      expect(isUrl(null)).toBe(false);
      expect(isUrl(undefined)).toBe(false);
      expect(isUrl(123)).toBe(false);
    });
  });

  describe("isLength", () => {
    test("指定した長さの場合はtrueを返す", () => {
      expect(isLength("abc", 3)).toBe(true);
      expect(isLength("", 0)).toBe(true);
    });

    test("指定した長さ以外の場合はfalseを返す", () => {
      expect(isLength("abc", 2)).toBe(false);
      expect(isLength("abc", 4)).toBe(false);
    });

    test("文字列以外の場合はfalseを返す", () => {
      expect(isLength(null, 3)).toBe(false);
      expect(isLength(undefined, 3)).toBe(false);
      expect(isLength(123, 3)).toBe(false);
    });
  });

  describe("isMinLength", () => {
    test("最小長以上の場合はtrueを返す", () => {
      expect(isMinLength("abc", 3)).toBe(true);
      expect(isMinLength("abcd", 3)).toBe(true);
    });

    test("最小長未満の場合はfalseを返す", () => {
      expect(isMinLength("ab", 3)).toBe(false);
      expect(isMinLength("", 1)).toBe(false);
    });

    test("文字列以外の場合はfalseを返す", () => {
      expect(isMinLength(null, 3)).toBe(false);
      expect(isMinLength(undefined, 3)).toBe(false);
      expect(isMinLength(123, 3)).toBe(false);
    });
  });

  describe("isMaxLength", () => {
    test("最大長以下の場合はtrueを返す", () => {
      expect(isMaxLength("abc", 3)).toBe(true);
      expect(isMaxLength("ab", 3)).toBe(true);
    });

    test("最大長を超える場合はfalseを返す", () => {
      expect(isMaxLength("abcd", 3)).toBe(false);
    });

    test("文字列以外の場合はfalseを返す", () => {
      expect(isMaxLength(null, 3)).toBe(false);
      expect(isMaxLength(undefined, 3)).toBe(false);
      expect(isMaxLength(123, 3)).toBe(false);
    });
  });

  describe("isMatch", () => {
    test("正規表現に一致する場合はtrueを返す", () => {
      expect(isMatch("abc", /^[a-z]+$/)).toBe(true);
      expect(isMatch("123", /^\d+$/)).toBe(true);
    });

    test("正規表現に一致しない場合はfalseを返す", () => {
      expect(isMatch("abc123", /^[a-z]+$/)).toBe(false);
      expect(isMatch("abc", /^\d+$/)).toBe(false);
    });

    test("文字列以外の場合はfalseを返す", () => {
      expect(isMatch(null, /^[a-z]+$/)).toBe(false);
      expect(isMatch(undefined, /^[a-z]+$/)).toBe(false);
      expect(isMatch(123, /^[a-z]+$/)).toBe(false);
    });
  });
});
