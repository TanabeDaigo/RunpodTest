/**
 * @file useButtonEx.js
 * @description Material-UIのボタンコンポーネントを拡張したカスタムフック
 *
 * このモジュールは、フォーム内で使用するボタンコンポーネントの
 * 状態管理とプロパティ設定を簡素化するためのカスタムフックを提供します。
 *
 * 主な機能：
 * - ボタンのテンプレート管理
 * - デバッグログ機能
 * - ログインボタンの特殊処理
 *
 * @example
 * // 基本的な使用方法
 * const [buttonEx] = useButtonEx(form, formProps);
 * const submitButton = buttonEx.button('submit', { onClick: handleSubmit });
 *
 * // ログインボタンの使用
 * const loginButton = buttonEx.button_login({ onClick: handleLogin });
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import logjs from "@metrojs/logjs";
import { libs } from "@metrojs/client";
const log = new logjs("useFormEx"); // 使用されていないため削除

/**
 * ボタンコンポーネントを拡張したカスタムフック
 *
 * @param {Object} form - フォームの状態オブジェクト
 * @param {Object} formProps - フォームのプロパティオブジェクト
 * @returns {Array} ボタン関連の関数を含むオブジェクトの配列
 *
 * @example
 * const [buttonEx] = useButtonEx(form, formProps);
 * const submitButton = buttonEx.button('submit', { onClick: handleSubmit });
 */
const useButtonEx = (form = {}, formProps = {}) => {
  //log.debug(`useButtonEx form:`, form);

  /**
   * デバッグログを出力する内部関数
   * @private
   * @param {string} message - ログメッセージ
   * @param {Object} arr - ログに出力するオブジェクト
   * @param {boolean} is_debug - デバッグモードフラグ
   */
  const _log = (message, arr = {}, is_debug = false) => {
    if (is_debug != false) {
      log.debug(message, arr);
    }
  };

  /**
   * ボタンのプロパティを設定して返す関数
   *
   * @param {string} mode - ボタンのモード (例: submit, cancel など)
   * @param {Object} params - 追加のプロパティ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} ボタンコンポーネント
   *
   * @example
   * const submitButton = buttonEx.button('submit', {
   *   onClick: handleSubmit,
   *   disabled: isLoading
   * });
   */
  const button = (mode, params = {}, is_debug = false) => {
    const buttonProps = libs.getButtonTemplate(mode); // モードに応じたテンプレートを取得
    const { children, ...restParams } = params; // childrenを分離

    _log(`mode:${mode} params:${params}`, params, is_debug);
    return formProps.button(
      {
        ...buttonProps,
        ...restParams,
        children: children || buttonProps.children,
      },
      is_debug
    );
  };

  /**
   * ログインボタンを生成する関数
   *
   * @param {Object} params - 追加のプロパティ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} ログインボタンコンポーネント
   *
   * @example
   * const loginButton = buttonEx.button_login({
   *   onClick: handleLogin,
   *   disabled: !isValid
   * });
   */
  const button_login = (params = {}, is_debug = false) => {
    _log(`button_login params:${params}`, params, is_debug);
    return formProps.button({
      children: "ログイン",
      color: "primary",
      variant: "contained",
      size: "large",
      fullWidth: true,
      ...params,
    });
  };

  return {
    button,
    button_login,
  };
};

export default useButtonEx;
