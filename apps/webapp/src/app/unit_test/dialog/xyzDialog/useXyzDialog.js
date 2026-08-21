"use client";

import { hooks } from "@common/client";
import XyzDialog from "./XyzDialog";

const { useCustomDialog } = hooks;

/**
 * カスタムダイアログのフック
 * @returns {Object} ダイアログの状態と制御関数
 */
export const useXyzDialog = () => {
  const { open, onClose, isOpen, renderDialog } = useCustomDialog(XyzDialog);

  return {
    open,
    onClose,
    isOpen,
    renderDialog,
  };
};
