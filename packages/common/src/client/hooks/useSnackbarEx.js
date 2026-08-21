"use client";

import { useCallback } from "react";
import { hooks } from "@metrojs/client";

/**
 * スナックバー通知を管理する拡張カスタムフック
 * useSnackbarのラッパーとして機能し、追加の機能を提供します
 * @returns {Object} スナックバー状態と制御関数
 */
export function useSnackbarEx() {
  const { showSnackbar: originalShowSnackbar } = hooks.useSnackbar();

  const showSnackbar = useCallback(
    (message, options) => {
      originalShowSnackbar(message, options);
    },
    [originalShowSnackbar]
  );

  /**
   * 成功メッセージを表示
   * @param {string} message - 表示するメッセージ
   */
  const showSuccess = useCallback(
    message => {
      showSnackbar(message, { variant: "success" });
    },
    [showSnackbar]
  );

  /**
   * エラーメッセージを表示
   * @param {string} message - 表示するメッセージ
   */
  const showError = useCallback(
    message => {
      showSnackbar(message, { variant: "error" });
    },
    [showSnackbar]
  );

  /**
   * 警告メッセージを表示
   * @param {string} message - 表示するメッセージ
   */
  const showWarning = useCallback(
    message => {
      showSnackbar(message, { variant: "warning" });
    },
    [showSnackbar]
  );

  /**
   * 情報メッセージを表示
   * @param {string} message - 表示するメッセージ
   */
  const showInfo = useCallback(
    (message, autoHideDuration = null) => {
      if (autoHideDuration) {
        showSnackbar(message, { variant: "info", autoHideDuration });
      } else {
        showSnackbar(message, { variant: "info" });
      }
    },
    [showSnackbar]
  );

  return {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
