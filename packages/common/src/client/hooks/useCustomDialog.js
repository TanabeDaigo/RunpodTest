/**
 * @file useCustomDialog.js
 * @description ダイアログコンポーネントの状態管理と制御を行うカスタムフック
 *
 * このモジュールは、Material-UIのダイアログコンポーネントを
 * 簡単に制御するためのカスタムフックを提供します。
 *
 * 主な機能：
 * - ダイアログの表示/非表示の制御
 * - ダイアログのパラメータ管理
 * - ダイアログコンポーネントの動的レンダリング
 *
 * @example
 * // 基本的な使用方法
 * const [dialogState, dialogProps] = useCustomDialog(MyDialogComponent);
 *
 * // ダイアログを開く
 * dialogProps.handleOpen({ title: '確認', message: '処理を実行しますか？' });
 *
 * // コンポーネント内での使用
 * return (
 *   <>
 *     <Button onClick={() => dialogProps.handleOpen()}>ダイアログを開く</Button>
 *     {dialogProps.renderDialog()}
 *   </>
 * );
 *
 * @author MetroJS Team
 * @version 1.0.0
 */

"use client";
import React from "react";
import { useState, useCallback, useMemo } from "react";

import logjs from "@metrojs/logjs";
const log = new logjs("hooks/useCustomDialog");

/**
 * ダイアログコンポーネントの状態管理と制御を行うカスタムフック
 *
 * @param {React.ComponentType} DialogComponent - ダイアログコンポーネント
 * @returns {Array} [dialogState, dialogProps] - ダイアログの状態と制御関数
 *
 * @example
 * const [dialogState, dialogProps] = useCustomDialog(MyDialogComponent);
 *
 * // ダイアログを開く
 * dialogProps.handleOpen({ title: '確認', message: '処理を実行しますか？' });
 *
 * // ダイアログを閉じる
 * dialogProps.handleClose();
 *
 * // ダイアログの表示状態を確認
 * if (dialogProps.isOpen) {
 *   // ダイアログが開いている場合の処理
 * }
 */
const useCustomDialog = (DialogComponent) => {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState({});
  const [onCloseCallback, setOnCloseCallback] = useState(null); // 個別のonCloseコールバックを保持

  const open = useCallback((_params = {}, _onClose = null) => {
    setParams(_params);
    setOnCloseCallback(() => _onClose); // コールバックを保存
    setIsOpen(true);
    log.debug("handleOpen", _params);
  }, []);

  const onClose = useCallback(
    (_result = {}) => {
      setIsOpen(false);
      log.debug("handleClose", _result);

      // 個別のonCloseコールバックが存在する場合は実行
      if (onCloseCallback) {
        onCloseCallback(_result);
      }

      return _result;
    },
    [onCloseCallback]
  );

  const dialogProps = useMemo(
    () => ({
      open: isOpen,
      onClose,
      params,
    }),
    [isOpen, params, onClose]
  );

  const renderDialog = useCallback(() => {
    if (!DialogComponent || !isOpen) {
      return null;
    }
    try {
      return React.createElement(DialogComponent, dialogProps);
    } catch (error) {
      log.error("Error rendering dialog:", error);
      return null;
    }
  }, [DialogComponent, isOpen, dialogProps]);

  return {
    open,
    onClose,
    isOpen,
    renderDialog,
  };
};

export default useCustomDialog;
