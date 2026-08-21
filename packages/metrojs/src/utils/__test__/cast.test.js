/**
 * Copyright (c) 2024 Metro Digital Solutions
 *
 * cast.jsのテストケース
 *
 * 主な機能:
 * - 日付/時刻の型変換
 * - 文字列と数値の相互変換
 * - 文字列とブール値の相互変換
 *
 * @author Metro Development Team
 * @version 1.0.0
 * @license MIT
 */

import {
  dateToArray,
  stringToDate,
  stringToDateForDateTime,
  stringToNumber,
  numberToString,
  stringToBoolean,
  booleanToString,
} from "../cast";

describe("dateToArray", () => {
  test("正常系: 日付文字列を配列に変換できる", () => {
    expect(dateToArray("2023-12-31")).toEqual([2023, 12, 31]); // 日付文字列が正しく配列に変換されることを確認
    expect(dateToArray("2023/12/31")).toEqual([2023, 12, 31]); // 異なる区切り文字でも正しく変換されることを確認
  });

  test("正常系: Dateオブジェクトを配列に変換できる", () => {
    const date = new Date("2023-12-31");
    expect(dateToArray(date)).toEqual([2023, 12, 31]); // Dateオブジェクトが正しく配列に変換されることを確認
  });

  test("異常系: 日付が指定されていない場合はエラー", () => {
    expect(() => dateToArray()).toThrow("日付が指定されていません"); // 引数なしで呼び出した場合にエラーが発生することを確認
    expect(() => dateToArray(null)).toThrow("日付が指定されていません"); // nullを渡した場合にエラーが発生することを確認
    expect(() => dateToArray("")).toThrow("日付が指定されていません"); // 空文字列を渡した場合にエラーが発生することを確認
  });

  test("異常系: 無効な日付形式の場合はエラー", () => {
    expect(() => dateToArray("invalid")).toThrow("無効な日付形式です"); // 無効な文字列を渡した場合にエラーが発生することを確認
    expect(() => dateToArray("2023-13-31")).toThrow("無効な日付形式です"); // 無効な月を渡した場合にエラーが発生することを確認
    expect(() => dateToArray("2023-12-32")).toThrow("無効な日付形式です"); // 無効な日を渡した場合にエラーが発生することを確認
  });
});

describe("stringToDate", () => {
  test("正常系: 日付文字列をDateオブジェクトに変換できる", () => {
    const result = stringToDate("2023-12-31", "-");
    expect(result).toBeInstanceOf(Date); // 結果がDateオブジェクトであることを確認
    expect(result.getFullYear()).toBe(2023); // 年が正しく設定されていることを確認
    expect(result.getMonth()).toBe(11); // 月が正しく設定されていることを確認（月は0から始まる）
    expect(result.getDate()).toBe(31); // 日が正しく設定されていることを確認
  });

  test("異常系: 日付文字列が指定されていない場合はエラー", () => {
    expect(() => stringToDate(null, "-")).toThrow(
      "日付文字列が指定されていません"
    ); // nullを渡した場合にエラーが発生することを確認
    expect(() => stringToDate("", "-")).toThrow(
      "日付文字列が指定されていません"
    ); // 空文字列を渡した場合にエラーが発生することを確認
  });

  test("異常系: 区切り文字が指定されていない場合はエラー", () => {
    expect(() => stringToDate("2023-12-31")).toThrow(
      "区切り文字が指定されていません"
    ); // 区切り文字なしで呼び出した場合にエラーが発生することを確認
    expect(() => stringToDate("2023-12-31", null)).toThrow(
      "区切り文字が指定されていません"
    ); // nullを区切り文字として渡した場合にエラーが発生することを確認
    expect(() => stringToDate("2023-12-31", "")).toThrow(
      "区切り文字が指定されていません"
    ); // 空文字列を区切り文字として渡した場合にエラーが発生することを確認
  });

  test("異常系: 無効な日付形式の場合はエラー", () => {
    expect(() => stringToDate("2023-12", "-")).toThrow("無効な日付形式です"); // 不完全な日付形式を渡した場合にエラーが発生することを確認
    expect(() => stringToDate("2023-12-31-01", "-")).toThrow(
      "無効な日付形式です"
    ); // 余分な要素がある日付形式を渡した場合にエラーが発生することを確認
  });

  test("異常系: 無効な日付の場合はエラー", () => {
    expect(() => stringToDate("2023-13-31", "-")).toThrow("無効な日付です"); // 無効な月を渡した場合にエラーが発生することを確認
    expect(() => stringToDate("2023-12-32", "-")).toThrow("無効な日付です"); // 無効な日を渡した場合にエラーが発生することを確認
  });
});

describe("stringToDateForDateTime", () => {
  test("正常系: 日時文字列をDateオブジェクトに変換できる", () => {
    const result = stringToDateForDateTime("2023-12-31 12:34:56");
    expect(result).toBeInstanceOf(Date); // 結果がDateオブジェクトであることを確認
    expect(result.getFullYear()).toBe(2023); // 年が正しく設定されていることを確認
    expect(result.getMonth()).toBe(11); // 月が正しく設定されていることを確認
    expect(result.getDate()).toBe(31); // 日が正しく設定されていることを確認
    expect(result.getHours()).toBe(12); // 時が正しく設定されていることを確認
    expect(result.getMinutes()).toBe(34); // 分が正しく設定されていることを確認
    expect(result.getSeconds()).toBe(56); // 秒が正しく設定されていることを確認
  });

  test("異常系: 日時文字列が指定されていない場合はエラー", () => {
    expect(() => stringToDateForDateTime(null)).toThrow(
      "日時文字列が指定されていません"
    ); // nullを渡した場合にエラーが発生することを確認
    expect(() => stringToDateForDateTime("")).toThrow(
      "日時文字列が指定されていません"
    ); // 空文字列を渡した場合にエラーが発生することを確認
  });

  test("異常系: 無効な日時形式の場合はエラー", () => {
    expect(() => stringToDateForDateTime("invalid")).toThrow(
      "無効な日時形式です"
    ); // 無効な文字列を渡した場合にエラーが発生することを確認
    expect(() => stringToDateForDateTime("2023-13-31 12:34:56")).toThrow(
      "無効な日時形式です"
    ); // 無効な月を渡した場合にエラーが発生することを確認
    expect(() => stringToDateForDateTime("2023-12-32 12:34:56")).toThrow(
      "無効な日時形式です"
    ); // 無効な日を渡した場合にエラーが発生することを確認
  });
});

describe("stringToNumber", () => {
  test("正常系: 文字列を数値に変換できる", () => {
    expect(stringToNumber("123")).toBe(123); // 整数文字列が正しく数値に変換されることを確認
    expect(stringToNumber("-123")).toBe(-123); // 負の整数文字列が正しく数値に変換されることを確認
    expect(stringToNumber("0")).toBe(0); // ゼロ文字列が正しく数値に変換されることを確認
    expect(stringToNumber("123.45")).toBe(123.45); // 小数文字列が正しく数値に変換されることを確認
  });

  test("異常系: 文字列が指定されていない場合はエラー", () => {
    expect(() => stringToNumber()).toThrow("文字列が指定されていません"); // 引数なしで呼び出した場合にエラーが発生することを確認
    expect(() => stringToNumber(null)).toThrow("文字列が指定されていません"); // nullを渡した場合にエラーが発生することを確認
  });

  test("異常系: 数値に変換できない文字列の場合はエラー", () => {
    expect(() => stringToNumber("abc")).toThrow("数値に変換できない文字列です"); // 数値に変換できない文字列を渡した場合にエラーが発生することを確認
    expect(() => stringToNumber("12a")).toThrow("数値に変換できない文字列です"); // 数値に変換できない文字列を渡した場合にエラーが発生することを確認
  });
});

describe("numberToString", () => {
  test("正常系: 数値を文字列に変換できる", () => {
    expect(numberToString(123)).toBe("123"); // 整数が正しく文字列に変換されることを確認
    expect(numberToString(-123)).toBe("-123"); // 負の整数が正しく文字列に変換されることを確認
    expect(numberToString(0)).toBe("0"); // ゼロが正しく文字列に変換されることを確認
    expect(numberToString(123.45)).toBe("123.45"); // 小数が正しく文字列に変換されることを確認
  });

  test("異常系: 数値が指定されていない場合はエラー", () => {
    expect(() => numberToString()).toThrow("数値が指定されていません"); // 引数なしで呼び出した場合にエラーが発生することを確認
    expect(() => numberToString(null)).toThrow("数値が指定されていません"); // nullを渡した場合にエラーが発生することを確認
  });

  test("異常系: 数値以外の型が指定されている場合はエラー", () => {
    expect(() => numberToString("123")).toThrow(
      "数値以外の型が指定されています"
    ); // 文字列を渡した場合にエラーが発生することを確認
    expect(() => numberToString(true)).toThrow(
      "数値以外の型が指定されています"
    ); // ブール値を渡した場合にエラーが発生することを確認
  });
});

describe("stringToBoolean", () => {
  test("正常系: 文字列をブール値に変換できる", () => {
    expect(stringToBoolean("true")).toBe(true); // "true"文字列がtrueに変換されることを確認
    expect(stringToBoolean("1")).toBe(true); // "1"文字列がtrueに変換されることを確認
    expect(stringToBoolean("false")).toBe(false); // "false"文字列がfalseに変換されることを確認
    expect(stringToBoolean("0")).toBe(false); // "0"文字列がfalseに変換されることを確認
  });

  test("異常系: 文字列が指定されていない場合はエラー", () => {
    expect(() => stringToBoolean()).toThrow("文字列が指定されていません"); // 引数なしで呼び出した場合にエラーが発生することを確認
    expect(() => stringToBoolean(null)).toThrow("文字列が指定されていません"); // nullを渡した場合にエラーが発生することを確認
  });

  test("異常系: 文字列以外の型が指定されている場合はエラー", () => {
    expect(() => stringToBoolean(123)).toThrow(
      "文字列以外の型が指定されています"
    ); // 数値を渡した場合にエラーが発生することを確認
    expect(() => stringToBoolean(true)).toThrow(
      "文字列以外の型が指定されています"
    ); // ブール値を渡した場合にエラーが発生することを確認
  });
});

describe("booleanToString", () => {
  test("正常系: ブール値を文字列に変換できる", () => {
    expect(booleanToString(true)).toBe("true"); // trueが"true"文字列に変換されることを確認
    expect(booleanToString(false)).toBe("false"); // falseが"false"文字列に変換されることを確認
  });

  test("異常系: ブール値が指定されていない場合はエラー", () => {
    expect(() => booleanToString()).toThrow("ブール値が指定されていません"); // 引数なしで呼び出した場合にエラーが発生することを確認
    expect(() => booleanToString(null)).toThrow("ブール値が指定されていません"); // nullを渡した場合にエラーが発生することを確認
  });

  test("異常系: ブール値以外の型が指定されている場合はエラー", () => {
    expect(() => booleanToString(123)).toThrow(
      "ブール値以外の型が指定されています"
    ); // 数値を渡した場合にエラーが発生することを確認
    expect(() => booleanToString("true")).toThrow(
      "ブール値以外の型が指定されています"
    ); // 文字列を渡した場合にエラーが発生することを確認
  });
});
