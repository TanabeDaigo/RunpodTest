"use client";

import { useState, useCallback } from "react";

/**
 * ローディング状態を管理するカスタムフック
 * @returns {Object} ローディング状態と制御関数
 */
function useLoading() {
  const [loading, setLoading] = useState(false);

  /**
   * ローディングを表示
   */
  const showLoading = useCallback(() => {
    setLoading(true);
  }, []);

  /**
   * ローディングを非表示
   */
  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  /**
   * 非同期処理をローディング表示付きで実行
   * @param {Function} asyncFn - 実行する非同期関数
   * @returns {Promise} 非同期関数の実行結果
   */
  const withLoading = useCallback(
    async (asyncFn) => {
      try {
        showLoading();
        return await asyncFn();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  return {
    loading,
    showLoading,
    hideLoading,
    withLoading,
  };
}

export default useLoading;
