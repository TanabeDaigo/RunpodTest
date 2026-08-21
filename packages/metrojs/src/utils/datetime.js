/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Date/Time Utilities                              ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive date and time utility library that         ║
 * ║   provides date calculations, formatting, parsing,           ║
 * ║   and manipulation capabilities                              ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file datetime.js
 * @description 日付・時刻操作ユーティリティライブラリ
 *
 * 主な機能:
 * - 日付の計算（年齢、経過日数、経過月数など）
 * - 日付のフォーマット（日本語、英語、カスタム形式）
 * - 日付の解析と検証
 * - 日付の操作（加算、減算、範囲分割など）
 * - 現在時刻の取得と操作
 *
 * @example
 * import {
 *   calculateAge,
 *   formatDate,
 *   getNow,
 *   divideRangeIntoMonths
 * } from '@krono-metro/metrojs/utils/datetime';
 *
 * // 年齢の計算
 * const age = calculateAge('1990/01/01');
 *
 * // 日付のフォーマット
 * const formattedDate = formatDate('20231231', '-');
 *
 * // 現在時刻の取得
 * const now = getNow();
 *
 * // 期間の月分割
 * const months = divideRangeIntoMonths('2023/01/15', '2023/03/15');
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @license MIT
 */

import dayjs from "../lib/dayjs";

// 正規表現を事前コンパイル
const DATE_REGEX = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/;
const DATETIME_REGEX = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2}) (\d{2}):(\d{2}):(\d{2})$/;

// キャッシュされた空文字列
const EMPTY_STRING = "";

/**
 * 日付を分析して年月日に分解します
 * @param {string} ymd - 日付文字列(YYYY/MM/DD or YYYY-MM-DD)
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {Object} 年月日オブジェクト
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * analysisDate("2023/12/31") // { year: "2023", month: "12", day: "31" }
 * analysisDate("2023-12-31", false) // { year: "2023", month: "12", day: "31" }
 */
export function analysisDate(ymd, isZeroPadding = true) {
  if (!ymd) {
    throw new Error("日付が指定されていません");
  }
  const d = dayjs(ymd);
  if (!d.isValid()) {
    throw new Error("無効な日付形式です");
  }
  return {
    year: d.format("YYYY"),
    month: isZeroPadding ? d.format("MM") : d.format("M"),
    day: isZeroPadding ? d.format("DD") : d.format("D"),
  };
}

/**
 * 年齢を計算します
 * @param {string} birthDate - 生年月日(YYYY/MM/DD or YYYY-MM-DD)
 * @param {string} [targetDate] - 対象日(YYYY/MM/DD or YYYY-MM-DD)
 * @returns {number} 年齢
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * calculateAge("1990/01/01") // 現在の年齢を返す
 * calculateAge("1990/01/01", "2023/12/31") // 33
 */
export function calculateAge(birthDate, targetDate) {
  if (!birthDate) {
    throw new Error("生年月日が指定されていません");
  }
  const birth = dayjs(birthDate);
  if (!birth.isValid()) {
    throw new Error("無効な生年月日形式です");
  }
  const target = targetDate ? dayjs(targetDate) : dayjs();
  if (targetDate && !target.isValid()) {
    throw new Error("無効な対象日形式です");
  }
  let age = target.year() - birth.year();
  const monthDiff = target.month() - birth.month();
  if (monthDiff < 0 || (monthDiff === 0 && target.date() < birth.date())) {
    age--;
  }
  return age;
}

/**
 * 日付が有効かどうかを判定します
 * @param {string} dateStr - 日付文字列
 * @returns {boolean} 有効な日付の場合はtrue
 * @example
 * isValidDate("2023/12/31") // true
 * isValidDate("2023-12-31") // true
 * isValidDate("2023/13/32") // false
 */
function isValidDate(dateStr) {
  const match = DATE_REGEX.exec(dateStr);
  if (!match) return false;

  const [, year, month, day] = match;
  const date = dayjs(`${year}-${month}-${day}`);
  if (!date.isValid()) return false;

  const inputDate = date.format("YYYY-MM-DD");
  const expectedDate = `${year}-${String(parseInt(month)).padStart(2, "0")}-${String(parseInt(day)).padStart(2, "0")}`;
  return inputDate === expectedDate;
}

/**
 * 日数を計算します
 * @param {string} startDate - 開始日(YYYY/MM/DD or YYYY-MM-DD)
 * @param {string} endDate - 終了日(YYYY/MM/DD or YYYY-MM-DD)
 * @returns {number} 日数
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * calculateDay("2023/12/01", "2023/12/31") // 30
 * calculateDay("2023-12-01", "2023-12-31") // 30
 */
export function calculateDay(startDate, endDate) {
  if (!startDate || !endDate) {
    throw new Error(!startDate ? "開始日が指定されていません" : "終了日が指定されていません");
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    throw new Error(!isValidDate(startDate) ? "無効な開始日形式です" : "無効な終了日形式です");
  }

  // 一度だけdayjsインスタンスを生成
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, "day");
}

/**
 * 経過日数を計算します
 * @param {string} startDate - 開始日(YYYY/MM/DD or YYYY-MM-DD)
 * @param {string} endDate - 終了日(YYYY/MM/DD or YYYY-MM-DD)
 * @returns {number} 経過日数
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * calculateDaysElapsed("2023/12/01", "2023/12/31") // 30
 * calculateDaysElapsed("2023-12-01", "2023-12-31") // 30
 */
export function calculateDaysElapsed(startDate, endDate) {
  return calculateDay(startDate, endDate);
}

/**
 * 経過月数を計算します
 * @param {string} startDate - 開始日(YYYY/MM/DD or YYYY-MM-DD)
 * @param {string} endDate - 終了日(YYYY/MM/DD or YYYY-MM-DD)
 * @returns {number} 経過月数
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * calculateMonthsElapsed("2023/01/01", "2023/12/31") // 11
 * calculateMonthsElapsed("2023-01-01", "2023-12-31") // 11
 */
export function calculateMonthsElapsed(startDate, endDate) {
  if (!startDate || !endDate) {
    throw new Error(!startDate ? "開始日が指定されていません" : "終了日が指定されていません");
  }

  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    throw new Error(!isValidDate(startDate) ? "無効な開始日形式です" : "無効な終了日形式です");
  }

  // 一度だけdayjsインスタンスを生成
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return end.diff(start, "month");
}

/**
 * 期間を月ごとに分割します
 * @param {string} from - 開始日(YYYY/MM/DD or YYYY-MM-DD)
 * @param {string} to - 終了日(YYYY/MM/DD or YYYY-MM-DD)
 * @returns {Array<{from: string, to: string}>} 月ごとの期間配列
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * divideRangeIntoMonths("2023/01/15", "2023/03/15")
 * // [
 * //   { from: "2023/01/15", to: "2023/02/01" },
 * //   { from: "2023/02/01", to: "2023/03/01" },
 * //   { from: "2023/03/01", to: "2023/03/15" }
 * // ]
 */
export function divideRangeIntoMonths(from, to) {
  const terms = [];
  let targetFrom = from;
  let nextFirstMonth = dayjs(targetFrom).add(1, "month").startOf("month").format("YYYY-MM-DD HH:mm");

  if (dayjs(to).isSameOrBefore(dayjs(nextFirstMonth))) {
    terms.push({ from: targetFrom, to: to });
  } else {
    while (dayjs(to).isAfter(dayjs(nextFirstMonth))) {
      terms.push({ from: targetFrom, to: nextFirstMonth });
      targetFrom = nextFirstMonth;
      nextFirstMonth = dayjs(targetFrom).add(1, "month").startOf("month").format("YYYY-MM-DD HH:mm");

      if (dayjs(to).isSameOrBefore(dayjs(nextFirstMonth))) {
        terms.push({ from: targetFrom, to: to });
        break;
      }
    }
  }
  return terms;
}

/**
 * 2つの日付の差分日数を取得します
 * @param {string} date1 - 日付1(YYYY/MM/DD or YYYY-MM-DD)
 * @param {string} date2 - 日付2(YYYY/MM/DD or YYYY-MM-DD)
 * @returns {number} 差分日数
 * @throws {Error} 日付が無効な場合にスロー
 * @example
 * diffDays("2023/12/31", "2024/01/01") // 1
 * diffDays("2023-12-31", "2024-01-01") // 1
 */
export function diffDays(date1, date2) {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return d2.diff(d1, "day");
}

/**
 * YYYYMMDD形式の日付文字列を区切り文字付きの形式に変換します
 * @param {string} dateString - YYYYMMDD形式の日付文字列
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @param {boolean} [showDayOfWeek=false] - 曜日を表示するかどうか
 * @returns {string} 区切り文字付きの日付文字列
 * @example
 * formatDate("20231231") // "2023/12/31"
 * formatDate("20231231", "-", false) // "2023-12-31"
 * formatDate("20231231", "/", true, true) // "2023/12/31 (日)"
 */
export function formatDate(dateString, separator = "/", isZeroPadding = true, showDayOfWeek = false) {
  const format = `YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`;
  const formattedDate = dayjs(dateString).format(format);
  const day = showDayOfWeek ? ` (${dayjs(dateString).format("dd")})` : EMPTY_STRING;
  return formattedDate + day;
}

/**
 * YYYYMMDD形式の日付文字列を日本語形式に変換します
 * @param {string} dateString - YYYYMMDD形式の日付文字列
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 日本語形式の日付文字列
 * @example
 * formatDateToJpn("20231231") // "2023年12月31日"
 * formatDateToJpn("20231231", false) // "2023年12月31日"
 */
export function formatDateToJpn(dateString, isZeroPadding = true) {
  const date = dayjs(dateString);
  const y = date.year();
  const m = isZeroPadding ? date.format("MM") : date.format("M");
  const d = isZeroPadding ? date.format("DD") : date.format("D");
  return `${y}年${m}月${d}日`;
}

/**
 * YYYYMMDD形式の日付文字列を日本語形式(月日のみ)に変換します
 * @param {string} dateString - YYYYMMDD形式の日付文字列
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 日本語形式の月日文字列
 * @example
 * formatDateToJpnMD("20231231") // "12月31日"
 * formatDateToJpnMD("20231231", false) // "12月31日"
 */
export function formatDateToJpnMD(dateString, isZeroPadding = true) {
  const date = dayjs(dateString);
  const m = isZeroPadding ? date.format("MM") : date.format("M");
  const d = isZeroPadding ? date.format("DD") : date.format("D");
  return `${m}月${d}日`;
}

/**
 * 時間範囲を文字列に変換します
 * @param {number} fromHour - 開始時
 * @param {number} fromMinute - 開始分
 * @param {number} toHour - 終了時
 * @param {number} toMinute - 終了分
 * @param {boolean} isZeroPadding - ゼロパディングするかどうか
 * @returns {string} 時間範囲文字列
 * @example
 * formatForFromToTime(9, 0, 17, 30) // => "09：00～17：30"
 */
export function formatForFromToTime(fromHour, fromMinute, toHour, toMinute, isZeroPadding = true) {
  const format = isZeroPadding ? "HH：mm" : "H：mm";
  const from = dayjs().hour(fromHour).minute(fromMinute).format(format);
  const to = dayjs().hour(toHour).minute(toMinute).format(format);
  return `${from}～${to}`;
}

/**
 * 時刻文字列を「時：分」形式に変換します
 * @param {string} hhmm - 時刻文字列（HHMM形式）
 * @param {boolean} isZeroPadding - ゼロパディングするかどうか
 * @returns {string} 変換後の時刻文字列
 * @example
 * formatHourTime("0930") // => "09：30"
 */
export function formatHourTime(hhmm, isZeroPadding = true) {
  if (!hhmm) {
    return hhmm;
  }
  const hh = isZeroPadding ? hhmm.substring(0, 2) : String(parseInt(hhmm.substring(0, 2)));
  const mm = hhmm.substring(2, 4);
  return `${hh}：${mm}`;
}

/**
 * 時刻文字列を日本語形式に変換します
 * @param {string} hhmm - 時刻文字列（HHMM形式）
 * @param {boolean} isZeroPadding - ゼロパディングするかどうか
 * @returns {string} 変換後の時刻文字列
 * @example
 * formatHourMinuteJpn("0930") // => "09時30分"
 */
export function formatHourMinuteJpn(hhmm, isZeroPadding = true) {
  if (!hhmm) {
    return hhmm;
  }
  const hh = isZeroPadding ? hhmm.substring(0, 2) : String(parseInt(hhmm.substring(0, 2)));
  const mm = hhmm.substring(2, 4);
  return `${hh}時${mm}分`;
}

/**
 * 指定日から指定日数後（前）の日付を計算します
 * @param {string} yyyymmdd - 基準日
 * @param {number} n - 加算（減算）する日数
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 計算後の日付
 * @example
 * getCalcDay("20231231", 1) // "2024/01/01"
 * getCalcDay("20231231", -1) // "2023/12/30"
 * getCalcDay("20231231", 1, "-", false) // "2024-1-1"
 */
export function getCalcDay(yyyymmdd, n, separator = "/", isZeroPadding = true) {
  return dayjs(yyyymmdd)
    .add(n, "day")
    .format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 指定日から指定月数後（前）の日付を計算します
 * @param {string} date - 基準日
 * @param {number} add - 加算（減算）する月数
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 計算後の日付
 * @example
 * getCalcMonth("2023-12-31", 1) // "2024/01"
 * getCalcMonth("2023-12-31", -1) // "2023/11"
 * getCalcMonth("2023-12-31", 1, "-", false) // "2024-1"
 */
export function getCalcMonth(date, add, separator = "/", isZeroPadding = true) {
  return dayjs(date)
    .add(add, "month")
    .format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}`);
}

/**
 * 指定日の日を取得します
 * @param {string} [date=""] - 日付
 * @returns {number} 日
 * @example
 * getDay("2023-12-31") // 31
 * getDay() // 現在の日
 */
export function getDay(date = EMPTY_STRING) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.date();
}

/**
 * 指定日の曜日を取得します
 * @param {string} [date=""] - 日付
 * @returns {string} 曜日(日本語3文字)
 * @example
 * getYoubi("2023-12-31") // "日"
 * getYoubi() // 現在の曜日
 */
export function getYoubi(date = EMPTY_STRING) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.format("ddd");
}

/**
 * 前月の1日を取得します
 * @param {string} yyyymmdd - 基準日
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 前月1日の日付
 * @example
 * getFirstDayOfPreviousMonth("20231231") // "2023/11/01"
 * getFirstDayOfPreviousMonth("20231231", "-", false) // "2023-11-1"
 */
export function getFirstDayOfPreviousMonth(yyyymmdd, separator = "/", isZeroPadding = true) {
  return dayjs(yyyymmdd)
    .startOf("month")
    .subtract(1, "month")
    .format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 指定月の月初日を取得します
 * @param {string} [date=""] - 日付
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 月初日の日付
 * @example
 * getFirstDayOfMonth("2023-12-15") // "2023/12/01"
 */
export function getFirstDayOfMonth(date = EMPTY_STRING, separator = "/", isZeroPadding = true) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.startOf("month").format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 翌月1日を取得します
 * @param {Date} [date=new Date()] - 日付
 * @returns {Date} 翌月1日
 * @example
 * getFirstDayOfNextMonth() // 翌月1日のDateオブジェクト
 * getFirstDayOfNextMonth(new Date("2023-12-15")) // 2024-01-01のDateオブジェクト
 */
export function getFirstDayOfNextMonth(date = new Date()) {
  return dayjs(date).add(1, "month").startOf("month").toDate();
}

/**
 * 指定日時の時を取得します
 * @param {string} datetime - 日時文字列
 * @param {boolean} isZeroPadding - ゼロパディングするかどうか
 * @returns {string} 時
 * @example
 * getHour("2023-12-31 15:30") // => "15"
 */
export function getHour(datetime = EMPTY_STRING, isZeroPadding = true) {
  const _dayjs = datetime === EMPTY_STRING ? dayjs() : dayjs(datetime);
  return isZeroPadding ? String(_dayjs.hour()).padStart(2, "0") : String(_dayjs.hour());
}

/**
 * 指定月の月末日を取得します
 * @param {string} [date=""] - 日付
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 月末日の日付
 * @example
 * getLastDayOfMonth("2023-12-15") // "2023/12/31"
 * getLastDayOfMonth("2023-12-15", "-", false) // "2023-12-31"
 * getLastDayOfMonth() // 現在月の最終日
 */
export function getLastDayOfMonth(date = EMPTY_STRING, separator = "/", isZeroPadding = true) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.endOf("month").format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 指定日時の分を取得します
 * @param {string} datetime - 日時文字列
 * @param {boolean} isZeroPadding - ゼロパディングするかどうか
 * @returns {string} 分
 * @example
 * getMinute("2023-12-31 15:30") // => "30"
 */
export function getMinute(datetime = EMPTY_STRING, isZeroPadding = true) {
  const _dayjs = datetime === EMPTY_STRING ? dayjs() : dayjs(datetime);
  return isZeroPadding ? String(_dayjs.minute()).padStart(2, "0") : String(_dayjs.minute());
}

/**
 * 指定日の月を取得します
 * @param {string} [date=""] - 日付
 * @returns {number} 月(1-12)
 * @example
 * getMonth("2023-12-31") // 12
 * getMonth() // 現在の月
 */
export function getMonth(date = EMPTY_STRING) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.month() + 1;
}

/**
 * 翌月の最終日を取得します
 * @param {string} yyyymmdd - 基準日
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 翌月最終日の日付
 * @example
 * getNextMonthLastDay("20231231") // "2024/01/31"
 * getNextMonthLastDay("20231231", "-", false) // "2024-1-31"
 */
export function getNextMonthLastDay(yyyymmdd, separator = "/", isZeroPadding = true) {
  return dayjs(yyyymmdd)
    .add(1, "month")
    .endOf("month")
    .format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 現在の日付を取得します
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 現在の日付
 * @example
 * getNow() // "2023/12/31"
 * getNow("-", false) // "2023-12-31"
 */
export function getNow(separator = "/", isZeroPadding = true) {
  return dayjs().format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 現在の日を取得します
 * @returns {number} 現在の日
 * @example
 * getNowDay() // 31 (2023年12月31日の場合)
 */
export function getNowDay() {
  return getDay();
}

/**
 * 現在の時を取得します
 * @returns {number} 現在の時
 * @example
 * getNowHour() // => 15
 */
export function getNowHour() {
  return dayjs().hour();
}

/**
 * 現在の月を取得します
 * @returns {number} 現在の月
 * @example
 * getNowMonth() // 12 (12月の場合)
 */
export function getNowMonth() {
  return getMonth();
}

/**
 * 現在の時刻を取得します
 * @param {string} [separator="/"] - 日付の区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 現在の時刻
 * @example
 * getNowTime() // "2023/12/31 15:30:45.123"
 * getNowTime("-", false) // "2023-12-31 15:30:45.123"
 */
export function getNowTime(separator = "/", isZeroPadding = true) {
  return dayjs().format(
    `YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"} ${isZeroPadding ? "HH" : "H"}:${isZeroPadding ? "mm" : "m"}:${isZeroPadding ? "ss" : "s"}.${isZeroPadding ? "SSS" : "S"}`
  );
}

/**
 * 現在の曜日を取得します
 * @returns {string} 現在の曜日
 * @example
 * getNowYoubi() // "日" (日曜日の場合)
 */
export function getNowYoubi() {
  return getYoubi();
}

/**
 * 現在の年を取得します
 * @returns {number} 現在の年
 * @example
 * getNowYear() // 2023
 */
export function getNowYear() {
  return getYear();
}

/**
 * 現在の年月を取得します
 * @param {string} [separator=""] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 現在の年月
 * @example
 * getNowYearMonth() // "202312"
 * getNowYearMonth("-") // "2023-12"
 * getNowYearMonth("-", false) // "2023-12"
 */
export function getNowYearMonth(separator = EMPTY_STRING, isZeroPadding = true) {
  return dayjs()
    .startOf("month")
    .format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}`);
}

/**
 * 指定日付から残り何日かを取得します
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} day - 日
 * @returns {number} 残り日数
 * @example
 * getRemainingDay(2023, 12, 31) // => 0
 */
export function getRemainingDay(year, month, day) {
  const targetDate = dayjs(`${year}-${month}-${day}`);
  const today = dayjs();
  return targetDate.diff(today, "day");
}

/**
 * 前月の同日を取得します
 * @param {string} [date=""] - 日付
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 前月同日の日付
 * @example
 * getSameDayLastMonth("2023-12-15") // "2023/11/15"
 * getSameDayLastMonth("2023-12-15", "-", false) // "2023-11-15"
 * getSameDayLastMonth() // 前月同日
 */
export function getSameDayLastMonth(date = EMPTY_STRING, separator = "/", isZeroPadding = true) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.add(-1, "M").format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 翌月の同日を取得します
 * @param {string} [date=""] - 日付
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 翌月同日の日付
 * @example
 * getSameDayNextMonth("2023-12-15") // "2024/01/15"
 * getSameDayNextMonth("2023-12-15", "-", false) // "2024-1-15"
 * getSameDayNextMonth() // 翌月同日
 */
export function getSameDayNextMonth(date = EMPTY_STRING, separator = "/", isZeroPadding = true) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.add(1, "M").format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 明日の日付を取得します
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 明日の日付
 * @example
 * getTomorrow() // "2024/01/01"
 * getTomorrow("-", false) // "2024-1-1"
 */
export function getTomorrow(separator = "/", isZeroPadding = true) {
  return dayjs()
    .add(1, "d")
    .format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 指定日の年を取得します
 * @param {string} [date=""] - 日付
 * @returns {number} 年
 * @example
 * getYear("2023-12-31") // 2023
 * getYear() // 現在の年
 */
export function getYear(date = EMPTY_STRING) {
  const _dayjs = date === EMPTY_STRING ? dayjs() : dayjs(date);
  return _dayjs.year();
}

/**
 * 昨日の日付を取得します
 * @param {string} [separator="/"] - 区切り文字
 * @param {boolean} [isZeroPadding=true] - ゼロパディングするかどうか
 * @returns {string} 昨日の日付
 * @example
 * getYesterday() // "2023/12/30"
 * getYesterday("-", false) // "2023-12-30"
 */
export function getYesterday(separator = "/", isZeroPadding = true) {
  return dayjs()
    .subtract(1, "d")
    .format(`YYYY${separator}${isZeroPadding ? "MM" : "M"}${separator}${isZeroPadding ? "DD" : "D"}`);
}

/**
 * 数値を指定桁数でゼロパディングします
 * @param {number|string} num - 数値
 * @param {number} len - 桁数
 * @returns {string} ゼロパディングされた文字列
 * @example
 * padding(123, 5) // "00123"
 * padding("123", 5) // "00123"
 */
export function padding(num, len) {
  return (Array(len).join("0") + num).slice(-len);
}
