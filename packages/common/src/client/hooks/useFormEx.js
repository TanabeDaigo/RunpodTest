/**
 * @file useFormEx.js
 * @description フォームの状態管理とUIコンポーネントを統合したカスタムフック
 *
 * このモジュールは、フォームの状態管理とUIコンポーネントの制御を
 * 一元化するためのカスタムフックを提供します。
 *
 * 主な機能：
 * - フォームの状態管理
 * - 入力フィールドの制御
 * - ボタンの制御
 * - アイコンボタンの制御
 * - ローディング状態の管理
 *
 * @example
 * // 基本的な使用方法
 * const [form, formProps] = useFormEx({ name: '', email: '' });
 *
 * // コンポーネント内での使用
 * return (
 *   <form onSubmit={formProps.handleSubmit}>
 *     {formProps.input({
 *       name: 'name',
 *       label: '名前',
 *       required: true
 *     })}
 *     {formProps.button('submit', {
 *       onClick: handleSubmit
 *     })}
 *   </form>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import useInputEx from "./FormEx/useInputEx";
import useInputLoginEx from "./FormEx/useInputLoginEx";
import useButtonEx from "./FormEx/useButtonEx";
import useRadioEx from "./FormEx/useRadioEx";
import useSelectEx from "./FormEx/useSelectEx";
import useAutoCompleteEx from "./FormEx/useAutoCompleteEx";
import useIconButtonEx from "./FormEx/useIconButtonEx";
import useDatePickerEx from "./FormEx/useDatePickerEx";
import useCheckBoxEx from "./FormEx/useCheckBoxEx";
import useSwitchEx from "./FormEx/useSwitchEx";
import { useLoadingEx } from "./useLoadingEx";
import { useSnackbarEx } from "./useSnackbarEx";
import { useAlertEx } from "./useAlertEx";
import { useConfirmEx } from "./useConfirmEx";
import logjs from "@metrojs/logjs";
import { hooks } from "@metrojs/client";
import { useState, useEffect } from "react";

//const log = new logjs("useFormEx");

/**
 * フォームの状態管理とUIコンポーネントを統合したカスタムフック
 *
 * @param {Object} initState - フォームの初期状態
 * @returns {Array} [form, formProps] - フォームの状態と制御関数
 *
 * @example
 * // 基本的な使用
 * const [form, formProps] = useFormEx({
 *   name: '',
 *   email: ''
 * });
 *
 * // フォームの値を使用
 * console.log(form.name); // 入力された名前
 *
 * // フォームの制御
 * formProps.handleChange('name', 'John');
 * formProps.handleSubmit();
 *
 * // ローディング状態の制御
 * formProps.setIsLoading(true);
 * // 処理完了後
 * formProps.setIsLoading(false);
 */
const useFormEx = (initState = {}, state = {}, actions = {}) => {
  //log.debug(`useFormEx initState:${JSON.stringify(initState)}`);
  const [form, formProps] = hooks.useForm(initState);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inputProps = useInputEx(form, formProps);
  const inputLoginProps = useInputLoginEx(form, formProps, state, actions);
  const buttonProps = useButtonEx(form, formProps);
  const iconButtonProps = useIconButtonEx(form, formProps);
  const radioProps = useRadioEx(form, formProps, state, actions);
  const selectProps = useSelectEx(form, formProps, state, actions);
  const autoCompleteProps = useAutoCompleteEx(form, formProps, state, actions);
  const datePickerProps = useDatePickerEx(form, formProps, state, actions);
  const checkBoxProps = useCheckBoxEx(form, formProps);
  const switchProps = useSwitchEx(form, formProps);
  const { loading, showLoading, hideLoading, withLoading } = useLoadingEx();
  const { showSnackbar, showSuccess, showError, showWarning, showInfo } = useSnackbarEx();
  const { alert, showAlert, closeAlert, showSuccess: showAlertSuccess, showError: showAlertError, showWarning: showAlertWarning, showInfo: showAlertInfo } = useAlertEx();
  const { confirm, showConfirm } = useConfirmEx();
  return [
    form,
    {
      ...formProps,
      ...inputProps,
      ...inputLoginProps,
      ...buttonProps,
      ...iconButtonProps,
      ...radioProps,
      ...selectProps,
      ...autoCompleteProps,
      ...datePickerProps,
      ...checkBoxProps,
      ...switchProps,
      isMounted,
      isLoading,
      setIsLoading,
      loading,
      showLoading,
      hideLoading,
      withLoading,
      showSnackbar,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      alert,
      showAlert,
      closeAlert,
      showAlertSuccess,
      showAlertError,
      showAlertWarning,
      showAlertInfo,
      confirm,
      showConfirm,
    },
  ];
};

export default useFormEx;
