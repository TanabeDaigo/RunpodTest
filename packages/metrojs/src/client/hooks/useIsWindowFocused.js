/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                                                               ║
 * ║   MetroJS - Window Focus Hook                                 ║
 * ║   Copyright (c) 2024 Metro Digital Solutions                  ║
 * ║                                                               ║
 * ║   An elegant and powerful window focus detection hook         ║
 * ║   built with React, providing seamless focus tracking         ║
 * ║                                                               ║
 * ╚═══════════════════════════════════════════════════════════════╝
 *
 * @file useIsWindowFocused.js
 * @description ウィンドウのフォーカス状態を監視するカスタムフック
 *
 * 以下の機能を提供:
 * - ウィンドウやドキュメントのフォーカス/ブラー状態の監視
 * - ドキュメントの可視性状態の監視
 * - イベントリスナーの自動設定と解除
 * - メモリリークを防ぐためのクリーンアップ処理
 *
 * @example
 * // 基本的な使用方法
 * const [isFocused] = useIsWindowFocused();
 *
 * // フォーカス状態に応じた処理
 * useEffect(() => {
 *   if (isFocused) {
 *     // ウィンドウがフォーカスされた時の処理
 *     console.log('Window is focused');
 *   } else {
 *     // ウィンドウがフォーカスを失った時の処理
 *     console.log('Window is blurred');
 *   }
 * }, [isFocused]);
 *
 * // 自動更新の一時停止
 * useEffect(() => {
 *   if (!isFocused) {
 *     // バックグラウンド時の処理
 *     return () => {
 *       // クリーンアップ処理
 *     };
 *   }
 * }, [isFocused]);
 *
 * @author MetroJS Team
 * @version 1.0.0
 */
"use client";
import { useState, useEffect } from "react";

import logjs from "@krono-metro/metrojs/logjs";

const MODULE_NAME = "useIsWindowFocused";
const log = new logjs(MODULE_NAME);

/**
 * ウィンドウのフォーカス状態を監視するカスタムフック
 *
 * @returns {[boolean]} フォーカス状態を示すブール値の配列
 */
export const useIsWindowFocused = () => {
  const [windowIsActive, setWindowIsActive] = useState(true);

  /**
   * フォーカス状態の変更を処理する関数
   * @param {Event} e - イベントオブジェクト
   */
  const handleActivity = (e) => {
    log.info(`handleActivity -------type:${e?.type}`);
    if (e?.type == "focus") {
      return setWindowIsActive(true);
    }
    if (e?.type == "blur") {
      return setWindowIsActive(false);
    }
    if (e?.type == "visibilitychange") {
      if (document.hidden) {
        return setWindowIsActive(false);
      } else {
        return setWindowIsActive(true);
      }
    }
  };

  // イベントリスナーの設定と解除
  useEffect(() => {
    log.info(`useEffect -------`);
    document.addEventListener("visibilitychange", handleActivity);
    document.addEventListener("blur", handleActivity);
    window.addEventListener("blur", handleActivity);
    window.addEventListener("focus", handleActivity);
    document.addEventListener("focus", handleActivity);

    // クリーンアップ関数
    return () => {
      window.removeEventListener("blur", handleActivity);
      document.removeEventListener("blur", handleActivity);
      window.removeEventListener("focus", handleActivity);
      document.removeEventListener("focus", handleActivity);
      document.removeEventListener("visibilitychange", handleActivity);
    };
  }, []);

  return [windowIsActive];
};

export default useIsWindowFocused;
