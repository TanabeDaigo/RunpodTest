/**
 * @jest-environment node
 *
 * =========================================================================
 * Metro JS - Date/Time Utility Test Suite
 * =========================================================================
 *
 * A comprehensive test suite for date/time manipulation utilities
 * Handles various date formats, calculations and formatting options
 *
 * Copyright (c) 2023-2024 Metro Digital
 * All rights reserved.
 *
 * Author: Metro Digital Development Team
 * Created: 2023
 * Updated: 2024
 * =========================================================================
 */

import {
  analysisDate,
  calculateAge,
  calculateDay,
  calculateDaysElapsed,
  calculateMonthsElapsed,
  divideRangeIntoMonths,
  diffDays,
  formatDate,
  formatDateToJpn,
  formatDateToJpnMD,
  formatForFromToTime,
  formatHourTime,
  formatHourMinuteJpn,
  getCalcDay,
  getCalcMonth,
  getDay,
  getYoubi,
  getFirstDayOfPreviousMonth,
  getFirstDayOfMonth,
  getFirstDayOfNextMonth,
  getHour,
  getLastDayOfMonth,
  getMinute,
  getMonth,
  getNextMonthLastDay,
  getNow,
  getNowDay,
  getNowHour,
  getNowMonth,
  getNowTime,
  getNowYoubi,
  getNowYear,
  getNowYearMonth,
  getRemainingDay,
  getSameDayLastMonth,
  getSameDayNextMonth,
  getTomorrow,
  getYear,
  getYesterday,
  padding,
} from "../datetime";

describe("datetime", () => {
  describe("analysisDate", () => {
    it("日付文字列を年月日に分解する", () => {
      expect(analysisDate("2023/12/31")).toEqual({
        year: "2023",
        month: "12",
        day: "31",
      }); // スラッシュ区切りの日付文字列が正しく分解されることを確認
      expect(analysisDate("2023-12-31", false)).toEqual({
        year: "2023",
        month: "12",
        day: "31",
      }); // ハイフン区切りの日付文字列が正しく分解されることを確認
    });
  });

  describe("calculateAge", () => {
    it("年齢を計算する", () => {
      const today = new Date();
      const birthDate = new Date(
        today.getFullYear() - 20,
        today.getMonth(),
        today.getDate()
      );
      expect(calculateAge(birthDate.toISOString().split("T")[0])).toBe(20); // 20年前の生年月日から年齢が正しく計算されることを確認
    });
  });

  describe("calculateDay", () => {
    test("2つの日付の差分日数を計算する", () => {
      expect(calculateDay("2023-01-01", "2023-01-31")).toBe(30); // 同じ月内での日数差分が正しく計算されることを確認
      expect(calculateDay("2023-01-01", "2023-02-01")).toBe(31); // 月をまたいだ日数差分が正しく計算されることを確認
      expect(calculateDay("2023-12-31", "2024-01-01")).toBe(1); // 年をまたいだ日数差分が正しく計算されることを確認
    });

    test("日付が存在しない場合はエラーを返す", () => {
      expect(() => calculateDay("2023-02-30", "2023-03-01")).toThrow(
        "無効な開始日形式です"
      ); // 2月30日という存在しない日付でエラーが発生することを確認
      expect(() => calculateDay("2023-01-01", "2023-04-31")).toThrow(
        "無効な終了日形式です"
      ); // 4月31日という存在しない日付でエラーが発生することを確認
      expect(() => calculateDay("2023-13-01", "2023-12-31")).toThrow(
        "無効な開始日形式です"
      ); // 13月という存在しない月でエラーが発生することを確認
    });

    test("パラメータが不足している場合はエラーを返す", () => {
      expect(() => calculateDay()).toThrow("開始日が指定されていません"); // 引数なしで呼び出した場合にエラーが発生することを確認
      expect(() => calculateDay("2023-01-01")).toThrow(
        "終了日が指定されていません"
      ); // 終了日なしで呼び出した場合にエラーが発生することを確認
    });
  });

  describe("calculateDaysElapsed", () => {
    test("2つの日付の経過日数を計算する", () => {
      expect(calculateDaysElapsed("2023-01-01", "2023-01-31")).toBe(30); // 同じ月内での経過日数が正しく計算されることを確認
      expect(calculateDaysElapsed("2023-01-01", "2023-02-01")).toBe(31); // 月をまたいだ経過日数が正しく計算されることを確認
      expect(calculateDaysElapsed("2023-12-31", "2024-01-01")).toBe(1); // 年をまたいだ経過日数が正しく計算されることを確認
    });

    test("日付が存在しない場合はエラーを返す", () => {
      expect(() => calculateDaysElapsed("2023-02-30", "2023-03-01")).toThrow(
        "無効な開始日形式です"
      ); // 2月30日という存在しない日付でエラーが発生することを確認
      expect(() => calculateDaysElapsed("2023-01-01", "2023-04-31")).toThrow(
        "無効な終了日形式です"
      ); // 4月31日という存在しない日付でエラーが発生することを確認
      expect(() => calculateDaysElapsed("2023-13-01", "2023-12-31")).toThrow(
        "無効な開始日形式です"
      ); // 13月という存在しない月でエラーが発生することを確認
    });

    test("パラメータが不足している場合はエラーを返す", () => {
      expect(() => calculateDaysElapsed()).toThrow(
        "開始日が指定されていません"
      ); // 引数なしで呼び出した場合にエラーが発生することを確認
      expect(() => calculateDaysElapsed("2023-01-01")).toThrow(
        "終了日が指定されていません"
      ); // 終了日なしで呼び出した場合にエラーが発生することを確認
    });
  });

  describe("calculateMonthsElapsed", () => {
    test("2つの日付の経過月数を計算する", () => {
      expect(calculateMonthsElapsed("2023-01-01", "2023-12-31")).toBe(11); // 同じ年での経過月数が正しく計算されることを確認
      expect(calculateMonthsElapsed("2023-01-01", "2024-01-01")).toBe(12); // 年をまたいだ経過月数が正しく計算されることを確認
      expect(calculateMonthsElapsed("2023-12-31", "2024-01-01")).toBe(0); // 同じ月内での経過月数が0と計算されることを確認
    });

    test("日付が存在しない場合はエラーを返す", () => {
      expect(() => calculateMonthsElapsed("2023-02-30", "2023-03-01")).toThrow(
        "無効な開始日形式です"
      ); // 2月30日という存在しない日付でエラーが発生することを確認
      expect(() => calculateMonthsElapsed("2023-01-01", "2023-04-31")).toThrow(
        "無効な終了日形式です"
      ); // 4月31日という存在しない日付でエラーが発生することを確認
      expect(() => calculateMonthsElapsed("2023-13-01", "2023-12-31")).toThrow(
        "無効な開始日形式です"
      ); // 13月という存在しない月でエラーが発生することを確認
    });

    test("パラメータが不足している場合はエラーを返す", () => {
      expect(() => calculateMonthsElapsed()).toThrow(
        "開始日が指定されていません"
      ); // 引数なしで呼び出した場合にエラーが発生することを確認
      expect(() => calculateMonthsElapsed("2023-01-01")).toThrow(
        "終了日が指定されていません"
      ); // 終了日なしで呼び出した場合にエラーが発生することを確認
    });
  });

  describe("divideRangeIntoMonths", () => {
    it("期間を1ヶ月毎に分割する", () => {
      const result = divideRangeIntoMonths("2023-01-15", "2023-03-15");
      expect(result).toHaveLength(3); // 3ヶ月分の期間が正しく分割されることを確認
      expect(result[0].from).toBe("2023-01-15"); // 最初の期間の開始日が正しいことを確認
      expect(result[0].to).toBe("2023-02-01 00:00"); // 最初の期間の終了日が正しいことを確認
      expect(result[1].from).toBe("2023-02-01 00:00"); // 2番目の期間の開始日が正しいことを確認
      expect(result[1].to).toBe("2023-03-01 00:00"); // 2番目の期間の終了日が正しいことを確認
      expect(result[2].from).toBe("2023-03-01 00:00"); // 3番目の期間の開始日が正しいことを確認
      expect(result[2].to).toBe("2023-03-15"); // 3番目の期間の終了日が正しいことを確認
    });
  });

  describe("diffDays", () => {
    it("2つの日付の差分日数を取得する", () => {
      expect(diffDays("2023-12-31", "2024-01-01")).toBe(1); // 年をまたいだ日数差分が正しく計算されることを確認
    });
  });

  describe("formatDate", () => {
    it("YYYYMMDD形式の日付文字列を区切り文字付きの形式に変換する", () => {
      expect(formatDate("20231231")).toBe("2023/12/31"); // スラッシュ区切りの形式に正しく変換されることを確認
      expect(formatDate("20231231", "-", false)).toBe("2023-12-31"); // ハイフン区切りの形式に正しく変換されることを確認
      expect(formatDate("20231231", "/", true, true)).toMatch(
        /2023\/12\/31 \(.\)/
      ); // 曜日付きの形式に正しく変換されることを確認
    });
  });

  describe("formatDateToJpn", () => {
    it("YYYYMMDD形式の日付文字列を日本語形式に変換する", () => {
      expect(formatDateToJpn("20231231")).toBe("2023年12月31日"); // 日本語形式に正しく変換されることを確認
      expect(formatDateToJpn("20231231", false)).toBe("2023年12月31日"); // パディングなしでも正しく変換されることを確認
    });
  });

  describe("formatDateToJpnMD", () => {
    it("YYYYMMDD形式の日付文字列を日本語形式(月日のみ)に変換する", () => {
      expect(formatDateToJpnMD("20231231")).toBe("12月31日"); // 月日のみの日本語形式に正しく変換されることを確認
      expect(formatDateToJpnMD("20231231", false)).toBe("12月31日"); // パディングなしでも正しく変換されることを確認
    });
  });

  describe("formatForFromToTime", () => {
    it("時間範囲を文字列に変換する", () => {
      expect(formatForFromToTime(9, 0, 17, 30)).toBe("09：00～17：30"); // 時間範囲が正しく文字列に変換されることを確認
      expect(formatForFromToTime(9, 0, 17, 30, false)).toBe("9：00～17：30"); // パディングなしでも正しく変換されることを確認
    });
  });

  describe("formatHourTime", () => {
    it("時刻文字列を「時：分」形式に変換する", () => {
      expect(formatHourTime("0930")).toBe("09：30"); // 時刻が正しく「時：分」形式に変換されることを確認
      expect(formatHourTime("0930", false)).toBe("9：30"); // パディングなしでも正しく変換されることを確認
    });
  });

  describe("formatHourMinuteJpn", () => {
    it("時刻文字列を日本語形式に変換する", () => {
      expect(formatHourMinuteJpn("0930")).toBe("09時30分"); // 時刻が正しく日本語形式に変換されることを確認
      expect(formatHourMinuteJpn("0930", false)).toBe("9時30分"); // パディングなしでも正しく変換されることを確認
    });
  });

  describe("getCalcDay", () => {
    it("指定日から指定日数後（前）の日付を計算する", () => {
      expect(getCalcDay("20231231", 1)).toBe("2024/01/01"); // 1日後の日付が正しく計算されることを確認
      expect(getCalcDay("20231231", -1)).toBe("2023/12/30"); // 1日前の日付が正しく計算されることを確認
      expect(getCalcDay("20231231", 1, "-", false)).toBe("2024-1-1"); // 異なる区切り文字とパディングなしでも正しく計算されることを確認
    });
  });

  describe("getCalcMonth", () => {
    it("指定日から指定月数後（前）の日付を計算する", () => {
      expect(getCalcMonth("2023-12-31", 1)).toBe("2024/01"); // 1ヶ月後の年月が正しく計算されることを確認
      expect(getCalcMonth("2023-12-31", -1)).toBe("2023/11"); // 1ヶ月前の年月が正しく計算されることを確認
      expect(getCalcMonth("2023-12-31", 1, "-", false)).toBe("2024-1"); // 異なる区切り文字とパディングなしでも正しく計算されることを確認
    });
  });

  describe("getDay", () => {
    it("指定日の日を取得する", () => {
      expect(getDay("2023-12-31")).toBe(31); // 日付から日が正しく取得されることを確認
    });
  });

  describe("getYoubi", () => {
    it("指定日の曜日を取得する", () => {
      expect(getYoubi("2023-12-31")).toBe("日"); // 日付から曜日が正しく取得されることを確認
    });
  });

  describe("getFirstDayOfPreviousMonth", () => {
    it("前月の1日を取得する", () => {
      expect(getFirstDayOfPreviousMonth("20231231")).toBe("2023/11/01");
      expect(getFirstDayOfPreviousMonth("20231231", "-", false)).toBe(
        "2023-11-1"
      );
    });
  });

  describe("getFirstDayOfMonth", () => {
    it("指定月の月初日を取得する", () => {
      expect(getFirstDayOfMonth("2023-12-15")).toBe("2023/12/01");
      expect(getFirstDayOfMonth("2023-12-15", "-", false)).toBe("2023-12-1");
    });
  });

  describe("getFirstDayOfNextMonth", () => {
    it("翌月1日を取得する", () => {
      const result = getFirstDayOfNextMonth(new Date("2023-12-15"));
      expect(result.getMonth()).toBe(0); // 1月
      expect(result.getDate()).toBe(1);
    });
  });

  describe("getHour", () => {
    it("指定日時の時を取得する", () => {
      expect(getHour("2023-12-31 15:30")).toBe("15");
      expect(getHour("2023-12-31 15:30", true)).toBe("15");
    });
  });

  describe("getLastDayOfMonth", () => {
    it("指定月の月末日を取得する", () => {
      expect(getLastDayOfMonth("2023-12-15")).toBe("2023/12/31");
      expect(getLastDayOfMonth("2023-12-15", "-", false)).toBe("2023-12-31");
    });
  });

  describe("getMinute", () => {
    it("指定日時の分を取得する", () => {
      expect(getMinute("2023-12-31 15:30")).toBe("30");
      expect(getMinute("2023-12-31 15:30", true)).toBe("30");
    });
  });

  describe("getMonth", () => {
    it("指定日の月を取得する", () => {
      expect(getMonth("2023-12-31")).toBe(12);
    });
  });

  describe("getNextMonthLastDay", () => {
    it("翌月の最終日を取得する", () => {
      expect(getNextMonthLastDay("20231231")).toBe("2024/01/31");
      expect(getNextMonthLastDay("20231231", "-", false)).toBe("2024-1-31");
    });
  });

  describe("getNow", () => {
    it("現在の日付を取得する", () => {
      const result = getNow();
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
    });
  });

  describe("getNowDay", () => {
    it("現在の日を取得する", () => {
      const result = getNowDay();
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(32);
    });
  });

  describe("getNowHour", () => {
    it("現在の時を取得する", () => {
      const result = getNowHour();
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(24);
    });
  });

  describe("getNowMonth", () => {
    it("現在の月を取得する", () => {
      const result = getNowMonth();
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(13);
    });
  });

  describe("getNowTime", () => {
    it("現在の時刻を取得する", () => {
      const result = getNowTime();
      expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/);
    });
  });

  describe("getNowYoubi", () => {
    it("現在の曜日を取得する", () => {
      const result = getNowYoubi();
      expect(["日", "月", "火", "水", "木", "金", "土"]).toContain(result);
    });
  });

  describe("getNowYear", () => {
    it("現在の年を取得する", () => {
      const result = getNowYear();
      expect(result).toBe(new Date().getFullYear());
    });
  });

  describe("getNowYearMonth", () => {
    it("現在の年月を取得する", () => {
      const result = getNowYearMonth();
      expect(result).toMatch(/^\d{4}\d{2}$/);
    });
  });

  describe("getRemainingDay", () => {
    it("指定日付から残り何日かを取得する", () => {
      const today = new Date();
      expect(
        getRemainingDay(
          today.getFullYear(),
          today.getMonth() + 1,
          today.getDate()
        )
      ).toBe(0);
    });
  });

  describe("getSameDayLastMonth", () => {
    it("前月の同日を取得する", () => {
      expect(getSameDayLastMonth("2023-12-15")).toBe("2023/11/15");
      expect(getSameDayLastMonth("2023-12-15", "-", false)).toBe("2023-11-15");
    });
  });

  describe("getSameDayNextMonth", () => {
    it("翌月の同日を取得する", () => {
      expect(getSameDayNextMonth("2023-12-15")).toBe("2024/01/15");
      expect(getSameDayNextMonth("2023-12-15", "-", false)).toBe("2024-1-15");
    });
  });

  describe("getTomorrow", () => {
    it("明日の日付を取得する", () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const expected = tomorrow.toISOString().split("T")[0].replace(/-/g, "/");
      expect(getTomorrow()).toBe(expected);
    });
  });

  describe("getYear", () => {
    it("指定日の年を取得する", () => {
      expect(getYear("2023-12-31")).toBe(2023);
    });
  });

  describe("getYesterday", () => {
    it("昨日の日付を取得する", () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const expected = yesterday.toISOString().split("T")[0].replace(/-/g, "/");
      expect(getYesterday()).toBe(expected);
    });
  });

  describe("padding", () => {
    it("数値を指定桁数でゼロパディングする", () => {
      expect(padding(123, 5)).toBe("00123");
      expect(padding("123", 5)).toBe("00123");
    });
  });
});
