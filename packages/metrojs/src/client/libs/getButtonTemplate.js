/**
 * @file getButtonTemplate.js
 * @description Material-UIのボタンコンポーネントのテンプレートを提供するユーティリティ
 *
 * このモジュールは、アプリケーション全体で一貫性のあるボタンデザインを実現するための
 * テンプレートを提供します。各ボタンは以下の要素で構成されます：
 * - アイコン（Material Icons）
 * - テキスト
 * - サイズ
 * - バリアント
 * - カラー
 *
 * @example
 * // 基本的な使用方法
 * const buttonProps = getButtonTemplate('save');
 * <Button {...buttonProps} />
 *
 * // カスタマイズした使用方法
 * const buttonProps = getButtonTemplate('submit');
 * <Button {...buttonProps} onClick={handleSubmit} disabled={isLoading} />
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import * as React from "react";
import SaveRounded from "@mui/icons-material/SaveRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import DeleteIcon from "@mui/icons-material/DeleteRounded";
import CopyIcon from "@mui/icons-material/FileCopyRounded";
import CachedRounded from "@mui/icons-material/CachedRounded";
import MailIcon from "@mui/icons-material/MailRounded";
import ExitIcon from "@mui/icons-material/ExitToAppRounded";
import ThumbUpIcon from "@mui/icons-material/ThumbUpRounded";
import ThumbDownIcon from "@mui/icons-material/ThumbDownRounded";
import ClearIcon from "@mui/icons-material/ClearAllRounded";
import AddRowIcon from "@mui/icons-material/PlaylistAddRounded";
import FindIcon from "@mui/icons-material/SearchRounded";
import EditIcon from "@mui/icons-material/EditRounded";
import AddIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DownloadIcon from "@mui/icons-material/CloudDownloadRounded";
import SortIcon from "@mui/icons-material/SortRounded";
import ArrowBackIcon from "@mui/icons-material/ArrowBackRounded";
import PrintIcon from "@mui/icons-material/Print";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFullRounded";
import UploadIcon from "@mui/icons-material/CloudUploadRounded";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIosRounded";
/**
 * ボタンのデフォルトサイズ
 * @constant
 * @type {string}
 */
const _DEFAULT_SIZE = "small";

/**
 * 指定されたモードに基づいてボタンのテンプレートを取得する関数
 *
 * 利用可能なモード：
 * - submit: 送信ボタン
 * - save: 保存ボタン
 * - update: 更新ボタン
 * - delete: 削除ボタン
 * - cancel: キャンセルボタン
 * - close: 閉じるボタン
 * - reload: 再読込ボタン
 * - copy: コピーボタン
 * - mail: メール送信ボタン
 * - exit: 戻るボタン
 * - add: 追加ボタン
 * - find: 検索ボタン
 * - like: いいねボタン
 * - thumbUp: 承認ボタン
 * - thumbDown: 却下ボタン
 * - clear: クリアボタン
 * - edit: 編集ボタン
 * - new: 新規作成ボタン
 * - download: ダウンロードボタン
 * - sort: 並び替えボタン
 * - back: 戻るボタン
 * - print: 印刷ボタン
 *
 * @param {string} mode - ボタンのモード
 * @returns {Object} ボタンのプロパティ
 *
 * @example
 * // 保存ボタンのテンプレートを取得
 * const saveButtonProps = getButtonTemplate('save');
 * <Button {...saveButtonProps} />
 *
 * // 削除ボタンのテンプレートを取得（カスタマイズ付き）
 * const deleteButtonProps = getButtonTemplate('delete');
 * <Button
 *   {...deleteButtonProps}
 *   onClick={handleDelete}
 *   disabled={!canDelete}
 * />
 *
 * // 存在しないモードの場合のデフォルトテンプレート
 * const customButtonProps = getButtonTemplate('custom');
 * // デフォルトのボタンプロパティが返されます
 */
const getButtonTemplate = (mode) => {
  const data = {
    submit: {
      size: _DEFAULT_SIZE,
      children: "送信",
      variant: "contained",
      color: "primary",
    },
    reload: {
      size: _DEFAULT_SIZE,
      children: "再読込",
      startIcon: <CachedRounded />,
    },
    save: {
      size: _DEFAULT_SIZE,
      children: "登録する",
      startIcon: <SaveRounded />,
    },
    update: {
      size: _DEFAULT_SIZE,
      children: "更新する",
      startIcon: <SaveRounded />,
    },
    copy: {
      size: _DEFAULT_SIZE,
      children: "コピーする",
      startIcon: <CopyIcon />,
    },
    cancel: {
      size: _DEFAULT_SIZE,
      children: "キャンセル",
      startIcon: <CachedRounded />,
    },
    close: {
      size: _DEFAULT_SIZE,
      children: "閉じる",
      startIcon: <CloseIcon />,
    },
    delete: {
      size: _DEFAULT_SIZE,
      children: "削除",
      startIcon: <DeleteIcon />,
    },
    mail: {
      size: _DEFAULT_SIZE,
      children: "メール送信",
      startIcon: <MailIcon />,
    },
    exit: { size: _DEFAULT_SIZE, children: "戻る", startIcon: <ExitIcon /> },
    add: {
      size: _DEFAULT_SIZE,
      children: "追加する",
      startIcon: <AddRowIcon />,
    },
    find: { size: _DEFAULT_SIZE, children: "検索", startIcon: <FindIcon /> },
    like: {
      size: _DEFAULT_SIZE,
      children: "いいね",
      startIcon: <ThumbUpIcon />,
      variant: "text",
    },
    thumbUp: {
      size: _DEFAULT_SIZE,
      children: "承認",
      startIcon: <ThumbUpIcon />,
    },
    thumbDown: {
      size: _DEFAULT_SIZE,
      children: "却下",
      startIcon: <ThumbDownIcon />,
    },
    clear: {
      size: _DEFAULT_SIZE,
      children: "検索条件をクリア",
      startIcon: <ClearIcon />,
    },
    edit: { size: _DEFAULT_SIZE, children: "編集", startIcon: <EditIcon /> },
    new: { size: _DEFAULT_SIZE, children: "新規作成", startIcon: <AddIcon /> },
    download: {
      size: _DEFAULT_SIZE,
      children: "CSVダウンロード",
      startIcon: <DownloadIcon />,
    },
    upload: {
      size: _DEFAULT_SIZE,
      children: "CSVアップロード",
      startIcon: <UploadIcon />,
    },
    sort: {
      size: _DEFAULT_SIZE,
      children: "並び替え",
      startIcon: <SortIcon />,
    },
    back: {
      size: _DEFAULT_SIZE,
      children: "戻る",
      startIcon: <ArrowBackIcon />,
    },
    print: { size: _DEFAULT_SIZE, children: "印刷", startIcon: <PrintIcon /> },
    prev: {
      size: _DEFAULT_SIZE,
      children: "前へ",
      startIcon: <ArrowBackIosIcon />,
    },
    next: {
      size: _DEFAULT_SIZE,
      children: "次へ",
      startIcon: <ArrowForwardIosIcon />,
    },
    dummy: {
      size: _DEFAULT_SIZE,
      children: "ダミー",
      startIcon: <BatteryChargingFullIcon />,
    },
  };

  // 存在しないモードが指定された場合のエラーハンドリング
  if (!data[mode]) {
    /*
    console.warn(
      `Button template not found for mode: ${mode}, using default template`
    );
    */
    return {
      size: _DEFAULT_SIZE,
      children: mode || "ボタン",
      variant: "contained",
      color: "primary",
    };
  }

  return data[mode];
};

export default getButtonTemplate;
