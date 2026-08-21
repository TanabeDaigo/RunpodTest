/**
 * @file getIconButtonTemplate.js
 * @description Material-UIのアイコンボタンコンポーネントのテンプレートを提供するユーティリティ
 *
 * このモジュールは、アプリケーション全体で一貫性のあるアイコンボタンデザインを実現するための
 * テンプレートを提供します。各アイコンボタンは以下の要素で構成されます：
 * - アイコン（Material Icons）
 * - カラー
 * - サイズ
 * - アクセシビリティラベル
 * - ツールチップ
 *
 * @example
 * // 基本的な使用方法
 * const buttonProps = getIconButtonTemplate('delete');
 * <IconButton {...buttonProps} />
 *
 * // カスタマイズした使用方法
 * const buttonProps = getIconButtonTemplate('edit');
 * <IconButton
 *   {...buttonProps}
 *   onClick={handleEdit}
 *   disabled={!canEdit}
 * />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import FingerprintRoundedIcon from "@mui/icons-material/FingerprintRounded";
import AlarmRoundedIcon from "@mui/icons-material/AlarmRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";

/**
 * アイコンボタンのテンプレートを取得する関数
 *
 * 利用可能なモード：
 * - delete: 削除ボタン（赤色）
 * - edit: 編集ボタン（青色）
 * - view: 詳細表示ボタン（水色）
 * - cart: カートボタン（青色）
 * - finger: 指紋認証ボタン（青色）
 * - alarm: アラームボタン（黄色）
 * - send: 送信ボタン（青色）
 * - copy: コピーボタン（青色）
 *
 * @param {string} mode - アイコンボタンのモード
 * @returns {Object} アイコンボタンのテンプレート
 *
 * @example
 * // 削除ボタンのテンプレートを取得
 * const deleteButtonProps = getIconButtonTemplate('delete');
 * <IconButton {...deleteButtonProps} onClick={handleDelete} />
 *
 * // 編集ボタンのテンプレートを取得（カスタマイズ付き）
 * const editButtonProps = getIconButtonTemplate('edit');
 * <IconButton
 *   {...editButtonProps}
 *   onClick={handleEdit}
 *   disabled={!canEdit}
 * />
 *
 * // 存在しないモードの場合のデフォルトテンプレート
 * const customButtonProps = getIconButtonTemplate('custom');
 * // デフォルトのアイコンボタンプロパティが返されます
 */
const getIconButtonTemplate = (mode) => {
  switch (mode) {
    case "delete":
      return {
        icon: <DeleteRoundedIcon />,
        color: "error",
        size: "medium",
        "aria-label": "削除",
        title: "削除",
      };
    case "edit":
      return {
        icon: <EditRoundedIcon />,
        color: "primary",
        size: "medium",
        "aria-label": "編集",
        title: "編集",
      };
    case "view":
      return {
        icon: <VisibilityRoundedIcon />,
        color: "info",
        size: "medium",
        "aria-label": "詳細表示",
        title: "詳細表示",
      };
    case "cart":
      return {
        icon: <ShoppingCartRoundedIcon />,
        color: "primary",
        size: "medium",
        "aria-label": "カート",
        title: "カート",
      };
    case "finger":
      return {
        icon: <FingerprintRoundedIcon />,
        color: "primary",
        size: "medium",
        "aria-label": "指紋認証",
        title: "指紋認証",
      };
    case "alarm":
      return {
        icon: <AlarmRoundedIcon />,
        color: "warning",
        size: "medium",
        "aria-label": "アラーム",
        title: "アラーム",
      };
    case "send":
      return {
        icon: <SendRoundedIcon />,
        color: "primary",
        size: "medium",
        "aria-label": "送信",
        title: "送信",
      };
    case "copy":
      return {
        icon: <ContentCopyRoundedIcon />,
        color: "primary",
        size: "medium",
        "aria-label": "コピー",
        title: "コピー",
      };
    default:
      return {
        icon: null,
        color: "default",
        size: "medium",
        "aria-label": "アイコンボタン",
        title: "アイコンボタン",
      };
  }
};

export default getIconButtonTemplate;
