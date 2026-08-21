"use client";

import { useCallback } from "react";
import { hooks } from "@metrojs/client";

/**
 * 確認ダイアログを表示するための拡張カスタムフック
 * useConfirmのラッパーとして機能し、追加の機能を提供します
 * @returns {Object} 確認ダイアログ操作のメソッド
 */
export function useConfirmEx() {
  const { confirm, showConfirm: originalShowConfirm } = hooks.useConfirm();

  const showConfirm = useCallback(
    (title, message, onConfirm, onCancel) => {
      // 戻り値（Promise<boolean>）を返すようにする
      return originalShowConfirm(title, message, onConfirm, onCancel);
    },
    [originalShowConfirm]
  );

  return { confirm, showConfirm };
}
