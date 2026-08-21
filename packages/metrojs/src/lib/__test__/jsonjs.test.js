/**
 * =========================================
 *
 * Metrojs
 *
 * Copyright © 2019-present KronoMetro, Co.
 * All rights reserved.
 *
 * =========================================
 */

import { jsonjs } from "../jsonjs";

describe("jsonjs", () => {
  let json;

  beforeEach(() => {
    json = new jsonjs({
      name: "metro",
      version: "1.0.0",
      isActive: true,
      count: 42,
      date: "2023-12-31",
      array: [1, 2, 3],
      nested: { key: "value" },
    });
  });

  describe("constructor", () => {
    test("正常系: JSONオブジェクトで初期化できる", () => {
      expect(json).toBeInstanceOf(jsonjs);
      expect(json.getTargetJson()).toEqual({
        name: "metro",
        version: "1.0.0",
        isActive: true,
        count: 42,
        date: "2023-12-31",
        array: [1, 2, 3],
        nested: { key: "value" },
      });
    });

    test("異常系: 無効な初期化値でエラー", () => {
      expect(() => new jsonjs()).toThrow(
        "JSONオブジェクトが指定されていません"
      );
      expect(() => new jsonjs(null)).toThrow(
        "JSONオブジェクトが指定されていません"
      );
      expect(() => new jsonjs("not an object")).toThrow(
        "JSONオブジェクトが指定されていません"
      );
    });
  });

  describe("基本操作", () => {
    test("getTargetJson: 操作対象のJSONオブジェクトを取得", () => {
      expect(json.getTargetJson()).toEqual(json.targetJson);
    });

    test("hasOwn: キーの存在確認", () => {
      expect(json.hasOwn("name")).toBe(true);
      expect(json.hasOwn("nonexistent")).toBe(false);
    });

    test("get: 値の取得", () => {
      expect(json.get("name")).toBe("metro");
      expect(json.get("nonexistent")).toBe(null);
      expect(json.get("nonexistent", "default")).toBe("default");
    });

    test("set: 値の設定", () => {
      json.set("name", "metrojs");
      expect(json.get("name")).toBe("metrojs");
    });

    test("length: キーの数を取得", () => {
      expect(json.length()).toBe(7);
    });

    test("keys: キーの配列を取得", () => {
      expect(json.keys()).toEqual([
        "name",
        "version",
        "isActive",
        "count",
        "date",
        "array",
        "nested",
      ]);
    });
  });

  describe("型変換", () => {
    test("getValueAsString: 文字列変換", () => {
      expect(json.getValueAsString("name")).toBe("metro");
      expect(json.getValueAsString("count")).toBe("42");
      expect(json.getValueAsString("array")).toBe("1,2,3");
      expect(json.getValueAsString("array", ";")).toBe("1;2;3");
    });

    test("getValueAsNumber: 数値変換", () => {
      expect(json.getValueAsNumber("count")).toBe(42);
      expect(() => json.getValueAsNumber("name")).toThrow(
        "数値に変換できない値です"
      );
    });

    test("getValueAsBoolean: 真偽値変換", () => {
      expect(json.getValueAsBoolean("isActive")).toBe(true);
      const jsonWithStrings = new jsonjs({
        trueStr: "true",
        falseStr: "false",
      });
      expect(jsonWithStrings.getValueAsBoolean("trueStr")).toBe(true);
      expect(jsonWithStrings.getValueAsBoolean("falseStr")).toBe(true);
    });

    test("getValueAsDate: 日付変換", () => {
      const date = json.getValueAsDate("date");
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(11);
      expect(date.getDate()).toBe(31);
    });

    test("getValueAsArray: 配列変換", () => {
      expect(json.getValueAsArray("array")).toEqual([1, 2, 3]);
      expect(json.getValueAsArray("nonexistent")).toEqual([]);
      expect(json.getValueAsArray("name")).toEqual([]);
    });

    test("getValueAsObject: オブジェクト変換", () => {
      expect(json.getValueAsObject("nested")).toEqual({ key: "value" });
      expect(json.getValueAsObject("nonexistent")).toEqual({});
      expect(json.getValueAsObject("name")).toEqual({});
    });

    test("getValueAsJson: JSON変換", () => {
      expect(json.getValueAsJson("nested")).toEqual({ key: "value" });
      expect(json.getValueAsJson("nonexistent")).toEqual({});
      expect(json.getValueAsJson("name")).toEqual({});
    });
  });

  describe("高度な操作", () => {
    test("deepClone: ディープコピー", () => {
      const clone = json.deepClone();
      expect(clone).toEqual(json.getTargetJson());
      expect(clone).not.toBe(json.getTargetJson());
      expect(clone.nested).not.toBe(json.getTargetJson().nested);
    });

    test("deepMerge: ディープマージ", () => {
      const merged = json.deepMerge({
        newKey: "newValue",
        nested: { newNestedKey: "newNestedValue" },
      });
      expect(merged).toEqual({
        ...json.getTargetJson(),
        newKey: "newValue",
        nested: { key: "value", newNestedKey: "newNestedValue" },
      });
    });

    test("equals: 等価性比較", () => {
      const sameJson = new jsonjs(json.getTargetJson());
      const differentJson = new jsonjs({
        ...json.getTargetJson(),
        name: "metrojs",
      });
      expect(json.equals(sameJson.getTargetJson())).toBe(true);
      expect(json.equals(differentJson.getTargetJson())).toBe(false);
    });

    test("isEmpty: 空判定", () => {
      const emptyJson = new jsonjs({});
      expect(emptyJson.isEmpty()).toBe(true);
      expect(json.isEmpty()).toBe(false);
    });
  });

  describe("エラー処理", () => {
    test("無効なキー指定", () => {
      expect(() => json.get()).toThrow("キーが指定されていません");
      expect(() => json.get(null)).toThrow("キーが指定されていません");
      expect(() => json.get("")).toThrow("キーが指定されていません");
    });

    test("無効な値指定", () => {
      expect(() => json.set("name")).toThrow("値が指定されていません");
      expect(() => json.set("name", undefined)).toThrow(
        "値が指定されていません"
      );
    });

    test("nullオブジェクトの操作", () => {
      const emptyJson = new jsonjs({});
      emptyJson.targetJson = null;
      expect(emptyJson.hasOwn("name")).toBe(false);
      expect(emptyJson.length()).toBe(0);
      expect(emptyJson.keys()).toEqual([]);
      expect(emptyJson.isEmpty()).toBe(true);
    });
  });
});
