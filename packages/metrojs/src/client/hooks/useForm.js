"use client";
/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Form Hook                                  ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful form management hook built with     ║
 * ║   React, providing seamless form handling experience          ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file useForm.js
 * @description フォーム管理用カスタムフック
 *
 * フォームの状態管理と以下のコンポーネントの生成を提供:
 * - 入力フィールド (input)
 * - チェックボックス (checkbox)
 * - 日付選択 (datePicker)
 * - リンク (link)
 * - ラジオボタン (radio)
 * - セレクトボックス (select)
 * - マルチセレクトボックス (selectMulti)
 * - ボタン (button)
 * - オートコンプリート (autoComplete)
 *
 * 特徴:
 * - フォーム状態の自動初期化
 * - 入力値の変更検知と状態更新
 * - コンポーネントの生成と設定の簡略化
 * - 後処理関数(after_func)のサポート
 * - バリデーション機能
 * - フォームのリセット機能
 * - 送信処理のカスタマイズ
 *
 * @example
 * // 基本的な使用方法
 * const [form, { input, button }] = useForm({
 *   username: '',
 *   password: ''
 * });
 *
 * // フォームのレンダリング
 * return (
 *   <form onSubmit={handleSubmit}>
 *     {input('username', { label: 'ユーザー名' })}
 *     {input('password', { type: 'password', label: 'パスワード' })}
 *     {button('submit', { type: 'submit', label: '送信' })}
 *   </form>
 * );
 *
 * // バリデーション付きの使用例
 * const validateRules = {
 *   username: { required: true, minLength: 3 },
 *   password: { required: true, minLength: 6 }
 * };
 *
 * const handleSubmit = async (e) => {
 *   e.preventDefault();
 *   const isValid = await validateForm(validateRules);
 *   if (isValid) {
 *     // フォーム送信処理
 *   }
 * };
 *
 * @author MetroJS Team
 * @version 1.0.0
 */
import { useState, useCallback, useEffect } from "react";
import components from "../components";
import logjs from "@krono-metro/metrojs/logjs";
import utils from "@krono-metro/metrojs/utils";
import React from "react";

const log = new logjs("useForm");

const useForm = (initState = {}, is_debug = false) => {
  if (is_debug) {
    log.debug("Form initialized with state:", initState);
  }
  const [form, setForm] = useState(initState);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * フォームの状態を取得する関数
   * @param {string} id - 取得するフィールドのID
   * @returns {*} フィールドの値
   */
  const get = (id) => {
    return form[id];
  };

  /**
   * フォームの状態を更新する関数
   * @param {string} id - 更新するフィールドのID
   * @param {*} value - 新しい値
   */
  const set = async (id, value) => {
    log.debug(`set id:${id} value:${value}`);
    await setForm({ ...form, [id]: value });
  };

  /**
   * デバッグログを出力する関数
   * @param {boolean} is_debug - デバッグモードフラグ
   * @param {string} message - ログメッセージ
   * @param {Object} arr - 追加のデータ
   */
  const _log = (is_debug = false, message, arr = {}) => {
    if (is_debug) {
      log.debug(message, arr);
    }
  };

  /**
   * 入力値変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - 入力フィールドのパラメータ
   * @param {*} newValue - 新しい入力値
   */
  const onChangeOfInput = useCallback(
    (e, params, is_debug) => {
      try {
        const newValue = e.target.value;
        const id = params.id;
        _log(is_debug, `onChangeOfInput id:${id} value: ${newValue}`);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }
        //form[id] = newValue;
        //setForm({ ...form });
        set(id, newValue);
        _log(is_debug, `onChangeOfInput id:${id} value: ${newValue}`, form);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfInput:", error);
      }
    },
    [form]
  );
  /**
   * 入力フィールドコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - 入力フィールドの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} 入力フィールドコンポーネント
   */
  const input = useCallback(
    (id, params = {}, is_debug = false) => {
      if (!utils.hasOwn(params, "value")) {
        params.value = utils.hasOwn(form, id) ? form[id] : "";
      }

      _log(is_debug, `input id:${id} is_debug:${is_debug} params.value:${params?.value} form.login_id:${form?.[id]}`, is_debug);

      params.id = id;

      if (utils.hasOwn(params, "onChange") == false) {
        params.onChange = (e, params) => onChangeOfInput(e, params, is_debug);
      }

      if (utils.hasOwn(params, "onBlur") == false) {
        //params.onBlur = (e) => setForm(form);
      }

      //return <components.Input {...params} is_debug />;

      return React.createElement(components.Input, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfInput]
  );
  /**
   * チェックボックス変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - チェックボックスのパラメータ
   * @param {boolean} newValue - 新しいチェック状態
   */
  const onChangeOfCheckbox = useCallback(
    (e, params, is_debug) => {
      try {
        const newValue = e.target.checked;
        const id = params.id;
        _log(is_debug, `onChangeOfCheckbox id:${id} value: ${newValue}`);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }
        set(id, newValue);
        _log(is_debug, `onChangeOfCheckbox id:${id} value: ${newValue}`, form);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfCheckbox:", error);
      }
    },
    [form]
  );
  /**
   * チェックボックスコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - チェックボックスの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} チェックボックスコンポーネント
   */
  const checkbox = useCallback(
    (id, params = {}, is_debug = false) => {
      if (!utils.hasOwn(params, "checked")) {
        params.checked = utils.hasOwn(form, id) ? form[id] : false;
      }
      params.id = id;

      if (utils.hasOwn(params, "onChange") == false) {
        params.onChange = (e, params) => onChangeOfCheckbox(e, params, is_debug);
      }

      return React.createElement(components.Checkbox, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfCheckbox]
  );

  /**
   * 日付選択変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - 日付選択フィールドのパラメータ
   * @param {Date} newValue - 新しい日付
   */
  const onChangeOfDatePicker = useCallback(
    (newValue, params, is_debug) => {
      try {
        const id = params.id;
        _log(is_debug, `onChangeOfDatePicker id:${id} value: ${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }

        set(id, newValue);
        _log(is_debug, `onChangeOfDatePicker id:${id} value: ${newValue}`, form);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfDatePicker:", error);
      }
    },
    [form]
  );
  /**
   * 日付選択コンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - 日付選択フィールドの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} 日付選択コンポーネント
   */
  const datePicker = useCallback(
    (id, params = {}, is_debug = false) => {
      if (!utils.hasOwn(params, "value")) {
        params.value = utils.hasOwn(form, id) ? form[id] : null;
      }
      params.id = id;

      if (utils.hasOwn(params, "onChange") == false) {
        params.onChange = (newValue, params) => onChangeOfDatePicker(newValue, params, is_debug);
      }

      return React.createElement(components.DatePicker, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfDatePicker]
  );

  /**
   * 日付選択変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - 日付選択フィールドのパラメータ
   * @param {Date} newValue - 新しい日付
   */
  const onChangeOfDatePickerFromTo = useCallback(
    (newValue, params) => {
      try {
        const id = params.id;
        _log(`onChangeOfDatePickerFromTo id:${id} value: ${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }

        set(id, newValue);
        _log(`onChangeOfDatePickerFromTo id:${id} value: ${newValue}`, form);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfDatePickerFromTo:", error);
      }
    },
    [form]
  );
  /**
   * 日付選択コンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - 日付選択フィールドの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} 日付選択コンポーネント
   */
  const datePickerFromTo = useCallback(
    (id, fromParams = {}, toPrams = {}, otherParams = {}, is_debug = false) => {
      if (!utils.hasOwn(fromParams, "value")) {
        fromParams.value = utils.hasOwn(form, id) ? form[id] : null;
      }
      fromParams.id = "_from_" + id;

      if (utils.hasOwn(fromParams, "onChange") == false) {
        fromParams.onChange = (newValue, fromParams) => onChangeOfDatePickerFromTo(newValue, fromParams);
      }

      if (!utils.hasOwn(toPrams, "value")) {
        toPrams.value = utils.hasOwn(form, id) ? form[id] : null;
      }
      toPrams.id = "_to_" + id;

      if (utils.hasOwn(toPrams, "onChange") == false) {
        toPrams.onChange = (newValue, toPrams) => onChangeOfDatePickerFromTo(newValue, toPrams);
      }

      return React.createElement(components.DatePickerFromTo, {
        paramsFrom: fromParams,
        paramsTo: toPrams,
        paramsOther: otherParams,
        is_debug,
      });
    },
    [form, onChangeOfDatePicker]
  );

  /**
   * ラジオボタン変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - ラジオボタンのパラメータ
   * @param {string} newValue - 新しい選択値
   */
  const onChangeOfRadio = useCallback(
    (e, params, is_debug) => {
      try {
        const id = params.id;
        const newValue = e.target.value;
        _log(is_debug, `onChangeOfRadio id:${id}  value:${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }

        set(id, newValue);
        _log(is_debug, `onChangeOfRadio id:${id}  value:${newValue}`, form);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfRadio:", error);
      }
    },
    [form]
  );

  /**
   * ラジオボタンコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - ラジオボタンの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} ラジオボタンコンポーネント
   */
  const radio = useCallback(
    (id, params = {}, is_debug = false) => {
      if (!utils.hasOwn(form, id)) {
        setForm((prevForm) => ({
          ...prevForm,
          [id]: params.defaultValue || "",
        }));
      }

      params.id = id;
      // params.value = form[id] || "";
      if (!utils.hasOwn(params, "value")) {
        params.value = form[id] || "";
      }

      if (utils.hasOwn(params, "onChange") == false) {
        params.onChange = (e, params) => onChangeOfRadio(e, params, is_debug);
      }

      return React.createElement(components.Radio, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfRadio]
  );

  /**
   * リンクコンポーネントを生成する関数
   * @param {Object} params - リンクの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} リンクコンポーネント
   */
  const link = useCallback(
    (params = {}, is_debug = false) => {
      if (utils.hasOwn(params, "onClick") == false) {
        params.onClick = (e) => {
          if (utils.hasOwn(params, "after_func") && params.after_func != null) {
            params.after_func(form);
          }
        };
      }
      return React.createElement(components.Link, {
        ...params,
        is_debug,
      });
    },
    [form]
  );

  /**
   * セレクトボックス変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - セレクトボックスのパラメータ
   * @param {string} newValue - 新しい選択値
   */
  const onChangeOfSelect = useCallback(
    async (e, params, is_debug) => {
      try {
        const id = params.id;
        const newValue = e.target.value;
        _log(is_debug, `onChangeOfSelect 1 id:${id} value: ${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }
        await set(id, newValue);
        _log(is_debug, `onChangeOfSelect 2 id:${id} value: ${newValue}`, form);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfSelect:", error);
      }
    },
    [form]
  );

  /**
   * セレクトボックスコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - セレクトボックスの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} セレクトボックスコンポーネント
   */
  const select = useCallback(
    (id, params = {}, is_debug = false) => {
      //log.debug(`1 select id:${id} params:${JSON.stringify(params)}`, form);
      if (!utils.hasOwn(form, id)) {
        setForm((prevForm) => ({
          ...prevForm,
          [id]: params.defaultValue || "",
        }));
      }

      params.id = id;
      // params.value = form[id] || "";
      if (!utils.hasOwn(params, "value")) {
        params.value = form[id] || "";
      }

      //log.debug(`2 select id:${id} params.value:${params.value}`, form);
      if (utils.hasOwn(params, "onChange") == false) {
        params.onChange = (e, params) => onChangeOfSelect(e, params, is_debug);
      }

      return React.createElement(components.Select, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfSelect]
  );

  /**
   * マルチセレクトボックス変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - マルチセレクトボックスのパラメータ
   * @param {string[]} newValue - 新しい選択値の配列
   */
  const onChangeOfSelectMulti = useCallback(
    (e, params, is_debug) => {
      try {
        const id = params.id;
        const newValue = e.target.value;
        console.log("onChangeOfSelectMulti newValue");
        console.dir(newValue);
        _log(is_debug, `onChangeOfSelectMulti id:${id} values: ${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }
        form[id] = newValue;
        setForm(form);

        _log(is_debug, `onChangeOfSelectMulti id:${id} values: ${newValue}`, form);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          _log(is_debug, `onChangeOfSelectMulti after_func called`);
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfSelectMulti:", error);
      }
    },
    [form]
  );

  /**
   * マルチセレクトボックスコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - マルチセレクトボックスの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} マルチセレクトボックスコンポーネント
   */
  const selectMulti = useCallback(
    (id, params = {}, is_debug = false) => {
      params.id = id;
      params.value = form[id] || [];
      _log(is_debug, `selectMulti params.value:${params.value}`, params);
      if (utils.hasOwn(params, "onChange") == false) {
        params.onChange = (e, params) => onChangeOfSelectMulti(e, params, is_debug);
      }

      return React.createElement(components.SelectMulti, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfSelectMulti]
  );

  /**
   * オートコンプリート変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - オートコンプリートのパラメータ
   * @param {*} newValue - 新しい値
   */
  const onChangeOfAutoComplete = useCallback(
    (e, params, newValue, is_debug) => {
      try {
        _log(is_debug, `onChangeOfAutoComplete value: ${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }

        const id = params.id;
        set(id, newValue);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          _log(is_debug, `onChangeOfSelectMulti after_func called`);
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfAutoComplete:", error);
      }
    },
    [form]
  );

  /**
   * オートコンプリートコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - オートコンプリートの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} オートコンプリートコンポーネント
   */
  const autoComplete = useCallback(
    (id, params = {}, is_debug = false) => {
      _log(is_debug, `autoComplete id:${id} `, params);
      if (!utils.hasOwn(form, id)) {
        setForm((prevForm) => ({
          ...prevForm,
          [id]: params.defaultValue || null,
        }));
      }

      params.id = id;
      params.value = form[id] || null;

      if (!params.onChange) {
        params.onChange = (e, newValue) => onChangeOfAutoComplete(e, { ...params, id }, newValue, is_debug);
      }

      return React.createElement(components.AutoComplete, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfAutoComplete]
  );

  /**
   * アイコンボタンコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - アイコンボタンの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} アイコンボタンコンポーネント
   */
  const iconButton = useCallback(
    (params = {}, is_debug = false) => {
      return React.createElement(components.IconButton, {
        ...params,
        is_debug,
        key: params.id || Math.random().toString(36).substr(2, 9),
      });
    },
    [form]
  );

  /**
   * アイコンメニュー変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - アイコンメニューのパラメータ
   * @param {*} newValue - 新しい値
   */
  const onChangeOfIconMenu = useCallback(
    (e, params, newValue, is_debug) => {
      try {
        _log(is_debug, `onChangeOfIconMenu value: ${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }

        const id = params.id;
        set(id, newValue);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          _log(is_debug, `onChangeOfSelectMulti after_func called`);
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfIconMenu:", error);
      }
    },
    [form]
  );

  /**
   * アイコンメニューコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - アイコンメニューの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} アイコンメニューコンポーネント
   */
  const iconMenu = useCallback(
    (id, params = {}, is_debug = false) => {
      _log(is_debug, `iconMenu id:${id} `, params);
      if (!utils.hasOwn(form, id)) {
        setForm((prevForm) => ({
          ...prevForm,
          [id]: params.defaultValue || null,
        }));
      }

      params.id = id;
      params.value = form[id] || null;

      if (!params.onChange) {
        params.onChange = (e, newValue) => onChangeOfIconMenu(e, { ...params, id }, newValue, is_debug);
      }

      return React.createElement(components.IconMenu, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfIconMenu]
  );

  /**
   * スイッチ変更時のハンドラー関数
   * @param {Event} e - イベントオブジェクト
   * @param {Object} params - スイッチのパラメータ
   * @param {*} newValue - 新しい値
   */
  const onChangeOfSwitch = useCallback(
    (e, params, newValue, is_debug) => {
      try {
        _log(is_debug, `onChangeOfSwitch value: ${newValue}`, params);

        if (!form) {
          log.error("Form state is undefined");
          return;
        }

        const id = params.id;
        set(id, newValue);

        if (utils.hasOwn(params, "after_func") && params.after_func != null) {
          _log(is_debug, `onChangeOfSelectMulti after_func called`);
          params.after_func({ ...form, [id]: newValue });
        }
      } catch (error) {
        log.error("Error in onChangeOfSwitch:", error);
      }
    },
    [form]
  );

  /**
   * スイッチコンポーネントを生成する関数
   * @param {string} id - フィールドのID
   * @param {Object} params - スイッチの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} スイッチコンポーネント
   */
  const toggleSwitch = useCallback(
    (id, params = {}, is_debug = false) => {
      _log(`switch id:${id} `, params);
      if (!utils.hasOwn(form, id)) {
        setForm((prevForm) => ({
          ...prevForm,
          [id]: params.defaultValue || null,
        }));
      }

      params.id = id;
      params.value = form[id] || null;

      if (!params.onChange) {
        params.onChange = (e, newValue) => onChangeOfSwitch(e, { ...params, id }, newValue, is_debug);
      }

      return React.createElement(components.Switch, {
        ...params,
        is_debug,
      });
    },
    [form, onChangeOfSwitch]
  );

  /**
   * ボタンコンポーネントを生成する関数
   * @param {Object} params - ボタンの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} ボタンコンポーネント
   */
  const button = useCallback(
    (params = {}, is_debug = false) => {
      _log(is_debug, `button is_debug:${is_debug}`, params, is_debug);

      return React.createElement(components.Button, {
        ...params,
        is_debug,
      });
    },
    [form]
  );

  /**
   * ツールチップコンポーネントを生成する関数
   * @param {Object} params - ツールチップの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} ツールチップコンポーネント
   */
  const tooltip = useCallback(
    (id, params = {}, is_debug = false) => {
      params.id = id;
      params.value = form[id] || [];
      _log(is_debug, `tooltip is_debug:${is_debug}`, params, is_debug);

      return React.createElement(components.Tooltip, {
        ...params,
        is_debug,
      });
    },
    [form]
  );

  /**
   * ポッパーコンポーネントを生成する関数
   * @param {Object} params - ポッパーの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} ポッパーコンポーネント
   */
  const popper = useCallback(
    (id, params = {}, is_debug = false) => {
      return React.createElement(components.Popper, {
        id,
        value: params.value ?? form[id], 
        ...params,
        is_debug,
      });
    },
    [form]
  );

  /**
   * アップロードコンポーネントを生成する関数
   * @param {Object} params - アップロードの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} アップロードコンポーネント
   */
  const upload = useCallback(
    (params = {}, is_debug = false) => {
      _log(`upload is_debug:${is_debug}`, params, is_debug);

      return React.createElement(components.Upload, {
        ...params,
        is_debug,
      });
    },
    [form]
  );

  /**
   * アップロードコンポーネントを生成する関数
   * @param {Object} params - アップロードの設定パラメータ
   * @param {boolean} is_debug - デバッグモードフラグnvm
   * @returns {JSX.Element} アップロードコンポーネント
   */
  const download = useCallback(
    (params = {}, is_debug = false) => {
      _log(`download is_debug:${is_debug}`, params, is_debug);

      return React.createElement(components.Download, {
        ...params,
        is_debug,
      });
    },
    [form]
  );

  /**
   * フォームのバリデーションを実行する関数
   * @param {Object} rules - バリデーションルール
   * @returns {Object} バリデーションエラーのオブジェクト
   */
  const validateForm = (rules) => {
    const errors = {};
    Object.entries(rules).forEach(([field, rule]) => {
      if (rule.required && !form[field]) {
        errors[field] = "必須項目です";
      }
      if (rule.pattern && !rule.pattern.test(form[field])) {
        errors[field] = rule.message || "形式が正しくありません";
      }
    });
    return errors;
  };

  /**
   * フォームを初期状態にリセットする関数
   */
  const resetForm = () => {
    setForm(initState);
  };

  const handleChange = useCallback((name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (callback) => {
      setIsLoading(true);
      try {
        await callback(form);
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );

  return [
    form,
    {
      get,
      set,
      setForm,
      button,
      iconButton,
      input,
      checkbox,
      datePicker,
      datePickerFromTo,
      link,
      radio,
      select,
      selectMulti,
      autoComplete,
      validateForm,
      resetForm,
      handleChange,
      handleSubmit,
      isLoading,
      iconMenu,
      toggleSwitch,
      upload,
      download,
      tooltip,
      popper,
    },
  ];
};

export default useForm;
