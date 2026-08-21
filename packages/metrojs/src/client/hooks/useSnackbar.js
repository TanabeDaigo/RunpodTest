"use client";

import { useCallback } from "react";
import { enqueueSnackbar } from "notistack";
/**
 * スナックバーを管理するカスタムフック
 * @returns {Object} スナックバーの状態と制御関数
 */
function useSnackbar() {
  /**
   * スナックバーを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [severity="info"] - メッセージの種類（success/error/warning/info）
   * @param {number} [autoHideDuration=6000] - 自動非表示までの時間（ミリ秒）
   */
  const showSnackbar = useCallback((message, options = {}) => {
    const {
      variant = "info",
      autoHideDuration = 6000,
    } = options;
    enqueueSnackbar(message, {
      variant,
      autoHideDuration,
    });
  }, []);

  return {
    showSnackbar,
  };
}

export default useSnackbar;
