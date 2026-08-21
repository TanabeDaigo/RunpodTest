/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Hooks Index                                       ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   A collection of custom React hooks for MetroJS             ║
 * ║   applications, providing enhanced functionality             ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file index.js
 * @description カスタムフックのエクスポート用インデックスファイル
 *
 * 以下のフックを提供:
 * - useIsWindowFocused: ウィンドウのフォーカス状態を監視
 * - useForm: フォーム管理とバリデーション
 * - useValidation: フォームバリデーション
 * - useResponsive: レスポンシブデザイン対応
 *
 * @example
 * import { useForm, useIsWindowFocused } from '@krono-metro/metrojs/hooks';
 *
 * // フォームフックの使用
 * const { values, handleChange } = useForm(initialValues);
 *
 * // ウィンドウフォーカスフックの使用
 * const [isFocused] = useIsWindowFocused();
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import useIsWindowFocused from "./useIsWindowFocused.js";
//import getButtonTemplate from "./getButtonTemplate.js";
import useForm from "./useForm.js";
import useValidation from "./useValidation.js";
import useResponsive from "./useResponsive.js";
import useAlert from "./useAlert.js";
import useConfirm from "./useConfirm.js";
import useSnackbar from "./useSnackbar.js";
import useLoading from "./useLoading.js";

/**
 * カスタムフックのコレクション
 * @type {Object}
 */
const hooks = {
  useIsWindowFocused,
  useForm,
  useValidation,
  useResponsive,
  useAlert,
  useConfirm,
  useSnackbar,
  useLoading,
};

// デフォルトエクスポート
export default hooks;

// 名前付きエクスポート
export { useIsWindowFocused, useForm, useValidation, useResponsive, useAlert, useConfirm, useSnackbar, useLoading };
