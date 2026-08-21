/**
 * @file useIconButtonEx.js
 * @description Material-UIのアイコンボタンコンポーネントを拡張したカスタムフック
 *
 * このモジュールは、フォーム内で使用するアイコンボタンコンポーネントの
 * 状態管理とプロパティ設定を簡素化するためのカスタムフックを提供します。
 *
 * 主な機能：
 * - アイコンボタンのテンプレート管理
 * - ツールチップの自動付与
 * - デバッグログ機能
 *
 * @example
 * // 基本的な使用方法
 * const [iconButtonEx] = useIconButtonEx(form, formProps);
 * const deleteButton = iconButtonEx.iconButton('delete', { onClick: handleDelete });
 *
 * // カスタムツールチップ付きの使用方法
 * const editButton = iconButtonEx.iconButton('edit', {
 *   onClick: handleEdit,
 *   title: '編集する'
 * });
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";

import { libs } from "@metrojs/client";
import Tooltip from "@mui/material/Tooltip";
//import logjs from "@metrojs/logjs";
//const log = new logjs("useIconButtonEx");

/**
 * アイコンボタンコンポーネントを拡張したカスタムフック
 *
 * @param {Object} form - フォームの状態オブジェクト
 * @param {Object} formProps - フォームのプロパティオブジェクト
 * @returns {Array} アイコンボタン関連の関数を含むオブジェクトの配列
 *
 * @example
 * const [iconButtonEx] = useIconButtonEx(form, formProps);
 * const deleteButton = iconButtonEx.iconButton('delete', { onClick: handleDelete });
 */
const useIconButtonEx = (form = {}, formProps = {}) => {
  /**
   * アイコンボタンのプロパティを設定して返す関数
   *
   * @param {string} mode - ボタンのモード (例: delete, edit など)
   * @param {Object} params - 追加のプロパティ
   * @param {boolean} is_debug - デバッグモードフラグ
   * @returns {JSX.Element} アイコンボタンコンポーネント
   *
   * @example
   * // 基本的な使用
   * const deleteButton = iconButtonEx.iconButton('delete', {
   *   onClick: handleDelete
   * });
   *
   * // カスタムツールチップ付きの使用
   * const editButton = iconButtonEx.iconButton('edit', {
   *   onClick: handleEdit,
   *   title: '編集する',
   *   disabled: !canEdit
   * });
   */
  const iconButton = (mode, params = {}, is_debug = false) => {
    const iconButtonProps = libs.getIconButtonTemplate(mode);
    const { title, ...restParams } = params;
    const { title: tooltipTitle, ...restIconButtonProps } = iconButtonProps;

    const _props = { ...restIconButtonProps, ...restParams };
    const button = formProps.iconButton(_props, is_debug);

    const finalTitle = title || tooltipTitle;
    if (finalTitle) {
      return (
        <Tooltip title={finalTitle} arrow>
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  return {
    iconButton,
  };
};

export default useIconButtonEx;
