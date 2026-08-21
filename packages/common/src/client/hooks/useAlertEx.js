"use client";

import { useCallback } from "react";
import { hooks } from "@metrojs/client";
const { useAlert } = hooks;

/**
 * アラートダイアログを管理する拡張カスタムフック
 * useAlertのラッパーとして機能し、追加の機能を提供します
 * @returns {Object} アラート状態と制御関数
 */
export function useAlertEx() {
  const { alert, showAlert: originalShowAlert, closeAlert: originalCloseAlert } = useAlert();

  const showAlert = useCallback(
    (title, message, severity) => {
      originalShowAlert(title, message, severity);
    },
    [originalShowAlert]
  );

  const closeAlert = useCallback(() => {
    originalCloseAlert();
  }, [originalCloseAlert]);

  /**
   * 成功アラートを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [title="Success"] - ダイアログのタイトル
   */
  const showSuccess = useCallback(
    (message, title = "Success") => {
      showAlert(title, message, "success");
    },
    [showAlert]
  );

  /**
   * エラーアラートを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [title="Error"] - ダイアログのタイトル
   */
  const showError = useCallback(
    (message, title = "Error") => {
      showAlert(title, message, "error");
    },
    [showAlert]
  );

  /**
   * 警告アラートを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [title="Warning"] - ダイアログのタイトル
   */
  const showWarning = useCallback(
    (message, title = "Warning") => {
      showAlert(title, message, "warning");
    },
    [showAlert]
  );

  /**
   * 情報アラートを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [title="Information"] - ダイアログのタイトル
   */
  const showInfo = useCallback(
    (message, title = "Information") => {
      showAlert(title, message, "info");
    },
    [showAlert]
  );

  return {
    alert,
    showAlert,
    closeAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
