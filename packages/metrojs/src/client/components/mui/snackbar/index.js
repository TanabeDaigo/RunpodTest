/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Custom Snackbar Components                        ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   Elegant and powerful snackbar components built with         ║
 * ║   Material-UI, providing seamless notification experience     ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file index.js
 * @description カスタムスナックバーコンポーネント
 *
 * Material-UIのSnackbarコンポーネントをラップし、以下の機能を提供:
 * - 基本的なスナックバー通知
 * - アラートスタイルのスナックバー
 * - カスタマイズ可能な表示時間
 * - アクセシビリティ対応
 * - テスト用IDの提供
 *
 * @example
 * // 基本的なスナックバー
 * <Snackbar
 *   open={open}
 *   message="処理が完了しました"
 *   onClose={handleClose}
 * />
 *
 * // アラートスタイルのスナックバー
 * <SnackbarAlert
 *   open={open}
 *   message="エラーが発生しました"
 *   severity="error"
 *   variant="filled"
 *   onClose={handleClose}
 * />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import React from "react";
import { Snackbar, SnackbarContent, Alert } from "@mui/material";
import PropTypes from "prop-types";

/**
 * 基本的なスナックバーコンポーネント
 * シンプルなメッセージ表示用のスナックバー
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {boolean} props.open - スナックバーの表示/非表示状態
 * @param {string} props.message - 表示するメッセージ
 * @param {Function} props.onClose - 閉じる時のコールバック関数
 * @returns {JSX.Element} スナックバーコンポーネント
 */
const CustomSnackbar = React.memo(({ open, message, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <SnackbarContent message={message} />
    </Snackbar>
  );
});

CustomSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

/**
 * スナックバーのデフォルトプロパティ
 * 基本的な設定値を定義
 *
 * @type {Object}
 */
const DEFAULT_SNACKBAR_PROPS = {
  autoHideDuration: 6000,
  anchorOrigin: { vertical: "bottom", horizontal: "center" },
  severity: "success",
  variant: "filled",
};

/**
 * スナックバーのスタイル定義
 * 基本レイアウトなどのスタイルを設定
 *
 * @type {Object}
 */
const SNACKBAR_STYLES = {
  root: {
    "& .MuiAlert-root": {
      width: "100%",
      maxWidth: "600px",
    },
  },
};

/**
 * テスト用IDの定義
 * テスト時に使用するIDを定義
 *
 * @type {Object}
 */
export const TEST_IDS = {
  SNACKBAR: "snackbar",
  ALERT: "snackbar-alert",
  MESSAGE: "snackbar-message",
};

/**
 * アラートスタイルのスナックバーコンポーネント
 * エラー、警告、情報、成功などの状態を表示するスナックバー
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {boolean} props.open - スナックバーの表示/非表示状態
 * @param {string} props.message - 表示するメッセージ
 * @param {Function} props.onClose - 閉じる時のコールバック関数
 * @param {('error'|'warning'|'info'|'success')} [props.severity='success'] - アラートの種類
 * @param {('filled'|'outlined'|'standard')} [props.variant='filled'] - アラートのスタイルバリアント
 * @param {number} [props.autoHideDuration=6000] - 自動で閉じるまでの時間（ミリ秒）
 * @param {Object} [props.anchorOrigin] - スナックバーの表示位置
 * @param {Object} [props.sx] - カスタムスタイル
 * @param {string} [props.role='alert'] - ARIAロール
 * @param {string} [props.testId] - テスト用ID
 * @returns {JSX.Element} アラートスタイルのスナックバーコンポーネント
 */
function CustomSnackbarAlert({
  open,
  message,
  onClose,
  severity = DEFAULT_SNACKBAR_PROPS.severity,
  variant = DEFAULT_SNACKBAR_PROPS.variant,
  autoHideDuration = DEFAULT_SNACKBAR_PROPS.autoHideDuration,
  anchorOrigin = DEFAULT_SNACKBAR_PROPS.anchorOrigin,
  sx = {},
  role = "alert",
  testId = TEST_IDS.SNACKBAR,
}) {
  if (!message) {
    console.warn("SnackbarAlert: message prop is required");
    return null;
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      sx={{ ...SNACKBAR_STYLES.root, ...sx }}
      role={role}
      aria-live="polite"
      data-testid={testId}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant={variant}
        data-testid={TEST_IDS.ALERT}
      >
        <span
          data-testid={TEST_IDS.MESSAGE}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </Alert>
    </Snackbar>
  );
}

/**
 * プロパティの型定義
 * コンポーネントのプロパティの型を定義し、開発時の型チェックを提供
 *
 * @type {Object}
 */
CustomSnackbarAlert.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
  autoHideDuration: PropTypes.number,
  anchorOrigin: PropTypes.object,
  sx: PropTypes.object,
  role: PropTypes.string,
  testId: PropTypes.string,
};

export { CustomSnackbar as Snackbar, CustomSnackbarAlert as SnackbarAlert };
