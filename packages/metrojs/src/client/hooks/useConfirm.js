"use client";

import { useState, useCallback } from "react";
import logjs from "@metrojs/logjs";
import { useDialogs } from "@toolpad/core/useDialogs";

const log = new logjs("useConfirm");

/**
 * 確認ダイアログを管理するカスタムフック
 * @returns {Object} 確認ダイアログの制御関数
 */
function useConfirm() {
  const dialogs = useDialogs();
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
  });

  /**
   * 確認ダイアログを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [title=""] - ダイアログのタイトル
   * @returns {Promise<boolean>} ユーザーの選択結果
   */
  const showConfirm = (title = "", message) => {
    log.info(`showConfirm ${title} ${message}`);
    setConfirm({
      open: true,
      title,
      message,
    });

    const result = dialogs.confirm(<div dangerouslySetInnerHTML={{ __html: message }} />, {
      title,
      okText: "OK",
      cancelText: "キャンセル",
      icon: "Help",
      iconProps: {
        color: "primary",
        fontSize: "large",
      },
      onOk: () => {
        setConfirm((prev) => ({ ...prev, open: false }));
        resolve(true);
      },
      onCancel: () => {
        setConfirm((prev) => ({ ...prev, open: false }));
        resolve(false);
      },
    });
    return result;
  };

  return {
    confirm,
    showConfirm,
  };
}

export default useConfirm;
