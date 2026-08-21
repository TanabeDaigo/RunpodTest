"use client";

import { useState, useCallback } from "react";
import logjs from "@metrojs/logjs";

const log = new logjs("useAlert");

import { useDialogs } from "@toolpad/core/useDialogs";

/**
 * アラートダイアログを管理するカスタムフック
 * @returns {Object} アラート状態と制御関数
 */
function useAlert() {
  const dialogs = useDialogs();
  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    severity: "info",
  });

  /**
   * アラートを表示
   * @param {string} message - 表示するメッセージ
   * @param {string} [title=""] - ダイアログのタイトル
   * @param {string} [severity="info"] - アラートの種類（success/error/warning/info）
   */
  const showAlert = useCallback((title = "", message, severity = "info") => {
    log.info(`showAlert ${title} ${message} ${severity}`);
    setAlert({
      open: true,
      title,
      message,
      severity,
    });

    dialogs.alert(<div dangerouslySetInnerHTML={{ __html: message }} />, {
      title,
      okText: "OK",
      icon: severity === "success" ? "CheckCircle" : severity === "error" ? "Error" : severity === "warning" ? "Warning" : severity === "info" ? "Info" : "Info",
      iconProps: {
        color: severity,
        fontSize: "large",
      },
    });
  }, []);

  /**
   * アラートを閉じる
   */
  const closeAlert = useCallback(() => {
    log.info("closeAlert");
    setAlert((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    alert,
    showAlert,
    closeAlert,
  };
}

export default useAlert;
