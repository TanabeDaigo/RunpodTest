/**
 * =========================================================================
 * MetroJS - Number Test
 * =========================================================================
 *
 * 数値ユーティリティのテスト
 * 各数値処理関数の動作を検証します
 *
 * Copyright (c) 2019-2024 KronoMetro, Co.
 * All rights reserved.
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import {
  toString,
  toNumber,
  toInteger,
  round,
  floor,
  ceil,
  format,
  inRange,
  abs,
  sign,
  max,
  min,
  sum,
  average,
} from "../number.js";

describe("Number Utilities", () => {
  describe("toString", () => {
    test("数値を文字列に変換", () => {
      expect(toString(123)).toBe("123");
      expect(toString(-123)).toBe("-123");
      expect(toString(0)).toBe("0");
    });

    test("nullの場合は0を返す", () => {
      expect(toString(null)).toBe("0");
    });
  });

  describe("toNumber", () => {
    test("文字列を数値に変換", () => {
      expect(toNumber("123")).toBe(123);
      expect(toNumber("-123")).toBe(-123);
      expect(toNumber("0")).toBe(0);
    });

    test("無効な文字列の場合は0を返す", () => {
      expect(toNumber("abc")).toBe(0);
      expect(toNumber(null)).toBe(0);
    });
  });

  describe("toInteger", () => {
    test("数値を整数に変換", () => {
      expect(toInteger(123.45)).toBe(123);
      expect(toInteger(-123.45)).toBe(-123);
      expect(toInteger(0)).toBe(0);
    });

    test("無効な値の場合は0を返す", () => {
      expect(toInteger("abc")).toBe(0);
      expect(toInteger(null)).toBe(0);
    });
  });

  describe("round", () => {
    test("数値を指定桁数で丸める", () => {
      expect(round(123.456, 2)).toBe(123.46);
      expect(round(123.456, 1)).toBe(123.5);
      expect(round(123.456, 0)).toBe(123);
    });

    test("無効な値の場合は0を返す", () => {
      expect(round("abc")).toBe(0);
      expect(round(null)).toBe(0);
    });
  });

  describe("floor", () => {
    test("数値を指定桁数で切り捨て", () => {
      expect(floor(123.456, 2)).toBe(123.45);
      expect(floor(123.456, 1)).toBe(123.4);
      expect(floor(123.456, 0)).toBe(123);
    });

    test("無効な値の場合は0を返す", () => {
      expect(floor("abc")).toBe(0);
      expect(floor(null)).toBe(0);
    });
  });

  describe("ceil", () => {
    test("数値を指定桁数で切り上げ", () => {
      expect(ceil(123.456, 2)).toBe(123.46);
      expect(ceil(123.456, 1)).toBe(123.5);
      expect(ceil(123.456, 0)).toBe(124);
    });

    test("無効な値の場合は0を返す", () => {
      expect(ceil("abc")).toBe(0);
      expect(ceil(null)).toBe(0);
    });
  });

  describe("format", () => {
    test("数値を指定形式でフォーマット", () => {
      expect(format(1234.56, { style: "currency", currency: "JPY" })).toBe(
        "¥1,235"
      );
      expect(
        format(1234.56, { style: "decimal", minimumFractionDigits: 2 })
      ).toBe("1,234.56");
    });

    test("無効な値の場合は0を返す", () => {
      expect(format("abc")).toBe("0");
      expect(format(null)).toBe("0");
    });
  });

  describe("inRange", () => {
    test("数値が指定範囲内かどうかを判定", () => {
      expect(inRange(5, 0, 10)).toBe(true);
      expect(inRange(-1, 0, 10)).toBe(false);
      expect(inRange(11, 0, 10)).toBe(false);
    });

    test("無効な値の場合はfalseを返す", () => {
      expect(inRange("abc", 0, 10)).toBe(false);
      expect(inRange(null, 0, 10)).toBe(false);
    });
  });

  describe("abs", () => {
    test("数値の絶対値を取得", () => {
      expect(abs(123)).toBe(123);
      expect(abs(-123)).toBe(123);
      expect(abs(0)).toBe(0);
    });

    test("無効な値の場合は0を返す", () => {
      expect(abs("abc")).toBe(0);
      expect(abs(null)).toBe(0);
    });
  });

  describe("sign", () => {
    test("数値の符号を取得", () => {
      expect(sign(123)).toBe(1);
      expect(sign(-123)).toBe(-1);
      expect(sign(0)).toBe(0);
    });

    test("無効な値の場合は0を返す", () => {
      expect(sign("abc")).toBe(0);
      expect(sign(null)).toBe(0);
    });
  });

  describe("max", () => {
    test("数値の最大値を取得", () => {
      expect(max(1, 2, 3)).toBe(3);
      expect(max(-1, -2, -3)).toBe(-1);
    });

    test("無効な値は無視される", () => {
      expect(max(1, "abc", 3, null)).toBe(3);
    });
  });

  describe("min", () => {
    test("数値の最小値を取得", () => {
      expect(min(1, 2, 3)).toBe(1);
      expect(min(-1, -2, -3)).toBe(-3);
    });

    test("無効な値は無視される", () => {
      expect(min(1, "abc", 3, null)).toBe(1);
    });
  });

  describe("sum", () => {
    test("数値の合計を取得", () => {
      expect(sum(1, 2, 3)).toBe(6);
      expect(sum(-1, -2, -3)).toBe(-6);
    });

    test("無効な値は無視される", () => {
      expect(sum(1, "abc", 3, null)).toBe(4);
    });
  });

  describe("average", () => {
    test("数値の平均値を取得", () => {
      expect(average(1, 2, 3)).toBe(2);
      expect(average(-1, -2, -3)).toBe(-2);
    });

    test("無効な値は無視される", () => {
      expect(average(1, "abc", 3, null)).toBe(2);
    });
  });
});
