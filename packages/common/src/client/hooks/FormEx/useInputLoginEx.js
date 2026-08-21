/**
 * @file useInputLoginEx.js
 * @description ログイン関連のフォーム入力フィールドを簡単に生成するためのカスタムフック
 *
 * このフックは、ログイン機能に特化した入力フィールドを提供します。
 * ログインID入力フィールド、パスワード入力フィールド（可視性切り替え機能付き）、
 * パスワード検証機能を含みます。
 *
 * @example
 * // 基本的な使用例
 * const [form, formProps] = useFormEx();
 * const { input_login_id, input_password, validatePassword } = useInputLoginEx(form, formProps);
 *
 * // コンポーネント内での使用
 * return (
 *   <form>
 *     {input_login_id({
 *       label: "ユーザーID",
 *       placeholder: "メールアドレスを入力"
 *     })}
 *     {input_password({
 *       name: "userPassword",
 *       label: "パスワードを入力",
 *       required: true
 *     })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 * @since 2024-03-01
 */

"use client";

import logjs from "@metrojs/logjs";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import React from "react";

const log = new logjs("useInputLoginEx");

const useInputLoginEx = (form = {}, formProps = {}, state = {}, actions = {}) => {
  // パスワード表示状態の管理
  const [showPassword, setShowPassword] = useState(false);
  // ローディング状態の管理
  const [isLoading, setIsLoading] = useState(false);
  // コンポーネントのマウント状態の管理
  const [isMounted, setIsMounted] = useState(false);

  // コンポーネントのマウント/アンマウントの監視
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // フォームデータの変更時にローディング状態をリセット
  useEffect(() => {
    setIsLoading(false);
  }, [form]);

  /**
   * パスワードの表示/非表示を切り替えるハンドラー
   * @private
   */
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * パスワード表示ボタンのマウスダウンイベントハンドラー
   * @param {Event} event - マウスイベント
   * @private
   */
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  /**
   * ログインID入力フィールドを生成する関数
   * @param {Object} params - 入力フィールドのパラメータ
   * @param {string} [params.type="text"] - 入力タイプ
   * @param {string} [params.name="login_id"] - フィールド名
   * @param {string} [params.label="ログインID"] - ラベルテキスト
   * @param {string} [params.placeholder="ログインID"] - プレースホルダーテキスト
   * @param {Object} [params.sx] - スタイルオブジェクト
   * @param {boolean} [is_debug=false] - デバッグモード
   * @returns {JSX.Element} ログインID入力フィールド
   *
   * @example
   * // 基本的な使用
   * {input_login_id()}
   *
   * // カスタマイズした使用
   * {input_login_id({
   *   label: "ユーザーID",
   *   placeholder: "メールアドレスを入力",
   *   sx: { width: "300px" }
   * })}
   */
  const input_login_id = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`input_login_id form.login_id:${form?.login_id} params:`, params);
    }
    const defaultParams = {
      type: "text",
      name: "login_id",
      label: "ログインID",
      placeholder: "ログインID",
      size: "medium",
      fullWidth: true,
    };
    return formProps.input(
      "login_id",
      {
        ...defaultParams,
        ...params,
      },
      is_debug
    );
  };

  /**
   * パスワード入力フィールドを生成する関数
   * パスワードの表示/非表示切り替え機能付き
   * @param {Object} params - 入力フィールドのパラメータ
   * @param {string} [params.name="password"] - フィールド名
   * @param {string} [params.label="パスワード"] - ラベルテキスト
   * @param {boolean} [params.required=false] - 必須入力かどうか
   * @param {string} [params.error] - エラーメッセージ
   * @param {Object} [params.sx] - スタイルオブジェクト
   * @param {boolean} [is_debug=false] - デバッグモード
   * @returns {JSX.Element} パスワード入力フィールド
   *
   * @example
   * // 基本的な使用
   * {input_password()}
   *
   * // カスタマイズした使用
   * {input_password({
   *   name: "userPassword",
   *   label: "パスワードを入力",
   *   required: true,
   *   sx: { width: "300px" }
   * })}
   */
  const input_password = (params = {}, is_debug = false) => {
    if (is_debug) {
      log.debug(`input_password form.password:${form?.password} params:`, params);
    }
    const { name = "password", label = "パスワード", error, ...rest } = params;
    const inputType = isMounted ? (showPassword ? "text" : "password") : "password";

    const inputProps = {
      ...rest,
      label,
      type: inputType,
      disabled: isLoading,
      clear: false,
      error: !!error,
      helperText: error,
      size: "medium",
      fullWidth: true,
      value: form[name] || "",
      inputProps: {
        type: inputType,
      },
      InputProps: isMounted
        ? {
            endAdornment: (
              <InputAdornment position="end">
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end" aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }
        : null,
    };

    return formProps.input(name, inputProps, false);
  };

  /**
   * パスワードの強度を検証する関数
   * @param {string} password - 検証するパスワード
   * @returns {Object} 検証結果
   * @returns {boolean} returns.isValid - パスワードが有効かどうか
   * @returns {string} returns.message - エラーメッセージ（無効な場合）
   *
   * @example
   * const validation = validatePassword("MyPassword123!");
   * if (!validation.isValid) {
   *   console.error(validation.message);
   * }
   */
  const validatePassword = (password) => {
    // パスワードの強度チェック
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      message: "パスワードは8文字以上で、大文字、小文字、数字、特殊文字を含む必要があります",
    };
  };

  return {
    input_login_id,
    input_password,
    validatePassword,
  };
};

export default useInputLoginEx;
