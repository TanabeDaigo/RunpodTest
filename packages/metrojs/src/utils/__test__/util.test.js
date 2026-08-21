/**
 * =========================================================================
 * MetroJS Util Test Suite
 * =========================================================================
 *
 * Copyright (c) 2023 MetroJS Team. All rights reserved.
 * Licensed under the MIT License.
 *
 * このファイルはMetroJSの汎用ユーティリティのテストケースを含みます。
 * 各関数の入力検証と期待される動作を確認します。
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 * =========================================================================
 */

import {
  getType,
  isNull,
  isUndefined,
  isNumber,
  isString,
  isArray,
  isObject,
  isFunction,
  isBoolean,
  isDate,
  deepClone,
  merge,
  keys,
  values,
  entries,
  omit,
  pick,
  isNotNull,
  lengthForJson,
  isEmpty,
  isNotEmpty,
  isNullOrEmpty,
} from "../util.js";

describe("型チェック関数", () => {
  describe("getType", () => {
    test("値の型を返す", () => {
      expect(getType(null)).toBe("null");
      expect(getType(undefined)).toBe("undefined");
      expect(getType(123)).toBe("number");
      expect(getType("abc")).toBe("string");
      expect(getType([])).toBe("array");
      expect(getType({})).toBe("object");
      expect(getType(() => {})).toBe("function");
      expect(getType(true)).toBe("boolean");
      expect(getType(new Date())).toBe("date");
    });
  });

  describe("isNull", () => {
    test("nullの場合はtrueを返す", () => {
      expect(isNull(null)).toBe(true);
    });

    test("null以外の場合はfalseを返す", () => {
      expect(isNull(undefined)).toBe(true);
      expect(isNull("")).toBe(false);
      expect(isNull(0)).toBe(false);
      expect(isNull(false)).toBe(false);
    });
  });

  describe("isUndefined", () => {
    test("undefinedの場合はtrueを返す", () => {
      expect(isUndefined(undefined)).toBe(true);
    });

    test("undefined以外の場合はfalseを返す", () => {
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined("")).toBe(false);
      expect(isUndefined(0)).toBe(false);
      expect(isUndefined(false)).toBe(false);
    });
  });

  describe("isNumber", () => {
    test("数値の場合はtrueを返す", () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(123.456)).toBe(true);
    });

    test("数値以外の場合はfalseを返す", () => {
      expect(isNumber("123")).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
      expect(isNumber({})).toBe(false);
      expect(isNumber([])).toBe(false);
    });
  });

  describe("isString", () => {
    test("文字列の場合はtrueを返す", () => {
      expect(isString("abc")).toBe(true);
      expect(isString("")).toBe(true);
      expect(isString("123")).toBe(true);
    });

    test("文字列以外の場合はfalseを返す", () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe("isArray", () => {
    test("配列の場合はtrueを返す", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    test("配列以外の場合はfalseを返す", () => {
      expect(isArray({})).toBe(false);
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray("")).toBe(false);
      expect(isArray(123)).toBe(false);
    });
  });

  describe("isObject", () => {
    test("オブジェクトの場合はtrueを返す", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    test("オブジェクト以外の場合はfalseを返す", () => {
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject("")).toBe(false);
      expect(isObject(123)).toBe(false);
    });
  });

  describe("isFunction", () => {
    test("関数の場合はtrueを返す", () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
    });

    test("関数以外の場合はfalseを返す", () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction(null)).toBe(false);
      expect(isFunction(undefined)).toBe(false);
      expect(isFunction("")).toBe(false);
      expect(isFunction(123)).toBe(false);
    });
  });

  describe("isBoolean", () => {
    test("真偽値の場合はtrueを返す", () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
    });

    test("真偽値以外の場合はfalseを返す", () => {
      expect(isBoolean({})).toBe(false);
      expect(isBoolean(null)).toBe(false);
      expect(isBoolean(undefined)).toBe(false);
      expect(isBoolean("")).toBe(false);
      expect(isBoolean(123)).toBe(false);
    });
  });

  describe("isDate", () => {
    test("日付の場合はtrueを返す", () => {
      expect(isDate(new Date())).toBe(true);
    });

    test("日付以外の場合はfalseを返す", () => {
      expect(isDate({})).toBe(false);
      expect(isDate(null)).toBe(false);
      expect(isDate(undefined)).toBe(false);
      expect(isDate("")).toBe(false);
      expect(isDate(123)).toBe(false);
    });
  });
});

describe("オブジェクト操作関数", () => {
  describe("deepClone", () => {
    test("オブジェクトの深いコピーを作成する", () => {
      const obj = { a: 1, b: { c: 2 } };
      const clone = deepClone(obj);
      expect(clone).toEqual(obj);
      expect(clone).not.toBe(obj);
      expect(clone.b).not.toBe(obj.b);
    });

    test("配列の深いコピーを作成する", () => {
      const arr = [1, { a: 2 }];
      const clone = deepClone(arr);
      expect(clone).toEqual(arr);
      expect(clone).not.toBe(arr);
      expect(clone[1]).not.toBe(arr[1]);
    });

    test("プリミティブ値はそのまま返す", () => {
      expect(deepClone(123)).toBe(123);
      expect(deepClone("abc")).toBe("abc");
      expect(deepClone(true)).toBe(true);
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });
  });

  describe("merge", () => {
    test("オブジェクトをマージする", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      expect(merge(obj1, obj2)).toEqual({ a: 1, b: 3, c: 4 });
    });

    test("オブジェクト以外の場合は元のオブジェクトを返す", () => {
      const obj = { a: 1 };
      expect(merge(obj, null)).toBe(obj);
      expect(merge(obj, undefined)).toBe(obj);
      expect(merge(obj, 123)).toBe(obj);
      expect(merge(obj, "abc")).toBe(obj);
    });
  });

  describe("keys", () => {
    test("オブジェクトのキーを取得する", () => {
      expect(keys({ a: 1, b: 2 })).toEqual(["a", "b"]);
    });

    test("オブジェクト以外の場合は空配列を返す", () => {
      expect(keys(null)).toEqual([]);
      expect(keys(undefined)).toEqual([]);
      expect(keys(123)).toEqual([]);
      expect(keys("abc")).toEqual([]);
    });
  });

  describe("values", () => {
    test("オブジェクトの値を取得する", () => {
      expect(values({ a: 1, b: 2 })).toEqual([1, 2]);
    });

    test("オブジェクト以外の場合は空配列を返す", () => {
      expect(values(null)).toEqual([]);
      expect(values(undefined)).toEqual([]);
      expect(values(123)).toEqual([]);
      expect(values("abc")).toEqual([]);
    });
  });

  describe("entries", () => {
    test("オブジェクトのエントリを取得する", () => {
      expect(entries({ a: 1, b: 2 })).toEqual([
        ["a", 1],
        ["b", 2],
      ]);
    });

    test("オブジェクト以外の場合は空配列を返す", () => {
      expect(entries(null)).toEqual([]);
      expect(entries(undefined)).toEqual([]);
      expect(entries(123)).toEqual([]);
      expect(entries("abc")).toEqual([]);
    });
  });

  describe("omit", () => {
    test("指定したキーを除外したオブジェクトを返す", () => {
      expect(omit({ a: 1, b: 2, c: 3 }, ["b"])).toEqual({ a: 1, c: 3 });
    });

    test("オブジェクト以外の場合は元のオブジェクトを返す", () => {
      const obj = { a: 1 };
      expect(omit(obj, null)).toBe(obj);
      expect(omit(obj, undefined)).toBe(obj);
      expect(omit(obj, 123)).toBe(obj);
      expect(omit(obj, "abc")).toBe(obj);
    });
  });

  describe("pick", () => {
    test("指定したキーのみを含むオブジェクトを返す", () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });

    test("オブジェクト以外の場合は空オブジェクトを返す", () => {
      expect(pick(null, ["a"])).toEqual({});
      expect(pick(undefined, ["a"])).toEqual({});
      expect(pick(123, ["a"])).toEqual({});
      expect(pick("abc", ["a"])).toEqual({});
    });
  });
});

describe("その他の関数", () => {
  describe("isNotNull", () => {
    test("nullでない場合はtrueを返す", () => {
      expect(isNotNull("")).toBe(true);
      expect(isNotNull(0)).toBe(true);
      expect(isNotNull(false)).toBe(true);
    });

    test("nullの場合はfalseを返す", () => {
      expect(isNotNull(null)).toBe(false);
    });
  });

  describe("lengthForJson", () => {
    test("オブジェクトのプロパティ数を返す", () => {
      expect(lengthForJson({ a: 1, b: 2 })).toBe(2);
    });

    test("nullの場合は0を返す", () => {
      expect(lengthForJson(null)).toBe(0);
    });
  });

  describe("isEmpty", () => {
    test("空の場合はtrueを返す", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty(" ")).toBe(true);
    });

    test("空でない場合はfalseを返す", () => {
      expect(isEmpty("text")).toBe(false);
      expect(isEmpty("0")).toBe(false);
    });
  });

  describe("isNotEmpty", () => {
    test("空でない場合はtrueを返す", () => {
      expect(isNotEmpty("text")).toBe(true);
      expect(isNotEmpty("0")).toBe(true);
    });

    test("空の場合はfalseを返す", () => {
      expect(isNotEmpty("")).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
      expect(isNotEmpty(" ")).toBe(false);
    });
  });

  describe("isNullOrEmpty", () => {
    test("null、undefined、または空の値の場合はtrueを返す", () => {
      expect(isNullOrEmpty(null)).toBe(true);
      expect(isNullOrEmpty(undefined)).toBe(true);
      expect(isNullOrEmpty("")).toBe(true);
      expect(isNullOrEmpty([])).toBe(true);
      expect(isNullOrEmpty({})).toBe(true);
    });

    test("値が存在し、かつ空でない場合はfalseを返す", () => {
      expect(isNullOrEmpty("text")).toBe(false);
      expect(isNullOrEmpty([1, 2, 3])).toBe(false);
      expect(isNullOrEmpty({ a: 1 })).toBe(false);
      expect(isNullOrEmpty(0)).toBe(false);
      expect(isNullOrEmpty(false)).toBe(false);
    });
  });

  describe("isEmpty", () => {
    test("空の値の場合はtrueを返す", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    test("値が存在する場合はfalseを返す", () => {
      expect(isEmpty("text")).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  });

  describe("isNotNull", () => {
    test("null、undefined、または空の値の場合はfalseを返す", () => {
      expect(isNotNull(null)).toBe(false);
      expect(isNotNull(undefined)).toBe(false);
      expect(isNotNull("")).toBe(false);
      expect(isNotNull([])).toBe(false);
      expect(isNotNull({})).toBe(false);
    });

    test("値が存在し、かつ空でない場合はtrueを返す", () => {
      expect(isNotNull("text")).toBe(true);
      expect(isNotNull([1, 2, 3])).toBe(true);
      expect(isNotNull({ a: 1 })).toBe(true);
      expect(isNotNull(0)).toBe(true);
      expect(isNotNull(false)).toBe(true);
    });
  });
});
