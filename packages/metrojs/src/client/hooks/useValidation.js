/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Form Validation Hook                              ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A comprehensive form validation hook that provides          ║
 * ║   powerful validation capabilities for React forms            ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file useValidation.js
 * @description フォームバリデーション用のカスタムフック
 *
 * 以下の機能を提供:
 * - 数値、メールアドレス、パスワードなどの基本的なバリデーション
 * - 日付範囲、時間範囲の検証
 * - 配列の空チェック
 * - エラーメッセージの管理
 * - デバッグ機能
 *
 * @example
 * // 基本的な使用方法
 * const { checkNull, checkNumber, checkMailAddress } = useValidation(formData);
 *
 * // 必須チェック
 * const isValid = checkNull('name', '名前');
 *
 * // 数値チェック
 * const isNumberValid = checkNumber('age', '年齢');
 *
 * // メールアドレスチェック
 * const isEmailValid = checkMailAddress('email', 'メールアドレス');
 *
 * // 日付範囲チェック
 * const isDateRangeValid = checkDateTerm('startDate', 'endDate', '期間');
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import utils from "@krono-metro/metrojs/utils";
import logjs from "@krono-metro/metrojs/logjs";
const MODULE_NAME = "useValidation";
const log = new logjs(MODULE_NAME);

/**
 * フォームバリデーション用のカスタムフック
 * @param {Object} form - バリデーション対象のフォームデータ
 * @returns {Object} バリデーション関数群
 */
export const useValidation = (form = {}) => {
  let target = form;
  const setTarget = (_data) => {
    target = _data;
  };

  const [errors, setErrors] = React.useState({});

  /**
   * エラーメッセージデータを設定
   * @param {Object} data - エラーメッセージデータ
   */
  const setData = (data) => {
    setErrors({ ...data });
  };

  /**
   * エラーメッセージをクリア
   */
  const clear = async () => {
    for (let key in errors) {
      delete errors[key];
    }
    await setData({});
  };

  /**
   * エラーメッセージのデバッグ出力
   */
  const debugerrors = () => {
    if (utils.lengthForJson(errors) > 0) {
      log.debug("debugerrors-------------------------------------------");
      for (let key in errors) {
        log.debug(key + ":" + errors[key]);
      }
      log.debug("-------------------------------------------");
    } else {
      log.debug("debugerrors Not errors");
    }
  };

  /**
   * 指定されたキーのエラーメッセージを取得
   * @param {string} key - エラーメッセージのキー
   * @returns {string|null} エラーメッセージ
   */
  const getErrors = (key = "error") => {
    if (isContainKey(key) == true) {
      return errors[key];
    } else {
      return null;
    }
  };

  /**
   * 指定されたキーがエラーメッセージに含まれているかチェック
   * @param {string} key - チェックするキー
   * @returns {boolean} キーの存在有無
   */
  const isContainKey = (key) => {
    return utils.isProperty(errors, key) == true;
  };

  /**
   * エラーの存在をチェック
   * @returns {boolean} エラーの有無
   */
  const isError = () => {
    log.debug("error count : " + utils.lengthForJson(errors));
    return utils.lengthForJson(errors) <= 0 ? false : true;
  };

  /**
   * エラーメッセージを追加
   * @param {string} key - エラーメッセージのキー
   * @param {string} msg - エラーメッセージ
   */
  const adderrors = (key, msg) => {
    errors[key] = msg;
    setData(errors);
  };

  /**
   * 数値チェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkNumber = (key, name) => {
    let value = target[key];
    log.debug("key:" + key + " value:" + value);
    try {
      if (isNaN(value) == true) {
        log.debug(`checkNumber key:${key} name:${name} is not number`);
        errors[key] = `${name}に数字を入力してください。`;
        setData(errors);
        return false;
      }
      if (value === "") {
        log.debug(`checkNumber key:${key} name:${name} is empty`);
        errors[key] = `${name}が空です。数字を入力してください。`;
        setData(errors);
        return false;
      }
      delete errors[key];
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * Nullチェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkNull = (key, name) => {
    log.debug(`checkNull key:${key} name:${name} target`, target);
    try {
      if (utils.hasOwn(target, key) == false) {
        log.debug(`checkNull key:${key} name:${name} is not have`);
        errors[key] = `${name}を入力してください。`;
        setData(errors);
        return false;
      }
      let data = target[key];
      log.debug("checkNull data:" + data);
      if (utils.isNull(data) == true || data == "") {
        log.debug("checkNull Error data:" + data);
        errors[key] = `${name}を入力してください。`;
        setData(errors);
        log.debug("checkNull errors", errors);
        return false;
      }
      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 必須チェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkRequired = (key, name) => {
    log.debug(`checkRequired key:${key} name:${name}`, target);
    try {
      if (utils.isNull(target[key]) == true) {
        log.debug(`checkRequired key:${key} name:${name} is null`);
        errors[key] = name + "を選択してください。";
        setData(errors);
        return false;
      }
      if (target[key] === "") {
        log.debug(`checkRequired key:${key} name:${name} is empty`);
        errors[key] = name + "を入力してください。";
        setData(errors);
        return false;
      }
      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 文字数チェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @param {number} min - 最小文字数
   * @param {number} max - 最大文字数
   * @returns {boolean} バリデーション結果
   */
  const checkLength = (key, name, min = 0, max = 0) => {
    log.debug(`checkLength key:${key} name:${name} min:${min} max:${max}`, target);
    try {
      let value = target[key];
      if (value.length < min) {
        log.debug(`checkLength key:${key} name:${name} length:${value.length} is less than min`);
        errors[key] = `${name}は${min}文字以上で入力してください。`;
        setData(errors);
        return false;
      }
      if (max > 0 && value.length > max) {
        log.debug(`checkLength key:${key} name:${name} length:${value.length} is not equal`);
        errors[key] = `${name}は${max}文字以内で入力してください。`;
        setData(errors);
        return false;
      }
      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 固定文字数チェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @param {number} length - 固定文字数
   * @returns {boolean} バリデーション結果
   */
  const checkFixedLength = (key, name, length) => {
    log.debug(`checkFixedLength key:${key} name:${name} length:${length}`, target);
    try {
      let value = target[key];
      if (value.length !== length) {
        log.debug(`checkFixedLength key:${key} name:${name} length:${length} is not equal`);
        errors[key] = `${name}は${length}文字で入力してください。`;
        setData(errors);
        return false;
      }
      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 未指定チェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkUnSpecified = (key, name) => {
    try {
      if (utils.isNull(target[key]) == true) {
        log.debug(`checkUnSpecified key:${key} name:${name} is null`);
        errors[key] = `${name}を入力してください。`;
        setData(errors);
        return false;
      } else if (target[key] == -1) {
        log.debug(`checkUnSpecified key:${key} name:${name} is -1`);
        errors[key] = `${name}を選択してください。`;
        setData(errors);
        return false;
      }
      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 配列の空チェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkArrayKara = (key, name) => {
    log.debug(`checkArrayKara key:${key} name:${name}`, target);
    try {
      if (utils.isNull(target[key]) == true) {
        log.debug(`checkArrayKara key:${key} name:${name} is null`);
        errors[key] = name + "を選択してください。";
        setData(errors);
        return false;
      }

      let _array = target[key];
      if (_array instanceof Array == false) {
        errors[key] = `${name}の入力に誤りがあります。`;
        log.error(`${key}に指定した値は配列ではありません。`);
        setData(errors);
        return false;
      }
      if (_array.length <= 0) {
        errors[key] = `${name}を選択してください。`;
        setData(errors);
        return false;
      }
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 日付範囲チェック
   * @param {string} fromKey - 開始日のキー
   * @param {string} toKey - 終了日のキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkDateTerm = (fromKey, toKey, name) => {
    try {
      let from = target[fromKey];
      let to = target[toKey];
      if (Number(from) <= Number(to) == false) {
        if (utils.isNull(from) == true || utils.isNull(to) == true) {
          errors[fromKey] = `${name}を入力してください。`;
          setData(errors);
          return false;
        }
        errors[fromKey] = `${name}の範囲 指定に誤りがあります ${from}~${to}`;
        setData(errors);
        return false;
      }
      delete errors[fromKey];
      delete errors[toKey];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 時間範囲チェック
   * @param {string} fromKey - 開始時間のキー
   * @param {string} toKey - 終了時間のキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkTimeTerm = (fromKey, toKey, name) => {
    try {
      let from = target[fromKey];
      let to = target[toKey];
      if (Number(from) <= Number(to) == false) {
        if (utils.isNull(from) == true || utils.isNull(to) == true) {
          log.debug(`checkTimeTerm key:${fromKey} name:${name} is null`);
          errors[fromKey] = `${name}を入力してください。`;
          setData(errors);
          return false;
        }
        errors[fromKey] = `${name}の期間 指定に誤りがあります ${from}~${to}`;
        setData(errors);
        return false;
      }
      delete errors[fromKey];
      delete errors[toKey];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 時間形式チェック
   * @param {string} Key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkHourMinute = (Key, name) => {
    try {
      let value = target[Key];
      let hour = value.substring(0, 2);
      let minute = value.substring(2, 4);
      log.debug("checkHourMinute value:" + value + " hour:" + hour + " minute:" + minute);
      hour = Number(hour);
      minute = Number(minute);
      if ((0 <= hour && hour <= 23) == false) {
        if (utils.isNull(value) == true) {
          log.debug(`checkHourMinute key:${Key} name:${name} is null`);
          errors[Key] = `${name}を入力してください。`;
          setData(errors);
          return false;
        }
        errors[Key] = `${name}の時間指定に誤りがあります hour:${hour}`;
        setData(errors);
        return false;
      } else if ((0 <= minute && minute <= 59) == false) {
        if (utils.isNull(value) == true) {
          log.debug(`checkHourMinute key:${Key} name:${name} is null`);
          errors[Key] = `${name}を入力してください。`;
          setData(errors);
          return false;
        }
        errors[Key] = `${name}の分指定に誤りがあります minute:${minute}`;
        setData(errors);
        return false;
      }
      delete errors[Key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * メールアドレスチェック
   * @param {string} Key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @returns {boolean} バリデーション結果
   */
  const checkMailAddress = (Key, name) => {
    log.debug(`checkMailAddress key:${Key} name:${name}`, target);
    let value = target[Key];
    try {
      // 空やハイフンのみの場合は除外
      if (value === "" || value === "-") {
        log.debug(`checkMailAddress key:${Key} name:${name} is empty`);
        errors[Key] = `${name}を入力してください。`;
        setData(errors);
        return false;
      }
      if (utils.isMailAddress(value) == false) {
        log.debug(`checkMailAddress key:${Key} name:${name} is not mail address`);
        errors[Key] = `${name}の形式が正しくありません。`;
        setData(errors);
        return false;
      }
      delete errors[Key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * パスワードチェック
   * @param {string} Key - パスワードのキー
   * @param {string} ConfirmKey - 確認用パスワードのキー
   * @param {boolean} is_easy - 簡易チェックモード
   * @returns {boolean} バリデーション結果
   */
  const checkPassword = (Key, ConfirmKey, is_easy = false) => {
    log.debug(`checkPassword key:${Key} ConfirmKey:${ConfirmKey} is_easy:${is_easy}`, target);
    try {
      let value = target[Key];
      let confirmValue = target[ConfirmKey];
      if (value === "") {
        log.debug(`checkPassword key:${Key} name:${name} is empty`);
        errors[Key] = "パスワードを入力してください。";
        setData(errors);
        return false;
      }
      if (confirmValue === "") {
        log.debug(`checkPassword key:${ConfirmKey} name:${name} is empty`);
        errors[ConfirmKey] = "確認用パスワードを入力してください。";
        setData(errors);
        return false;
      }
      if (value !== confirmValue) {
        log.debug(`checkPassword key:${ConfirmKey} name:${name} is not match`);
        errors[ConfirmKey] = "パスワードが一致しません。";
        setData(errors);
        return false;
      }
      if (is_easy == false) {
        if (value.length < 8) {
          log.debug(`checkPassword key:${Key} name:${name} is less than 8`);
          errors[Key] = "パスワードは8文字以上で入力してください。";
          setData(errors);
          return false;
        }
        if (!/[A-Z]/.test(value)) {
          log.debug(`checkPassword key:${Key} name:${name} is not include uppercase`);
          errors[Key] = "パスワードは大文字を含める必要があります。";
          setData(errors);
          return false;
        }
        if (!/[a-z]/.test(value)) {
          log.debug(`checkPassword key:${Key} name:${name} is not include lowercase`);
          errors[Key] = "パスワードは小文字を含める必要があります。";
          setData(errors);
          return false;
        }
        if (!/[0-9]/.test(value)) {
          log.debug(`checkPassword key:${Key} name:${name} is not include number`);
          errors[Key] = "パスワードは数字を含める必要があります。";
          setData(errors);
          return false;
        }
        if (!/[!@#$%^&*]/.test(value)) {
          log.debug(`checkPassword key:${Key} name:${name} is not include special character`);
          errors[Key] = "パスワードは特殊文字（!@#$%^&*）を含める必要があります。";
          setData(errors);
          return false;
        }
      }
      delete errors[Key];
      delete errors[ConfirmKey];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 有効な日付チェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @param {string} format - 日付フォーマット（デフォルト: 'YYYY-MM-DD'）
   * @returns {boolean} バリデーション結果
   */
  const checkValidDate = (key, name, format = "YYYY-MM-DD") => {
    log.debug(`checkValidDate key:${key} name:${name} format:${format}`, target);
    try {
      let value = target[key];

      // 空値チェック
      if (utils.isNull(value) || value === "") {
        log.debug(`checkValidDate key:${key} name:${name} is empty`);
        errors[key] = `${name}を入力してください。`;
        setData(errors);
        return false;
      }

      // 日付形式チェック
      let date;
      if (format === "YYYY-MM-DD") {
        // YYYY-MM-DD形式の場合
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
          log.debug(`checkValidDate key:${key} name:${name} is not YYYY-MM-DD format`);
          errors[key] = `${name}はYYYY-MM-DD形式で入力してください。`;
          setData(errors);
          return false;
        }

        const [year, month, day] = value.split("-").map(Number);
        date = new Date(year, month - 1, day);
      } else if (format === "YYYY/MM/DD") {
        // YYYY/MM/DD形式の場合
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        if (!dateRegex.test(value)) {
          log.debug(`checkValidDate key:${key} name:${name} is not YYYY/MM/DD format`);
          errors[key] = `${name}はYYYY/MM/DD形式で入力してください。`;
          setData(errors);
          return false;
        }

        const [year, month, day] = value.split("/").map(Number);
        date = new Date(year, month - 1, day);
      } else {
        // その他の形式はDate.parse()で試行
        date = new Date(value);
      }

      // 有効な日付かチェック
      if (isNaN(date.getTime())) {
        log.debug(`checkValidDate key:${key} name:${name} is not valid date`);
        errors[key] = `${name}は有効な日付ではありません。`;
        setData(errors);
        return false;
      }

      // 入力された年月日と実際の日付が一致するかチェック（2月30日などの不正な日付を検出）
      if (format === "YYYY-MM-DD") {
        const [year, month, day] = value.split("-").map(Number);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
          log.debug(`checkValidDate key:${key} name:${name} is not valid date`);
          errors[key] = `${name}は存在しない日付です。`;
          setData(errors);
          return false;
        }
      } else if (format === "YYYY/MM/DD") {
        const [year, month, day] = value.split("/").map(Number);
        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
          log.debug(`checkValidDate key:${key} name:${name} is not valid date`);
          errors[key] = `${name}は存在しない日付です。`;
          setData(errors);
          return false;
        }
      }

      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
      errors[key] = `${name}の日付形式が正しくありません。`;
      setData(errors);
      return false;
    } finally {
      debugerrors();
    }
  };

  /**
   * 数字のみチェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @param {boolean} allowHyphen - ハイフンを許可するかどうか（デフォルト: false）
   * @returns {boolean} バリデーション結果
   */
  const checkNumericOnly = (key, name, allowHyphen = false) => {
    log.debug(`checkNumericOnly key:${key} name:${name} allowHyphen:${allowHyphen}`, target);
    try {
      let value = target[key];

      // 空値チェック
      if (utils.isNull(value) || value === "") {
        log.debug(`checkNumericOnly key:${key} name:${name} is empty`);
        errors[key] = `${name}を入力してください。`;
        setData(errors);
        return false;
      }

      // 数字のみチェック（ハイフン許可オプション付き）
      const pattern = allowHyphen ? /^[\d-]+$/ : /^\d+$/;
      if (!pattern.test(value)) {
        const message = allowHyphen ? `${name}は数字とハイフンのみで入力してください。` : `${name}は数字のみで入力してください。`;
        log.debug(`checkNumericOnly key:${key} name:${name} is not numeric`);
        errors[key] = message;
        setData(errors);
        return false;
      }

      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 英数字のみチェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @param {boolean} allowHyphen - ハイフンを許可するかどうか（デフォルト: false）
   * @returns {boolean} バリデーション結果
   */
  const checkAlphanumericOnly = (key, name, allowHyphen = false) => {
    log.debug(`checkAlphanumericOnly key:${key} name:${name} allowHyphen:${allowHyphen}`, target);
    try {
      let value = target[key];

      // 空値チェック
      if (utils.isNull(value) || value === "") {
        log.debug(`checkAlphanumericOnly key:${key} name:${name} is empty`);
        errors[key] = `${name}を入力してください。`;
        setData(errors);
        return false;
      }

      // 英数字のみチェック（ハイフン許可オプション付き）
      const pattern = allowHyphen ? /^[a-zA-Z0-9-]+$/ : /^[a-zA-Z0-9]+$/;
      if (!pattern.test(value)) {
        const message = allowHyphen ? `${name}は英数字とハイフンのみで入力してください。` : `${name}は英数字のみで入力してください。`;
        log.debug(`checkAlphanumericOnly key:${key} name:${name} is not alphanumeric`);
        errors[key] = message;
        setData(errors);
        return false;
      }

      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  /**
   * 英数字記号のみチェック
   * @param {string} key - チェックするフィールドのキー
   * @param {string} name - フィールド名
   * @param {string} allowedSymbols - 許可する記号（デフォルト: '!@#$%^&*()_+-=[]{}|;:,.<>?'）
   * @returns {boolean} バリデーション結果
   */
  const checkAlphanumericSymbolsOnly = (key, name, allowedSymbols = "!@#$%^&*()_+-=[]{}|;:,.<>?") => {
    log.debug(`checkAlphanumericSymbolsOnly key:${key} name:${name} allowedSymbols:${allowedSymbols}`, target);
    try {
      let value = target[key];

      // 空値チェック
      if (utils.isNull(value) || value === "") {
        log.debug(`checkAlphanumericSymbolsOnly key:${key} name:${name} is empty`);
        errors[key] = `${name}を入力してください。`;
        setData(errors);
        return false;
      }

      // 記号をエスケープして正規表現パターンを作成
      const escapedSymbols = allowedSymbols.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`^[a-zA-Z0-9${escapedSymbols}]+$`);

      if (!pattern.test(value)) {
        log.debug(`checkAlphanumericSymbolsOnly key:${key} name:${name} is not alphanumeric symbols`);
        errors[key] = `${name}は英数字と記号（${allowedSymbols}）のみで入力してください。`;
        setData(errors);
        return false;
      }

      delete errors[key];
      setData(errors);
      return true;
    } catch (e) {
      log.error(e);
    } finally {
      debugerrors();
    }
  };

  return [
    errors,
    {
      checkNumber,
      checkNull,
      checkRequired,
      checkLength,
      checkFixedLength,
      checkValidDate,
      checkNumericOnly,
      checkAlphanumericOnly,
      checkAlphanumericSymbolsOnly,
      checkUnSpecified,
      checkArrayKara,
      checkDateTerm,
      checkTimeTerm,
      checkHourMinute,
      checkMailAddress,
      checkPassword,
      getErrors,
      setData,
      isError,
      debugerrors,
      clear,
      adderrors,
      setTarget,
    },
  ];
};

export default useValidation;
