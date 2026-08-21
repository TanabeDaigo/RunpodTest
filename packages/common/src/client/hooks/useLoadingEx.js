"use client";

import { useCallback, useState } from "react";

/**
 * ローディング状態を管理する拡張カスタムフック
 * useLoadingのラッパーとして機能し、追加の機能を提供します
 * @returns {Object} ローディング状態と制御関数
 */
export function useLoadingEx() {
  const [loading, setLoading] = useState(false);

  const showLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(
    async asyncFn => {
      try {
        showLoading();
        const result = await asyncFn();
        return result;
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
